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
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

type FormAdvertiser = {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  companyName: string;
  introductionWebsite: string;
  staffSize: string;
  industry: string;
};

type FormError = Partial<FormAdvertiser>;

const industryOptions = [
  { value: 0, name: 'FoodAndBeverage', displayName: 'Thực phẩm và đồ uống' },
  { value: 1, name: 'Tourism', displayName: 'Du lịch' },
  { value: 2, name: 'Education', displayName: 'Giáo dục' },
  { value: 3, name: 'Other', displayName: 'Khác' }
];

const RegisterAdvertiserPage: React.FC = () => {
  const { mutateAsync, isPending } = useRegisterAdvertiser();

  const [formAdvertiser, setFormAdvertiser] = useState<FormAdvertiser>({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    companyName: '',
    introductionWebsite: '',
    staffSize: '',
    industry: ''
  });

  const [error, setError] = useState<FormError>({});
  // State để điều khiển ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = (): FormError => {
    const errors: FormError = {};

    if (!formAdvertiser.userName.trim()) {
      errors.userName = 'Họ và tên đăng nhập không được để trống.';
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
    if (!formAdvertiser.companyName.trim()) {
      errors.companyName = 'Tên công ty không được để trống.';
    }
    if (!formAdvertiser.introductionWebsite.trim()) {
      errors.introductionWebsite = 'Website giới thiệu không được để trống.';
    }
    if (!formAdvertiser.staffSize.trim()) {
      errors.staffSize = 'Quy mô hoạt động không được để trống.';
    }
    if (!formAdvertiser.industry.trim()) {
      errors.industry = 'Lĩnh vực hoạt động không được để trống.';
    }

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateInputs();
    setError(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await mutateAsync(formAdvertiser);
      toast.success('Đăng ký thành công!');
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
        className="relative mx-auto mb-20 w-[70%] flex-1 p-3"
        pageHead="Đăng ký advertiser | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng ký', link: '/register-advertiser' }
        ]}
      >
        <div className="mx-auto mt-5 flex min-h-[400px] w-full rounded-xl bg-white p-6 shadow-xl">
          {/* Bên trái - Hình ảnh */}
          <div className="hidden lg:block lg:w-1/2">
            <ImageLeft />
          </div>
          {/* Bên phải - Form */}
          <div className="w-full px-6 lg:w-1/2">
            <Link to="/">
              <img
                src="src/assets/logo.jpg"
                alt="Logo"
                className="w-30 mx-auto h-20 rounded-lg"
              />
            </Link>
            <h1 className="mt-4 text-center text-2xl font-semibold text-gray-800">
              Đăng ký tài khoản
            </h1>
            <p className="mb-6 text-center text-lg font-medium text-[#FFD000]">
              Dành cho Advertiser
            </p>
            <div className="mt-2 rounded-lg bg-purple-100 p-4 text-center">
              <p className="text-sm text-gray-700">
                Nếu bạn đã{' '}
                <span className="font-semibold text-purple-500">
                  có tài khoản Advertiser
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

            <div className="space-y-6">
              {/* Phần 1: Thông tin cá nhân */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Thông tin cá nhân
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tên đăng nhập
                    </label>
                    <Input
                      value={formAdvertiser.userName}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          userName: e.target.value
                        })
                      }
                    />
                    {error.userName && (
                      <p className="text-xs text-red">{error.userName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      value={formAdvertiser.email}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          email: e.target.value
                        })
                      }
                    />
                    {error.email && (
                      <p className="text-xs text-red">{error.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <Input
                      value={formAdvertiser.phoneNumber}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          phoneNumber: e.target.value
                        })
                      }
                    />
                    {error.phoneNumber && (
                      <p className="text-xs text-red">{error.phoneNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    {/* Bao bọc input mật khẩu với container relative để đặt icon */}
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formAdvertiser.password}
                        onChange={(e) =>
                          setFormAdvertiser({
                            ...formAdvertiser,
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
                </div>
              </div>

              {/* Phần 2: Thông tin công ty */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Thông tin công ty
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Tên công ty
                    </label>
                    <Input
                      value={formAdvertiser.companyName}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          companyName: e.target.value
                        })
                      }
                    />
                    {error.companyName && (
                      <p className="text-xs text-red">{error.companyName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Website giới thiệu
                    </label>
                    <Input
                      value={formAdvertiser.introductionWebsite}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          introductionWebsite: e.target.value
                        })
                      }
                    />
                    {error.introductionWebsite && (
                      <p className="text-xs text-red">
                        {error.introductionWebsite}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Phần 3: Thông tin hoạt động */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Thông tin hoạt động
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Quy mô hoạt động
                    </label>
                    <Input
                      value={formAdvertiser.staffSize}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          staffSize: e.target.value
                        })
                      }
                    />
                    {error.staffSize && (
                      <p className="text-xs text-red">{error.staffSize}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Lĩnh vực hoạt động
                    </label>
                    <select
                      value={formAdvertiser.industry}
                      onChange={(e) =>
                        setFormAdvertiser({
                          ...formAdvertiser,
                          industry: e.target.value
                        })
                      }
                      className="w-full rounded-md border p-2"
                    >
                      <option value="">Chọn ngành nghề</option>
                      {industryOptions.map((option) => (
                        <option key={option.value} value={option.name}>
                          {option.displayName}
                        </option>
                      ))}
                    </select>
                    {error.industry && (
                      <p className="text-xs text-red">{error.industry}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                className="hover:bg-yellow-600 w-full rounded-lg bg-purple-600 text-white"
                onClick={handleRegister}
                disabled={isPending}
              >
                {isPending ? 'Đang xử lý...' : 'Hoàn tất'}
              </Button>
            </div>
          </div>
        </div>
      </BasePages>
      <Footer />
      {/* ToastContainer hiển thị popup thông báo */}
      <ToastContainer />
    </>
  );
};

export default RegisterAdvertiserPage;
