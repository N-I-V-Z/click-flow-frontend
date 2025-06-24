import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterPublisher } from '@/queries/auth.query';
import ImageLeft from '../Image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { RegisterPublisherRequest, Role } from '@/types';
import { useRouter } from '@/routes/hooks';

type FormError = Partial<RegisterPublisherRequest>;

export default function RegisterPublisherPage() {
  const {
    mutateAsync: register,
    isPending,
    isSuccess
  } = useRegisterPublisher();
  const [showPassword, setShowPassword] = useState(false);
  const [formPublisher, setFormPublisher] = useState<RegisterPublisherRequest>({
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: Role.Publisher
  });

  const router = useRouter();

  const [error, setError] = useState<FormError>({});

  const validateInputs = (): FormError => {
    const errors: FormError = {};

    if (!formPublisher.userName.trim()) {
      errors.userName = 'Tên đăng nhập không được để trống.';
    }

    if (!formPublisher.fullName.trim()) {
      errors.fullName = 'Họ và tên không được để trống.';
    }

    if (!formPublisher.email.trim()) {
      errors.email = 'Email không được để trống.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formPublisher.email)) {
        errors.email = 'Email không hợp lệ.';
      }
    }

    if (!formPublisher.phoneNumber.trim()) {
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    } else {
      const phoneRegex = /^\d{9,11}$/;
      if (!phoneRegex.test(formPublisher.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại phải có từ 9 đến 11 chữ số.';
      }
    }

    if (!formPublisher.password.trim()) {
      errors.password = 'Mật khẩu không được để trống.';
    } else if (formPublisher.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!passwordRegex.test(formPublisher.password)) {
        errors.password =
          'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.';
      }
    }

    if (!formPublisher.confirmPassword.trim()) {
      errors.confirmPassword = 'Xác nhận mật khẩu không được để trống.';
    } else if (formPublisher.password !== formPublisher.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateInputs();
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await register(formPublisher);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Lỗi: ${err.message}`);
        setError({ email: err.message });
      } else {
        toast.error('Không thể đăng ký. Vui lòng thử lại.');
        setError({ email: 'Không thể đăng ký. Vui lòng thử lại.' });
      }
    }
  };
  if (isSuccess) {
    toast.success('Đăng ký thành công!');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  }
  return (
    <>
      {/* Custom Breadcrumb */}
      <div className="px-8 py-2">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-purple-600 transition-colors hover:text-purple-700"
            >
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">Đăng ký Publisher</span>
          </nav>
        </div>
      </div>

      <BasePages className="" pageHead="ClickFlow - Đăng ký Publisher">
        {/* Main Content */}
        <div className="-mt-8 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-4xl">
            {/* Register Card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex min-h-[500px]">
                {/* Left Side - Image */}
                <div className="relative -mt-10 hidden w-1/2 lg:block">
                  <ImageLeft />

                  {/* Optional overlay with branding */}
                  <div className="absolute inset-0 mb-16 rounded bg-gradient-to-t from-black/50 via-transparent to-transparent">
                    <div className="absolute bottom-8 left-8 text-white">
                      <h3 className="mb-2 text-2xl font-bold">
                        Trở thành Publisher
                      </h3>
                      <p className="text-white/90">
                        Kiếm tiền với affiliate marketing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="-mt-4 flex w-full flex-col justify-center p-8 lg:w-1/2">
                  {/* Logo */}
                  <div className="text-center">
                    <Link to="/" className="inline-block">
                      <img
                        src="/assets/logo.jpg"
                        alt="ClickFlow Logo"
                        className="mx-auto h-16 w-auto rounded-xl shadow-md"
                      />
                    </Link>
                  </div>

                  {/* Form Header */}
                  <div className="mb-6 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                      Đăng ký Publisher
                    </h1>
                    <p className="text-sm text-gray-600">
                      Tạo tài khoản để bắt đầu kiếm tiền trên{' '}
                      <Link
                        to="/"
                        className="font-medium text-purple-600 transition-colors hover:text-purple-700"
                      >
                        ClickFlow.vn
                      </Link>
                    </p>
                  </div>

                  {/* Notice Box */}
                  <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <p className="text-sm text-purple-700">
                      Đã có tài khoản Publisher?{' '}
                      <Link
                        to="/login"
                        className="font-semibold text-purple-600 hover:text-purple-700"
                      >
                        Đăng nhập ngay
                      </Link>
                    </p>
                  </div>

                  {/* Register Form */}
                  <div className="-mr-4 space-y-3">
                    {/* Row 1: Username + Full Name */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {/* Username */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Tên đăng nhập
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập tên đăng nhập"
                            value={formPublisher.userName}
                            onChange={(e) =>
                              setFormPublisher({
                                ...formPublisher,
                                userName: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.userName && (
                          <p className="text-red-600 mt-2 text-sm">
                            {error.userName}
                          </p>
                        )}
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Họ và tên
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập họ và tên"
                            value={formPublisher.fullName}
                            onChange={(e) =>
                              setFormPublisher({
                                ...formPublisher,
                                fullName: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.fullName && (
                          <p className="text-red-600 mt-2 text-sm">
                            {error.fullName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Email + Phone */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type="email"
                            placeholder="Nhập email"
                            value={formPublisher.email}
                            onChange={(e) =>
                              setFormPublisher({
                                ...formPublisher,
                                email: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.email && (
                          <p className="text-red-600 mt-2 text-sm">
                            {error.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập số điện thoại"
                            value={formPublisher.phoneNumber}
                            onChange={(e) =>
                              setFormPublisher({
                                ...formPublisher,
                                phoneNumber: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.phoneNumber && (
                          <p className="text-red-600 mt-2 text-sm">
                            {error.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Password + Confirm Password */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {/* Password */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            value={formPublisher.password}
                            onChange={(e) =>
                              setFormPublisher({
                                ...formPublisher,
                                password: e.target.value
                              })
                            }
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {error.password && (
                          <p className="text-red-600 mt-2 text-sm">
                            {error.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Xác nhận mật khẩu"
                            value={formPublisher.confirmPassword}
                            onChange={(e) =>
                              setFormPublisher({
                                ...formPublisher,
                                confirmPassword: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.confirmPassword && (
                          <p className="text-red-600 mt-2 text-sm">
                            {error.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button
                      className="group h-10 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                      onClick={handleRegister}
                      disabled={isPending}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isPending ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            Hoàn tất đăng ký
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </Button>

                    {/* Divider */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500">
                          Hoặc
                        </span>
                      </div>
                    </div>

                    {/* Advertiser Link */}
                    <div className="text-center">
                      <p className="mb-3 text-sm text-gray-600">
                        Bạn muốn quảng cáo sản phẩm?
                      </p>
                      <Link to="/register-advertiser">
                        <Button
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 h-10 w-full rounded-lg bg-white transition-all"
                        >
                          Đăng ký Advertiser
                        </Button>
                      </Link>
                    </div>

                    {/* Terms */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-xs text-gray-600">
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <Link
                          to="/terms"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link
                          to="/privacy"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Chính sách bảo mật
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BasePages>

      <Footer />
      <ToastContainer />
    </>
  );
}
