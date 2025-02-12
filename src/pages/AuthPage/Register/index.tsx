import { useRouter } from '@/routes/hooks/use-router';
import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRegister } from '@/queries/auth.query';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

const registerSchema = z
  .object({
    firstName: z.string().nonempty({ message: 'Họ là bắt buộc.' }),
    lastName: z.string().nonempty({ message: 'Tên là bắt buộc.' }),
    phoneNumber: z
      .string()
      .nonempty({ message: 'Số điện thoại là bắt buộc.' })
      .regex(/^\d{10,15}$/, 'Số điện thoại không hợp lệ.'),
    email: z
      .string()
      .nonempty({ message: 'Email là bắt buộc.' })
      .email('Email không hợp lệ.'),
    password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự.'),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Xác nhận mật khẩu là bắt buộc.' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword']
  });

type TypeRegister = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [formRegister, setFormRegister] = useState<TypeRegister>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const [errors, setErrors] = useState<
    Partial<Record<keyof TypeRegister, string>>
  >({});
  const [generalError, setGeneralError] = useState<string>('');

  const { mutateAsync: register, isPending } = useRegister();

  const handleRegister = async () => {
    setGeneralError('');
    const result = registerSchema.safeParse(formRegister);

    if (result.success) {
      const data = await register({
        firstName: formRegister.firstName,
        lastName: formRegister.lastName,
        phoneNumber: formRegister.phoneNumber,
        email: formRegister.email,
        password: formRegister.password,
        confirmPassword: formRegister.confirmPassword
      });
      if (data) {
        toast({
          variant: 'success',
          title: 'Đăng ký thành công',
          description: 'Hãy đăng nhập để trải nghiệm dịch vụ của chúng tôi.'
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else {
      const fieldErrors: Partial<Record<keyof TypeRegister, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof TypeRegister;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto max-h-screen w-[80%] flex-1 p-4"
        pageHead="Đăng ký | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng ký', link: '/register' }
        ]}
      >
        <div className="">
          <div className="mx-auto w-[35%] rounded-xl bg-background p-6 shadow-lg">
            <h1 className="mb-4 text-center text-2xl font-semibold">Đăng ký</h1>
            {generalError && (
              <div className="mb-4 p-2 text-center text-red">
                {generalError}
              </div>
            )}
            <div className="mt-2 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    placeholder="Họ"
                    value={formRegister.firstName}
                    onChange={(e) =>
                      setFormRegister({
                        ...formRegister,
                        firstName: e.target.value
                      })
                    }
                    className={errors.firstName ? 'border-red-600' : ''}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Tên"
                    value={formRegister.lastName}
                    onChange={(e) =>
                      setFormRegister({
                        ...formRegister,
                        lastName: e.target.value
                      })
                    }
                    className={errors.lastName ? 'border-red-600' : ''}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Số điện thoại"
                  value={formRegister.phoneNumber}
                  onChange={(e) =>
                    setFormRegister({
                      ...formRegister,
                      phoneNumber: e.target.value
                    })
                  }
                  className={errors.phoneNumber ? 'border-red-600' : ''}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red">{errors.phoneNumber}</p>
                )}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formRegister.email}
                  onChange={(e) =>
                    setFormRegister({
                      ...formRegister,
                      email: e.target.value
                    })
                  }
                  className={errors.email ? 'border-red-600' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red">{errors.email}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={formRegister.password}
                  onChange={(e) =>
                    setFormRegister({
                      ...formRegister,
                      password: e.target.value
                    })
                  }
                  className={errors.password ? 'border-red-600' : ''}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red">{errors.password}</p>
                )}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={formRegister.confirmPassword}
                  onChange={(e) =>
                    setFormRegister({
                      ...formRegister,
                      confirmPassword: e.target.value
                    })
                  }
                  className={errors.confirmPassword ? 'border-red-600' : ''}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <p className="p-4 text-center text-[11px] text-muted-foreground">
                Bằng việc tiếp tục, bạn đồng ý với{' '}
                <a href="/policy" className="text-orange underline">
                  Chính sách bảo mật
                </a>{' '}
                và{' '}
                <a href="/terms" className="text-orange underline">
                  Điều khoản dịch vụ
                </a>{' '}
                của G-Local
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button
                  className="w-full bg-yellow text-black"
                  onClick={handleRegister}
                  disabled={isPending}
                >
                  {isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
                <p className="text-[12px] text-muted-foreground">
                  Bạn đã có tài khoản?{' '}
                  <a
                    onClick={() => router.push('/login')}
                    className="cursor-pointer text-orange underline"
                  >
                    Đăng nhập ngay
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </BasePages>
    </>
  );
}
