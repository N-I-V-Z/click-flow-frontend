import React, { useState } from 'react';
import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useRegisterAdvertiser } from '@/queries/auth.query';
import ImageLeft from '../Image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Building,
  Globe,
  Users,
  Briefcase
} from 'lucide-react';
import { Industry, RegisterAdvertiserRequest, Role } from '@/types';

type FormError = Partial<RegisterAdvertiserRequest>;

const industryOptions = [
  { value: Industry.FoodAndBeverage, displayName: 'Thực phẩm và đồ uống' },
  { value: Industry.Tourism, displayName: 'Du lịch' },
  { value: Industry.Education, displayName: 'Giáo dục' },
  { value: Industry.Other, displayName: 'Khác' }
];

const RegisterAdvertiserPage: React.FC = () => {
  const { isPending } = useRegisterAdvertiser();

  const [formAdvertiser, setFormAdvertiser] =
    useState<RegisterAdvertiserRequest>({
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: Role.Advertiser,
      companyName: '',
      introductionWebsite: '',
      staffSize: '',
      industry: ''
    });
  const [error, setError] = useState<FormError>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = (): FormError => {
    const errors: FormError = {};

    if (!formAdvertiser.userName.trim()) {
      errors.userName = 'Tên đăng nhập không được để trống.';
    }
    if (!formAdvertiser.email.trim()) {
      errors.email = 'Email không được để trống.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formAdvertiser.email)) {
        errors.email = 'Email không hợp lệ.';
      }
    }
    if (!formAdvertiser.phoneNumber.trim()) {
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    } else {
      const phoneRegex = /^\d{9,11}$/;
      if (!phoneRegex.test(formAdvertiser.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại phải có từ 9 đến 11 chữ số.';
      }
    }
    if (!formAdvertiser.password.trim()) {
      errors.password = 'Mật khẩu không được để trống.';
    } else if (formAdvertiser.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!passwordRegex.test(formAdvertiser.password)) {
        errors.password =
          'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.';
      }
    }
    if (!formAdvertiser.confirmPassword.trim()) {
      errors.confirmPassword = 'Xác nhận mật khẩu không được để trống.';
    } else if (formAdvertiser.password !== formAdvertiser.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    if (!formAdvertiser.fullName.trim()) {
      errors.fullName = 'Họ và tên không được để trống.';
    }
    if (!formAdvertiser.companyName.trim()) {
      errors.companyName = 'Tên công ty không được để trống.';
    }
    if (!formAdvertiser.introductionWebsite.trim()) {
      errors.introductionWebsite = 'Website giới thiệu không được để trống.';
    }
    if (!formAdvertiser.staffSize.trim()) {
      errors.staffSize = 'Quy mô hoạt động không được để trống.';
    }
    if (!formAdvertiser.industry || !formAdvertiser.industry.trim()) {
      errors.industry = 'Lĩnh vực hoạt động không được để trống.';
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
      toast.success('Đăng ký thành công!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
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

  return (
    <>
      {/* Custom Breadcrumb */}
      <div className="mt-2 px-8 py-2">
        <div className="mx-auto max-w-6xl">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-purple-600 transition-colors hover:text-purple-700"
            >
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">
              Đăng ký Advertiser
            </span>
          </nav>
        </div>
      </div>

      <BasePages className="" pageHead="ClickFlow - Đăng ký Advertiser">
        {/* Main Content */}
        <div className="-mt-8 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-5xl">
            {/* Register Card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex min-h-[600px]">
                {/* Left Side - Image */}
                <div className="relative -mt-10 hidden w-3/5 lg:block">
                  <div className="h-full w-full">
                    <ImageLeft />
                  </div>

                  {/* Overlay with branding */}
                  <div className="absolute inset-0 mb-16 rounded bg-gradient-to-t from-black/50 via-transparent to-transparent">
                    <div className="absolute bottom-8 left-8 text-white">
                      <h3 className="mb-2 text-2xl font-bold">
                        Tham gia ClickFlow
                      </h3>
                      <p className="text-white/90">
                        Mở rộng doanh nghiệp với affiliate marketing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex w-full flex-col justify-center p-8 lg:w-3/5">
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
                      Đăng ký Advertiser
                    </h1>
                    <p className="text-sm text-gray-600">
                      Tạo tài khoản để bắt đầu quảng cáo trên{' '}
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
                      Đã có tài khoản?{' '}
                      <Link
                        to="/login"
                        className="font-semibold text-purple-600 hover:text-purple-700"
                      >
                        Đăng nhập ngay
                      </Link>
                    </p>
                  </div>

                  {/* Register Form */}
                  <div className="mb-2 max-h-96 space-y-4 pr-2">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Username */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Tên đăng nhập
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập tên đăng nhập"
                            value={formAdvertiser.userName}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                userName: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.userName && (
                          <p className="text-red-600 mt-1 text-xs">
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
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập họ và tên"
                            value={formAdvertiser.fullName}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                fullName: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.fullName && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type="email"
                            placeholder="Nhập email"
                            value={formAdvertiser.email}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                email: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.email && (
                          <p className="text-red-600 mt-1 text-xs">
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
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập số điện thoại"
                            value={formAdvertiser.phoneNumber}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                phoneNumber: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.phoneNumber && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.phoneNumber}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Mật khẩu
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 pr-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            value={formAdvertiser.password}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                password: e.target.value
                              })
                            }
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {error.password && (
                          <p className="text-red-600 mt-1 text-xs">
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
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 pr-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Xác nhận mật khẩu"
                            value={formAdvertiser.confirmPassword}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                confirmPassword: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.confirmPassword && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Tên công ty
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Building className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Nhập tên công ty"
                            value={formAdvertiser.companyName}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                companyName: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.companyName && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.companyName}
                          </p>
                        )}
                      </div>

                      {/* Website */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Globe className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            type="url"
                            placeholder="https://example.com"
                            value={formAdvertiser.introductionWebsite}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                introductionWebsite: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.introductionWebsite && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.introductionWebsite}
                          </p>
                        )}
                      </div>

                      {/* Staff Size */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Quy mô nhân sự
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Users className="h-4 w-4 text-gray-400" />
                          </div>
                          <Input
                            className="h-10 rounded-lg border-gray-300 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Ví dụ: 1-10 nhân viên"
                            value={formAdvertiser.staffSize}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                staffSize: e.target.value
                              })
                            }
                          />
                        </div>
                        {error.staffSize && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.staffSize}
                          </p>
                        )}
                      </div>

                      {/* Industry */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Lĩnh vực hoạt động
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                          </div>
                          <select
                            className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
                            value={formAdvertiser.industry}
                            onChange={(e) =>
                              setFormAdvertiser({
                                ...formAdvertiser,
                                industry: e.target.value
                              })
                            }
                          >
                            <option value="">Chọn lĩnh vực</option>
                            {industryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.displayName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {error.industry && (
                          <p className="text-red-600 mt-1 text-xs">
                            {error.industry}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <div className="mt-6">
                    <Button
                      className="group h-11 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
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
                          'Hoàn tất đăng ký'
                        )}
                      </span>
                    </Button>
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
      </BasePages>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default RegisterAdvertiserPage;
