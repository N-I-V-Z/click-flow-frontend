import { toast } from 'react-toastify';

// Custom toast wrapper với cấu hình mặc định
export const showToast = {
  success: (message: string, options?: { autoClose?: number }) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: options?.autoClose ?? 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  },

  error: (message: string, options?: { autoClose?: number }) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: options?.autoClose ?? 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  },

  warning: (message: string, options?: { autoClose?: number }) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: options?.autoClose ?? 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  },

  info: (message: string, options?: { autoClose?: number }) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: options?.autoClose ?? 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  }
};
