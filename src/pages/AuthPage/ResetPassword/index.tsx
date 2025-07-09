import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useForgotPassword } from '@/queries/auth.query';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';
import { ForgotPasswordRequest } from '@/types';
import ToastNotification from '@/components/shared/toast-notification';

type FormReset = {
  email: string;
  newPassword: string;
  confirmedNewPassword: string;
};

type FormError = Partial<FormReset>;

// Popup Component
const SuccessPopup = ({
  isOpen,
  onClose,
  message
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Thành công!
          </h3>

          {/* Message */}
          <p className="mb-6 text-sm text-gray-600">{message}</p>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-[#9B52BF] text-white hover:bg-[#8A47AB]"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  const { mutateAsync, isPending } = useForgotPassword();
  const [formReset, setFormReset] = useState<ForgotPasswordRequest>({
    email: ''
  });
  const [error, setError] = useState<FormError>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formReset?.email.trim()) {
      errors.email = 'Email không được để trống.';
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
      const response = await mutateAsync(formReset);
      // Thay vì toast, hiển thị popup
      setSuccessMessage(
        response.result?.message || 'Đã gửi email đặt lại mật khẩu thành công!'
      );
      setShowSuccessPopup(true);
    } catch (err) {
      setError({ email: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.' });
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setSuccessMessage('');
  };

  return (
    <>
      <BasePages
        className="relative mx-auto w-[80%] flex-1 p-4"
        pageHead="ClickFlow - Quên mật khẩu"
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
                  <p className="text-red text-[12px]">{error.email}</p>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  className="w-full bg-yellow-400 text-white"
                  onClick={handleReset}
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Gửi'}
                </Button>
                <p className="text-center text-[12px] text-muted-foreground">
                  Đăng ký tài khoản <br />
                  <Link
                    to="/register-advertiser"
                    className="text-[#9B52BF] no-underline"
                  >
                    Advertiser
                  </Link>{' '}
                  hoặc{' '}
                  <Link
                    to="/register-publisher"
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

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleClosePopup}
        message={successMessage}
      />

      <Footer />
      <ToastNotification />
    </>
  );
}
