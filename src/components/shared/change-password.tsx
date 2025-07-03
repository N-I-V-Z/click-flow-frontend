import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { useChangePassword } from './../../queries/auth.query';
import BasePages from './base-pages';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
            // Reset form
            setFormData({
              oldPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
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
    <BasePages pageHead="ClickFlow - Đổi mật khẩu ">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-24 py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form đổi mật khẩu */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <div className="flex items-center space-x-3">
                    <FaLock className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">
                      Đổi mật khẩu
                    </h2>
                  </div>
                </div>

                <div className="p-12">
                  <form className="max-w-4xl space-y-6" onSubmit={handleSubmit}>
                    {/* Mật khẩu cũ */}
                    <div>
                      <label
                        htmlFor="oldPassword"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Mật khẩu hiện tại
                      </label>
                      <div className="relative">
                        <input
                          id="oldPassword"
                          name="oldPassword"
                          type={showOldPassword ? 'text' : 'password'}
                          required
                          className="block w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500"
                          value={formData.oldPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              oldPassword: e.target.value
                            })
                          }
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? (
                            <FaEyeSlash className="h-5 w-5" />
                          ) : (
                            <FaEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Mật khẩu mới */}
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          className="block w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value
                            })
                          }
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <FaEyeSlash className="h-5 w-5" />
                          ) : (
                            <FaEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red mt-2 flex items-center text-sm">
                          <FaTimes className="mr-2 h-4 w-4" />{' '}
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          className="block w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value
                            })
                          }
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="h-5 w-5" />
                          ) : (
                            <FaEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red mt-2 flex items-center text-sm">
                          <FaTimes className="mr-2 h-4 w-4" />{' '}
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="pt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={
                            Object.keys(errors).length > 0 ||
                            changePasswordMutation.isPending
                          }
                          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          {changePasswordMutation.isPending
                            ? 'Đang cập nhật...'
                            : 'Cập nhật mật khẩu'}
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-center text-xs text-gray-600">
                      Nếu gặp vấn đề khi đổi mật khẩu, xin vui lòng liên hệ bộ
                      phận hỗ trợ
                      <br />
                      <span className="font-semibold">
                        clickflow.connect@gmail.com
                      </span>{' '}
                      hoặc số điện thoại{' '}
                      <span className="font-semibold">0123-456-789</span>.
                    </p>
                  </form>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="border-0 shadow-xl">
                <div className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-gray-800">
                    Yêu cầu mật khẩu
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>
                      <p className="text-sm text-gray-600">
                        Mật khẩu phải có ít nhất 8 ký tự
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>
                      <p className="text-sm text-gray-600">
                        Bao gồm chữ hoa và chữ thường
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>
                      <p className="text-sm text-gray-600">
                        Bao gồm ít nhất một số
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>
                      <p className="text-sm text-gray-600">
                        Bao gồm ký tự đặc biệt
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-xl">
                <div className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-gray-800">
                    Bảo mật tài khoản
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Không chia sẻ mật khẩu với bất
                        kỳ ai và thường xuyên thay đổi mật khẩu để bảo vệ tài
                        khoản của bạn.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

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
    </BasePages>
  );
};

export default ChangePassword;
