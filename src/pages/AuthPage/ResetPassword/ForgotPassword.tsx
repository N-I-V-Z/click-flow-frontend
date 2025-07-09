import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useResetPassword } from '@/queries/auth.query';
import { Link, useSearchParams } from 'react-router-dom';
import ImageLeft from '../Image';
import { ResetpasswordRequest } from '@/types';
import { useRouter } from '@/routes/hooks';
import ToastNotification from '@/components/shared/toast-notification';
import { toast } from 'react-toastify';

type FormReset = {
  newPassword: string;
  confirmedNewPassword: string;
};

type FormError = Partial<FormReset>;

export default function RenewPasswordPage() {
  const { mutateAsync, isPending } = useResetPassword();
  const [searchParams] = useSearchParams();
  const [formReset, setFormReset] = useState<ResetpasswordRequest>({
    email: '',
    newPassword: '',
    confirmedNewPassword: '',
    token: ''
  });
  const [error, setError] = useState<FormError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Lấy token và email từ URL parameters khi component mount
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      toast.error('Link không hợp lệ hoặc đã hết hạn!');
      router.push('/forgot-password');
      return;
    }

    setFormReset((prev) => ({
      ...prev,
      token: decodeURIComponent(token),
      email: decodeURIComponent(email)
    }));
  }, [searchParams, router]);

  const validateInputs = (): FormError => {
    const errors: FormError = {};

    if (!formReset?.newPassword.trim()) {
      errors.newPassword = 'Mật khẩu mới không được để trống.';
    } else if (formReset.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    if (!formReset?.confirmedNewPassword.trim()) {
      errors.confirmedNewPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (formReset?.newPassword !== formReset?.confirmedNewPassword) {
      errors.confirmedNewPassword = 'Mật khẩu xác nhận không khớp.';
    }

    return errors;
  };

  const handleReset = async () => {
    const errors = validateInputs();
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Kiểm tra lại token và email
    if (!formReset.token || !formReset.email) {
      toast.error('Thông tin không hợp lệ. Vui lòng thử lại!');
      router.push('/forgot-password');
      return;
    }

    try {
      await mutateAsync(formReset);
      toast.success('Mật khẩu đã được đặt lại thành công!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      toast.error(errorMessage);

      // Nếu token hết hạn hoặc không hợp lệ, chuyển về forgot password
      if (err?.response?.status === 400 || err?.response?.status === 401) {
        setTimeout(() => {
          router.push('/forgot-password');
        }, 2000);
      }
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto w-[80%] flex-1 p-4"
        pageHead="ClickFlow - Đặt lại mật khẩu"
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
              <Link to="/" className="text-[#9B52BF] no-underline">
                Clickflow.space
              </Link>
              .
              <Link to="/">
                <img
                  src="/assets/logo.jpg"
                  alt="Logo"
                  className="w-30 mx-auto mb-10 mt-10 h-20 rounded-lg"
                />
              </Link>
            </p>

            {/* Hiển thị email (readonly) */}
            <p className="mb-4 text-center text-sm text-gray-500">
              Đặt lại mật khẩu cho: <strong>{formReset.email}</strong>
            </p>

            <div className="mt-2 space-y-3">
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
                    placeholder="Nhập mật khẩu mới"
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
                  <p className="text-red text-[12px]">{error.newPassword}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formReset.confirmedNewPassword}
                    onChange={(e) =>
                      setFormReset({
                        ...formReset,
                        confirmedNewPassword: e.target.value
                      })
                    }
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {error.confirmedNewPassword && (
                  <p className="text-red text-[12px]">
                    {error.confirmedNewPassword}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  className="bg-yellow w-full text-black"
                  onClick={handleReset}
                  disabled={isPending || !formReset.token || !formReset.email}
                >
                  {isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#9B52BF] hover:underline"
                  >
                    ← Quay lại gửi lại email
                  </Link>
                </div>

                <p className="text-center text-[12px] text-muted-foreground">
                  Đăng ký tài khoản <br />
                  <Link
                    to="/register?type=advertiser"
                    className="text-[#9B52BF] no-underline"
                  >
                    Advertiser
                  </Link>{' '}
                  hoặc{' '}
                  <Link
                    to="/register?type=publisher"
                    className="text-[#9B52BF] no-underline"
                  >
                    Publisher
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </BasePages>
      <Footer />
      <ToastNotification />
    </>
  );
}
