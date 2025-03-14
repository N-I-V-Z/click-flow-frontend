import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRegisterAdvertiser } from '@/queries/auth.query';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';

type FormAdvertiser = {
  companyName: string;
  introductionWebsite: string;
  industry: string;
  staffSize: number;
  fullName: string;
  email: string;
  phoneNumber: string;
};

type FormError = {
  companyName: string;
  introductionWebsite: string;
  industry: string;
  staffSize: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export default function RegisterBusinessPage() {
  const { mutateAsync, isPending } = useRegisterAdvertiser();
  const [formAdvertiser, setAdvertiser] = useState<FormAdvertiser>({
    companyName: '',
    introductionWebsite: '',
    industry: '',
    staffSize: 0,
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [error, setError] = useState<FormError>({
    companyName: '',
    introductionWebsite: '',
    industry: '',
    staffSize: '',
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const validateInputs = (): FormError => {
    const errors: FormError = {
      companyName: '',
      introductionWebsite: '',
      industry: '',
      staffSize: '',
      fullName: '',
      email: '',
      phoneNumber: ''
    };
    if (!formAdvertiser.companyName.trim())
      errors.companyName = 'Tên doanh nghiệp không được để trống.';
    if (!formAdvertiser.introductionWebsite.trim())
      errors.introductionWebsite = 'Website không được để trống.';
    if (!formAdvertiser.industry.trim())
      errors.industry = 'Lĩnh vực hoạt động không được để trống.';
    if (!formAdvertiser.staffSize)
      errors.staffSize = 'Quy mô doanh nghiệp không được để trống.';
    if (!formAdvertiser.fullName.trim())
      errors.fullName = 'Họ và tên không được để trống.';
    if (!formAdvertiser.email.trim())
      errors.email = 'Email liên hệ không được để trống.';
    if (!formAdvertiser.phoneNumber.trim())
      errors.phoneNumber = 'Số điện thoại không được để trống.';
    return errors;
  };

  const handleRegister = async () => {
    const errors = validateInputs();
    setError(errors);
    // Kiểm tra nếu có bất kỳ lỗi nào
    if (Object.values(errors).some((msg) => msg !== '')) {
      return;
    }

    try {
      await mutateAsync(formAdvertiser);
      alert('Đăng ký doanh nghiệp thành công!');
      window.location.href = '/dashboard';
    } catch (err) {
      setError((prev) => ({
        ...prev,
        email: 'Không thể đăng ký. Vui lòng thử lại.'
      }));
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto mb-20 max-w-screen-lg p-6"
        pageHead="Đăng ký doanh nghiệp | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng ký doanh nghiệp', link: '/register-business' }
        ]}
      >
        <div className="mx-auto mt-10 flex min-h-[600px] flex-col gap-8 rounded-xl bg-white p-8 shadow-lg lg:flex-row">
          <div className="hidden w-full lg:block lg:w-1/2">
            <ImageLeft />
          </div>

          <div className="w-full lg:w-1/2">
            <div className="text-center">
              <Link to="/">
                <img
                  src="src/assets/logo.jpg"
                  alt="Logo"
                  className="mx-auto mb-4 h-20 w-auto rounded-lg"
                />
              </Link>
              <h1 className="mb-4 text-2xl font-bold text-gray-800">
                Đăng ký tài khoản doanh nghiệp
              </h1>
              <p className="text-yellow-500 mb-4 text-lg font-medium">
                Growth Platform dành cho doanh nghiệp
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-purple-100 p-4 text-center">
              <p className="text-sm text-gray-700">
                Nếu bạn đã{' '}
                <span className="font-semibold text-purple-600">
                  có tài khoản Publisher, Advertiser
                </span>{' '}
                trên các sản phẩm của CLICK FLOW, bạn có thể sử dụng để đăng
                nhập ngay và không cần đăng ký lại.
              </p>
              <p className="mt-2 text-sm">
                Bạn đã có tài khoản?{' '}
                <Link to="/login" className="font-semibold text-purple-600">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tên doanh nghiệp
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formAdvertiser.companyName}
                  onChange={(e) =>
                    setAdvertiser({
                      ...formAdvertiser,
                      companyName: e.target.value
                    })
                  }
                />
                {error.companyName && (
                  <p className="text-red-500 mt-1 text-xs">
                    {error.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Website
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formAdvertiser.introductionWebsite}
                  onChange={(e) =>
                    setAdvertiser({
                      ...formAdvertiser,
                      introductionWebsite: e.target.value
                    })
                  }
                />
                {error.introductionWebsite && (
                  <p className="text-red-500 mt-1 text-xs">
                    {error.introductionWebsite}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Lĩnh vực hoạt động
                  </label>
                  <Input
                    className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                    value={formAdvertiser.industry}
                    onChange={(e) =>
                      setAdvertiser({
                        ...formAdvertiser,
                        industry: e.target.value
                      })
                    }
                  />
                  {error.industry && (
                    <p className="text-red-500 mt-1 text-xs">
                      {error.industry}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Quy mô doanh nghiệp
                  </label>
                  <Input
                    className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                    value={formAdvertiser.staffSize}
                    onChange={(e) =>
                      setAdvertiser({
                        ...formAdvertiser,
                        staffSize: Number(e.target.value)
                      })
                    }
                  />
                  {error.staffSize && (
                    <p className="text-red-500 mt-1 text-xs">
                      {error.staffSize}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formAdvertiser.fullName}
                  onChange={(e) =>
                    setAdvertiser({
                      ...formAdvertiser,
                      fullName: e.target.value
                    })
                  }
                />
                {error.fullName && (
                  <p className="text-red-500 mt-1 text-xs">{error.fullName}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email liên hệ
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formAdvertiser.email}
                  onChange={(e) =>
                    setAdvertiser({
                      ...formAdvertiser,
                      email: e.target.value
                    })
                  }
                />
                {error.email && (
                  <p className="text-red-500 mt-1 text-xs">{error.email}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Số điện thoại liên hệ
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formAdvertiser.phoneNumber}
                  onChange={(e) =>
                    setAdvertiser({
                      ...formAdvertiser,
                      phoneNumber: e.target.value
                    })
                  }
                />
                {error.phoneNumber && (
                  <p className="text-red-500 mt-1 text-xs">
                    {error.phoneNumber}
                  </p>
                )}
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  className="hover:bg-yellow-600 w-full rounded-lg bg-purple-600 px-4 py-2 text-white"
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
