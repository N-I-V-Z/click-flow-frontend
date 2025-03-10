import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaTimes, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 12.5;
    return score;
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-yellow-500';
    if (strength <= 75) return 'bg-green-500';
    return 'bg-emerald-700';
  };

  const getStrengthText = (strength: number): string => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Moderate';
    if (strength <= 75) return 'Strong';
    return 'Very Strong';
  };

  useEffect(() => {
    const newStrength = calculateStrength(formData.password);
    setStrength(newStrength);

    const newErrors: Record<string, string> = {};
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Mật khẩu có ít nhất 8 kí tự';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Bao gồm chữ cái viết hoa';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Bao gồm chữ cái thường';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Bao gồm số';
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'Bao gồm kí tự đặc biệt';
      }
    }

    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      console.log('Password reset submitted');
      // Thêm xử lý reset hoặc thông báo thành công tại đây.
    }
    toast.success(`Đổi mật khẩu thành công!`);
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ email
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 transition focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 transition focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 flex items-center text-sm text-red">
                <FaTimes className="mr-1" /> {errors.password}
              </p>
            )}
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Độ mạnh mật khẩu:</span>
                <span className="font-medium">{getStrengthText(strength)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
            </div>
          </div>

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
