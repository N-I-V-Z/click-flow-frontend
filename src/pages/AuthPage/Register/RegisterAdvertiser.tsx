import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRegisterBusiness } from '@/queries/auth.query';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';

type FormBusiness = {
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
  fullName: string;
  contactEmail: string;
  contactPhone: string;
};

type FormError = Partial<FormBusiness>;

export default function RegisterBusinessPage() {
  const { mutateAsync, isPending } = useRegisterBusiness();
  const [formBusiness, setFormBusiness] = useState<FormBusiness>({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    fullName: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [error, setError] = useState<FormError>({});

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formBusiness.companyName.trim())
      errors.companyName = 'Tên doanh nghiệp không được để trống.';
    if (!formBusiness.website.trim())
      errors.website = 'Website không được để trống.';
    if (!formBusiness.industry.trim())
      errors.industry = 'Lĩnh vực hoạt động không được để trống.';
    if (!formBusiness.companySize.trim())
      errors.companySize = 'Quy mô doanh nghiệp không được để trống.';
    if (!formBusiness.fullName.trim())
      errors.fullName = 'Họ và tên không được để trống.';
    if (!formBusiness.contactEmail.trim())
      errors.contactEmail = 'Email liên hệ không được để trống.';
    if (!formBusiness.contactPhone.trim())
      errors.contactPhone = 'Số điện thoại không được để trống.';
    return errors;
  };

  const handleRegister = async () => {
    const errors = validateInputs();
    setError(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await mutateAsync(formBusiness);
      alert('Đăng ký doanh nghiệp thành công!');
      window.location.href = '/dashboard';
    } catch (err) {
      setError({ contactEmail: 'Không thể đăng ký. Vui lòng thử lại.' });
    }
  };

  return (
    <>
      <BasePages
        // Tăng chiều rộng tổng thể (thay max-w-4xl thành max-w-screen-lg)
        className="relative mx-auto mb-20 max-w-screen-lg p-6"
        pageHead="Đăng ký doanh nghiệp | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng ký doanh nghiệp', link: '/register-business' }
        ]}
      >
        {/* Khối chứa ảnh + form */}
        <div className="mx-auto mt-10 flex min-h-[600px] flex-col gap-8 rounded-xl bg-white p-8 shadow-lg lg:flex-row">
          {/* Cột bên trái: Ảnh (ẩn trên màn hình nhỏ, chiếm 1/2 màn hình lớn) */}
          <div className="hidden w-full lg:block lg:w-1/2">
            <ImageLeft />
          </div>

          {/* Cột bên phải: Form (chiếm 1/2) */}
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

            {/* Form inputs */}
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tên doanh nghiệp
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formBusiness.companyName}
                  onChange={(e) =>
                    setFormBusiness({
                      ...formBusiness,
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
                  value={formBusiness.website}
                  onChange={(e) =>
                    setFormBusiness({
                      ...formBusiness,
                      website: e.target.value
                    })
                  }
                />
                {error.website && (
                  <p className="text-red-500 mt-1 text-xs">{error.website}</p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Lĩnh vực hoạt động
                  </label>
                  <Input
                    className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                    value={formBusiness.industry}
                    onChange={(e) =>
                      setFormBusiness({
                        ...formBusiness,
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
                    value={formBusiness.companySize}
                    onChange={(e) =>
                      setFormBusiness({
                        ...formBusiness,
                        companySize: e.target.value
                      })
                    }
                  />
                  {error.companySize && (
                    <p className="text-red-500 mt-1 text-xs">
                      {error.companySize}
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
                  value={formBusiness.fullName}
                  onChange={(e) =>
                    setFormBusiness({
                      ...formBusiness,
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
                  value={formBusiness.contactEmail}
                  onChange={(e) =>
                    setFormBusiness({
                      ...formBusiness,
                      contactEmail: e.target.value
                    })
                  }
                />
                {error.contactEmail && (
                  <p className="text-red-500 mt-1 text-xs">
                    {error.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Số điện thoại liên hệ
                </label>
                <Input
                  className="focus:ring-yellow-300 w-full rounded-md border-gray-300 focus:ring"
                  value={formBusiness.contactPhone}
                  onChange={(e) =>
                    setFormBusiness({
                      ...formBusiness,
                      contactPhone: e.target.value
                    })
                  }
                />
                {error.contactPhone && (
                  <p className="text-red-500 mt-1 text-xs">
                    {error.contactPhone}
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
