import axios from 'axios';
import helpers from '../helpers';

const baseURL = 'https://localhost:7087/';
const token = helpers.cookie_get('AT');

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
const onResponseSuccess = (response: any) => {
  return response.data;
};

/**
 * Xử lý lỗi khi nhận phản hồi từ server.
 *
 * Nếu phản hồi có lỗi và mã trạng thái là 401, thực hiện các hành động cần thiết.
 * Trả về một Promise bị từ chối với dữ liệu lỗi từ phản hồi.
 * Nếu không có phản hồi, trả về một Promise bị từ chối với lỗi gốc.
 */
const onResponseError = async (error: any) => {
  if (error.response) {
    if (error.response.status === 401) {
      try {
        // Lấy refresh token từ cookie
        const refreshToken = helpers.cookie_get('RT');
        if (!refreshToken) {
          console.error('No refresh token found');
          return Promise.reject(error);
        }

        // Lấy access token từ cookie
        const token = helpers.cookie_get('AT');
        if (!token) {
          console.error('No token found');
          return Promise.reject(error);
        }

        // Gọi API renew token
        const response = await axios.post('/api/Accounts/renew-token', {
          token,
          refreshToken
        });

        // Kiểm tra nếu response tồn tại và có dữ liệu hợp lệ
        if (!response || !response.data || !response.data.accessToken) {
          console.error('Failed to renew token, response invalid');
          return Promise.reject(error);
        }

        // Lưu token mới vào cookie
        const newAccessToken = response.data.token;
        helpers.cookie_set('AT', newAccessToken);
        helpers.cookie_set('RT', response.data.refreshToken); // Cập nhật refresh token
        // Gửi lại request bị lỗi với token mới
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(error.config);
      } catch (renewError) {
        console.error('Error renewing token:', renewError);
        return Promise.reject(renewError);
      }
    }
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error);
};

axios.interceptors.request.use(onRequestSuccess, onRequestError);
axios.interceptors.response.use(onResponseSuccess, onResponseError);
axios.defaults.baseURL = baseURL;

const BaseRequest = {
  Get: async (url: string) => {
    try {
      const response = await axios.get(url);
      return response;
    } catch (err) {
      console.log('err', err);
    }
  },
  Post: async (url: string, data?: any) => {
    try {
      const response = await axios.post<any>(url, data);
      return response;
    } catch (err) {
      console.log('err', err);
    }
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
