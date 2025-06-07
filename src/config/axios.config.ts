import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import helpers from '../helpers';
import { ApiResponse } from '@/types';

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
  // helpers.cookie_delete('AT');
  // window.location.href = '/login';
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
      // Lấy access token hiện tại từ cookie
      const currentAccessToken = helpers.cookie_get('AT');

      if (!currentAccessToken) {
        console.error('No access token found');
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      // Gọi API renew token với access token hiện tại
      const response = await axios.post(
        '/api/Accounts/renew-token',
        {},
        {
          headers: {
            Authorization: `Bearer ${currentAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response);

      // Kiểm tra nếu response hợp lệ và có token mới
      if (!response || !response.data || !response.data.accessToken) {
        console.error('Failed to renew token, response invalid');
        processQueue(error, null);
        logout();
        return Promise.reject(error);
      }

      // Lấy token mới và lưu vào cookie
      const newAccessToken = response.data.accessToken;
      helpers.cookie_set('AT', newAccessToken);

      // Xử lý queue với token mới
      processQueue(null, newAccessToken);

      // Cập nhật header của request gốc và retry request
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    } catch (renewError) {
      console.error('Error renewing token:', renewError);
      processQueue(renewError, null);
      logout();
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
  Put: async (url: string, data: any) => {
    try {
      const response = await axios.put<any>(url, data);
      return response;
    } catch (err) {
      console.log('err', err);
    }
  },
  Delete: async (url: string) => {
    try {
      const response = await axios.delete(url);
      return response;
    } catch (err) {
      console.log('err', err);
    }
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
