import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useChangePassword } from '@/queries/auth.query';
import BasePages from '@/components/shared/base-pages';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminChangePassword: React.FC = () => {
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
    if (Object.keys(errors).length === 0 && formData.oldPassword) {
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
          onError: (error: unknown) => {
            const errorMessage =
              error && typeof error === 'object' && 'message' in error
                ? (error as { message: string }).message
                : 'Có lỗi xảy ra, vui lòng thử lại!';
            toast.error(errorMessage);
          }
        }
      );
    } else {
      toast.error('Vui lòng kiểm tra lại các lỗi');
    }
  };

  return (
    <BasePages
      pageHead="ClickFlow Admin - Đổi mật khẩu"
      breadcrumbs={[
        { title: 'Dashboard', link: '/admin/dashboard' },
        { title: 'Đổi mật khẩu', link: '/admin/change-password' }
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-sm">
              🔐 Đổi mật khẩu Admin
            </h1>
            <p className="mt-2 text-gray-600">
              Thay đổi mật khẩu để bảo mật tài khoản quản trị viên của bạn
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form đổi mật khẩu */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-xl">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <div className="flex items-center space-x-3">
                      <FaLock className="h-6 w-6 text-white" />
                      <h2 className="text-2xl font-bold text-white">
                        Thay đổi mật khẩu
                      </h2>
                    </div>
                  </div>

                  <div className="p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                          <p className="mt-2 flex items-center text-sm text-red-600">
                            <FaTimes className="mr-2 h-4 w-4" />
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
                          <p className="mt-2 flex items-center text-sm text-red-600">
                            <FaTimes className="mr-2 h-4 w-4" />
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
                              !formData.oldPassword ||
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

                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm text-amber-800">
                          <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành
                          công, bạn có thể cần đăng nhập lại để đảm bảo bảo mật.
                        </p>
                      </div>
                    </form>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Yêu cầu mật khẩu */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              {/* Bảo mật tài khoản Admin */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-xl">
                  <div className="p-6">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">
                      Bảo mật Admin
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                          <strong>Quan trọng:</strong> Tài khoản Admin có quyền
                          truy cập toàn hệ thống. Hãy sử dụng mật khẩu mạnh và
                          không chia sẻ với ai.
                        </p>
                      </div>
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Khuyến nghị:</strong> Thay đổi mật khẩu định
                          kỳ (3-6 tháng/lần) để đảm bảo bảo mật tối đa.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Liên hệ hỗ trợ */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-xl">
                  <div className="p-6">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">
                      Hỗ trợ kỹ thuật
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Gặp vấn đề khi đổi mật khẩu? Liên hệ:
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Email:</strong>{' '}
                          admin.clickflow.connect@gmail.com
                        </p>
                        <p className="text-sm">
                          <strong>Hotline:</strong> 1900-xxxx (24/7)
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default AdminChangePassword;
