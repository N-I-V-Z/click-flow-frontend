import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useResetPassword } from '@/queries/auth.query';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';
type FormReset = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

type FormError = Partial<FormReset>;

export default function ResetPasswordPage() {
  const { mutateAsync, isPending } = useResetPassword();
  const [formReset, setFormReset] = useState<FormReset>({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<FormError>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formReset.email.trim()) {
      errors.email = 'Email không được để trống.';
    }
    if (!formReset.newPassword.trim()) {
      errors.newPassword = 'Mật khẩu mới không được để trống.';
    }
    if (formReset.newPassword !== formReset.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    return errors;
  };

  const handleReset = async () => {
    const errors = validateInputs();
    setError(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await mutateAsync(formReset);
      alert('Mật khẩu đã được đặt lại thành công!');
      window.location.href = '/login';
    } catch (err) {
      setError({ email: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto w-[80%] flex-1 p-4"
        pageHead="Reset Password | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đặt lại mật khẩu', link: '/reset-password' }
        ]}
      >
        <div className="mx-auto mt-10 flex w-[70%] rounded-xl bg-gradient-to-b shadow-lg">
          <div className="hidden w-full lg:block lg:w-1/2">
            <ImageLeft />
          </div>

          <div className="w-1/2 p-8">
            <h1 className="mb-2 text-center text-xl font-bold">
              Đặt lại mật khẩu
            </h1>
            <p className="text-center text-sm text-gray-500">
              Để truy cập{' '}
              <a href="/" className="text-[#9B52BF] no-underline">
                ClickFlow.vn
              </a>
              .
              <Link to="/">
                <img
                  src="src/assets/logo.jpg"
                  alt="Logo"
                  className="w-30 mx-auto mb-10 mt-10 h-20 rounded-lg"
                />
              </Link>
            </p>
            <p className="text-center text-sm text-gray-500">
              Địa chỉ email đăng kí để đặt lại mật khẩu.
            </p>
            <div className="mt-2 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  value={formReset.email}
                  onChange={(e) =>
                    setFormReset({ ...formReset, email: e.target.value })
                  }
                />
                {error.email && (
                  <p className="text-[12px] text-red">{error.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formReset.newPassword}
                    onChange={(e) =>
                      setFormReset({
                        ...formReset,
                        newPassword: e.target.value
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error.newPassword && (
                  <p className="text-[12px] text-red">{error.newPassword}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={formReset.confirmPassword}
                    onChange={(e) =>
                      setFormReset({
                        ...formReset,
                        confirmPassword: e.target.value
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error.confirmPassword && (
                  <p className="text-[12px] text-red">
                    {error.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  className="w-full bg-yellow text-black"
                  onClick={handleReset}
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>
                <p className="text-center text-[12px] text-muted-foreground">
                  Đăng ký tài khoản <br />
                  <a
                    href="/register?type=advertiser"
                    className="text-[#9B52BF] no-underline"
                  >
                    Advertiser
                  </a>{' '}
                  hoặc{' '}
                  <a
                    href="/register?type=publisher"
                    className="text-[#9B52BF] no-underline"
                  >
                    Publisher
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </BasePages>
      <Footer />
    </>
  );
}
