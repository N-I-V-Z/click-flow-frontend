import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { useChangePassword } from './../../queries/auth.query';

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hàm kiểm tra tính hợp lệ của mật khẩu mới
  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Mật khẩu có ít nhất 8 kí tự';
    if (!/[A-Z]/.test(password)) return 'Bao gồm chữ cái viết hoa';
    if (!/[a-z]/.test(password)) return 'Bao gồm chữ cái thường';
    if (!/[0-9]/.test(password)) return 'Bao gồm số';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Bao gồm kí tự đặc biệt';
    return '';
  };

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Kiểm tra mật khẩu mới
    if (formData.newPassword) {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) newErrors.newPassword = passwordError;
    }

    // Kiểm tra xác nhận mật khẩu
    if (
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
  }, [formData.newPassword, formData.confirmPassword]);

  const changePasswordMutation = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      changePasswordMutation.mutate(
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmedNewPassword: formData.confirmPassword
        },
        {
          onSuccess: () => {
            toast.success('Đổi mật khẩu thành công!');
            // Reset form hoặc xử lý bổ sung nếu cần
          },
          onError: () => {
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
          }
        }
      );
    } else {
      toast.error('Vui lòng kiểm tra lại các lỗi');
    }
  };

  return (
    <div className="mx-80 mt-5 flex max-h-screen items-center p-1">
      <motion.div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 text-center">
          <FaLock className="mx-auto h-10 w-10 text-black" />
          <h2 className="mt-3 text-2xl font-bold text-black">
            Thay đổi mật khẩu
          </h2>
        </div>
        <form className="space-y-5 p-6" onSubmit={handleSubmit}>
          {/* Mật khẩu cũ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu cũ
            </label>
            <div className="relative mt-1">
              <input
                type={showOldPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 transition focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.oldPassword}
                onChange={(e) =>
                  setFormData({ ...formData, oldPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 transition focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 flex items-center text-sm text-red">
                <FaTimes className="mr-1" /> {errors.newPassword}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 transition focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 flex items-center text-sm text-red">
                <FaTimes className="mr-1" /> {errors.confirmPassword}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white shadow transition-all duration-200 disabled:bg-gray-400"
          >
            Đổi mật khẩu
          </motion.button>
        </form>
      </motion.div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ChangePassword;
