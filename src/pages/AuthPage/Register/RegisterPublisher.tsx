import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRegisterUser } from '@/queries/auth.query';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';
type FormUser = {
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone: string;
};

type FormError = Partial<FormUser>;

export default function RegisterUserPage() {
  const { mutateAsync, isPending } = useRegisterUser();
  const [formUser, setFormUser] = useState<FormUser>({
    firstName: '',
    lastName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [error, setError] = useState<FormError>({});

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formUser.firstName.trim())
      errors.firstName = 'Họ không được để trống.';
    if (!formUser.lastName.trim()) errors.lastName = 'Tên không được để trống.';
    if (!formUser.contactEmail.trim())
      errors.contactEmail = 'Email không được để trống.';
    if (!formUser.contactPhone.trim())
      errors.contactPhone = 'Số điện thoại không được để trống.';
    return errors;
  };

  const handleRegister = async () => {
    const errors = validateInputs();
    setError(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await mutateAsync(formUser);
      alert('Đăng ký thành công!');
      window.location.href = '/dashboard';
    } catch (err) {
      setError({ contactEmail: 'Không thể đăng ký. Vui lòng thử lại.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto mb-40 w-[60%] flex-1 p-3"
        pageHead="Đăng ký publisher | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng ký', link: '/register-user' }
        ]}
      >
        <div className="mx-auto mt-10 flex min-h-[400px] w-full rounded-xl bg-white p-6 shadow-xl ">
          {/*Image*/}
          <div className="hidden w-full lg:block lg:w-1/2">
            <ImageLeft />
          </div>
          {/*Form*/}
          <div className="mt-10 w-1/2 px-6">
            <Link to="/">
              <img
                src="src/assets/logo.jpg"
                alt="Logo"
                className="w-30 mx-auto mb-10 mt-4 h-20 rounded-lg"
              />
            </Link>
            <h1 className="mb-3 text-center text-2xl font-semibold text-gray-800">
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
              {/* Họ và Tên trên cùng một hàng */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700">
                    Họ
                  </label>
                  <Input
                    value={formUser.firstName}
                    onChange={(e) =>
                      setFormUser({ ...formUser, firstName: e.target.value })
                    }
                  />
                  {error.firstName && (
                    <p className="text-xs text-red">{error.firstName}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <Input
                    value={formUser.lastName}
                    onChange={(e) =>
                      setFormUser({ ...formUser, lastName: e.target.value })
                    }
                  />
                  {error.lastName && (
                    <p className="text-xs text-red">{error.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  value={formUser.contactEmail}
                  onChange={(e) =>
                    setFormUser({ ...formUser, contactEmail: e.target.value })
                  }
                />
                {error.contactEmail && (
                  <p className="text-xs text-red">{error.contactEmail}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <Input
                  value={formUser.contactPhone}
                  onChange={(e) =>
                    setFormUser({ ...formUser, contactPhone: e.target.value })
                  }
                />
                {error.contactPhone && (
                  <p className="text-xs text-red">{error.contactPhone}</p>
                )}
              </div>

              {/* Nút đăng ký */}
              <div className="flex justify-center pt-4">
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
        </div>
      </BasePages>
      <Footer />
    </>
  );
}
