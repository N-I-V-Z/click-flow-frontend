import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterPublisher } from '@/queries/auth.query';
import ImageLeft from '../Image';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
type FormPublisher = {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

type FormError = Partial<FormPublisher>;

export default function RegisterPublisherPage() {
  const { mutateAsync, isLoading } = useRegisterPublisher();
  const [showPassword, setShowPassword] = useState(false);
  // State lưu trữ dữ liệu form
  const [formPublisher, setFormPublisher] = useState<FormPublisher>({
    userName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  // State lưu trữ lỗi
  const [error, setError] = useState<FormError>({});

  // Hàm kiểm tra lỗi đầu vào
  const validateInputs = (): FormError => {
    const errors: FormError = {};

    // Kiểm tra tên đăng nhập
    if (!formPublisher.userName.trim()) {
      errors.userName = 'Họ và tên không được để trống.';
    }

    // Kiểm tra email: không để trống và đúng định dạng
    if (!formPublisher.email.trim()) {
      errors.email = 'Email không được để trống.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formPublisher.email)) {
        errors.email = 'Email không hợp lệ.';
      }
    }

    // Kiểm tra số điện thoại: không để trống và chỉ chứa số, độ dài từ 9 đến 11 chữ số
    if (!formPublisher.phoneNumber.trim()) {
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    } else {
      const phoneRegex = /^\d{9,11}$/;
      if (!phoneRegex.test(formPublisher.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại phải có từ 9 đến 11 chữ số.';
      }
    }

    // Kiểm tra mật khẩu: không để trống và phải có ít nhất 6 ký tự
    if (!formPublisher.password.trim()) {
      errors.password = 'Mật khẩu không được để trống.';
    } else if (formPublisher.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    } else {
      // Kiểm tra mật khẩu chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!passwordRegex.test(formPublisher.password)) {
        errors.password =
          'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.';
      }
    }

    return errors;
  };

  // Xử lý khi người dùng bấm "Hoàn tất"
  const handleRegister = async () => {
    const errors = validateInputs();
    setError(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await mutateAsync(formPublisher);
      toast.success('Đăng ký thành công!');
      // Sau 1 vài giây chuyển hướng
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setError({ email: 'Không thể đăng ký. Vui lòng thử lại.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto mb-20 w-[60%] flex-1 p-3"
        pageHead="Đăng ký publisher | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng ký', link: '/register-publisher' }
        ]}
      >
        <div className="mx-auto mt-5 flex min-h-[400px] w-full rounded-xl bg-white p-6 shadow-xl">
          {/* Bên trái - Hình ảnh */}
          <div className="hidden w-full lg:block lg:w-1/2">
            <ImageLeft />
          </div>
          {/* Bên phải - Form */}
          <div className="w-full px-6 lg:w-1/2">
            <Link to="/">
              <img
                src="src/assets/logo.jpg"
                alt="Logo"
                className="w-30 mx-auto mt-5 h-20 rounded-lg"
              />
            </Link>
            <h1 className="text-center text-2xl font-semibold text-gray-800">
              Đăng ký tài khoản
            </h1>
            <p className="mb-3 text-center text-lg font-medium text-[#FFD000]">
              Dành cho Publisher
            </p>
            <div className="mt-2 rounded-lg bg-purple-100 p-4 text-center">
              <p className="text-sm text-gray-700">
                Nếu bạn đã{' '}
                <span className="font-semibold text-purple-500">
                  có tài khoản Publisher
                </span>{' '}
                trên các sản phẩm của CLICK FLOW, bạn có thể sử dụng để đăng
                nhập ngay và không cần đăng ký lại.
              </p>
              <p className="mt-2 text-sm">
                Bạn đã có tài khoản?{' '}
                <Link to="/login" className="font-semibold text-purple-500">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {/* Tên đăng nhập */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <Input
                  value={formPublisher.userName}
                  onChange={(e) =>
                    setFormPublisher({
                      ...formPublisher,
                      userName: e.target.value
                    })
                  }
                />
                {error.userName && (
                  <p className="text-xs text-red">{error.userName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  value={formPublisher.email}
                  onChange={(e) =>
                    setFormPublisher({
                      ...formPublisher,
                      email: e.target.value
                    })
                  }
                />
                {error.email && (
                  <p className="text-xs text-red">{error.email}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <Input
                  value={formPublisher.phoneNumber}
                  onChange={(e) =>
                    setFormPublisher({
                      ...formPublisher,
                      phoneNumber: e.target.value
                    })
                  }
                />
                {error.phoneNumber && (
                  <p className="text-xs text-red">{error.phoneNumber}</p>
                )}
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formPublisher.password}
                    onChange={(e) =>
                      setFormPublisher({
                        ...formPublisher,
                        password: e.target.value
                      })
                    }
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </div>
                </div>
                {error.password && (
                  <p className="text-xs text-red">{error.password}</p>
                )}
              </div>

              {/* Nút đăng ký */}
              <div className="flex justify-center pt-4">
                <Button
                  className="hover:bg-yellow-600 w-full rounded-lg bg-purple-600 text-white"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Hoàn tất'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </BasePages>
      <Footer />
    </>
  );
}
