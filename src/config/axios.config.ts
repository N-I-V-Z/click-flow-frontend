import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import helpers from '../helpers';
import { ApiResponse, LoginApiResponse } from '@/types';

const baseURL = import.meta.env.VITE_API_URL;

// Biến để theo dõi trạng thái refresh token để tránh multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Hàm xử lý thành công yêu cầu trước khi gửi đi
 * Thêm tiêu đề 'Authorization' với token lấy từ cookie
 * @param config - Cấu hình yêu cầu
 */
const onRequestSuccess = (config: any) => {
  const accessToken = helpers.cookie_get('AT');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
};

/**
 * Xử lý lỗi khi gửi yêu cầu HTTP.
 *
 * @param error - Lỗi xảy ra trong quá trình gửi yêu cầu
 *
 * @description
 * Hàm này được sử dụng trong interceptor của axios để bắt lỗi xảy ra trong quá trình gửi yêu cầu và trả về một Promise bị từ chối với lỗi đó.
 */
const onRequestError = (error: any) => {
  return Promise.reject(error);
};

/**
 * Xử lý thành công phản hồi từ máy chủ.
 *
 * @param response - Đối tượng phản hồi từ máy chủ
 *
 * @description
 * Hàm này được gọi khi một phản hồi từ máy chủ được nhận thành công.
 * Nó trả về dữ liệu từ phản hồi.
 */
const onResponseSuccess = <T>(
  response: AxiosResponse<ApiResponse<T>>
): AxiosResponse<ApiResponse<T>> => {
  return response;
};

/**
 * Hàm logout - xóa tokens và redirect về trang login
 */
const logout = () => {
  helpers.cookie_delete('AT');
  helpers.cookie_delete('RT');
  // Delay redirect để tránh race condition
  setTimeout(() => {
    window.location.href = '/login';
  }, 100);
};

/**
 * Xử lý lỗi khi nhận phản hồi từ server.
 *
 * Nếu phản hồi có lỗi và mã trạng thái là 401, thực hiện refresh token.
 * Sử dụng queue để xử lý multiple requests đồng thời khi token expired.
 */
const onResponseError = async (error: any) => {
  const originalRequest = error.config;

  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    if (isRefreshing) {
      // Nếu đang refresh token, đưa request vào queue
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Lấy cả access token và refresh token từ cookie
      const currentAccessToken = helpers.cookie_get('AT');
      const currentRefreshToken = helpers.cookie_get('RT');

      if (!currentAccessToken || !currentRefreshToken) {
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      // Gọi API renew token với body chứa token và refreshToken
      const response = await axios.post<ApiResponse<LoginApiResponse>>(
        '/api/Accounts/renew-token',
        {
          token: currentAccessToken,
          refreshToken: currentRefreshToken
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          baseURL: baseURL
        }
      );
      // Kiểm tra nếu response hợp lệ
      if (!response || !response.data || response.status !== 200) {
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      const responseData = response.data;

      // Kiểm tra API response format chuẩn
      if (!responseData.isSuccess || responseData.statusCode !== 'OK') {
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      // Kiểm tra result object
      const result = responseData.result;
      if (!result) {
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      // FIX: Lấy token từ đúng đường dẫn trong response structure
      const newAccessToken = result.token;
      const newRefreshToken = result.refreshToken;

      if (!newAccessToken) {
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      // Lưu tokens mới vào cookie
      helpers.cookie_set('AT', newAccessToken);

      if (newRefreshToken) {
        helpers.cookie_set('RT', newRefreshToken);
      }
      // Xử lý queue với token mới
      processQueue(null, newAccessToken);
      // Wrap retry request trong try-catch để tránh loop
      try {
        const retryResponse = await axios(originalRequest);
        return retryResponse;
      } catch (retryError: any) {
        // Không logout nếu original request fail, chỉ return error
        return Promise.reject(retryError);
      }
    } catch (renewError: any) {
      // Chỉ logout nếu là lỗi 401 hoặc 403 (unauthorized/forbidden)
      if (
        renewError?.response &&
        [401, 403].includes(renewError.response.status)
      ) {
        processQueue(renewError, null);
        logout();
      } else {
        processQueue(renewError, null);
      }
      return Promise.reject(renewError);
    } finally {
      isRefreshing = false;
    }
  }

  // Nếu không phải lỗi 401 hoặc đã retry rồi
  if (error.response) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error);
};

axios.interceptors.request.use(onRequestSuccess, onRequestError);
axios.interceptors.response.use(onResponseSuccess, onResponseError);
axios.defaults.baseURL = baseURL;

const BaseRequest = {
  Get: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await axios.get<ApiResponse<T>>(url);
    return response.data;
  },
  Post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await axios.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },
  Put: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    const response = await axios.put<ApiResponse<T>>(url, data);
    return response.data;
  },
  Delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await axios.delete(url);
    return response.data;
  },
  UploadStockPhoto: async (file: File) => {
    try {
      const token = helpers.cookie_get('AT');
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        'api/Image/upload-customize-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            client: 'tfu_admin',
            ...(token ? { Authorization: `Bearer ${token}` } : {}) // Chỉ thêm Authorization nếu có token
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Error uploading stock photo:', error);
      throw error; // Bắn lỗi ra ngoài để xử lý tại nơi sử dụng
    }
  }
};

export default BaseRequest;
