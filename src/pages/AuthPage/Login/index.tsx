import { useRouter } from '@/routes/hooks/use-router';
import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/queries/auth.query';
import { useEffect, useState } from 'react';
import helper from '@/helpers/index';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/auth.slice';

type FormLogin = {
  username: string;
  password: string;
};

type FormError = Partial<FormLogin>;

export default function LoginPage() {
  const { mutateAsync, isPending } = useLogin();
  const [formLogin, setFormLogin] = useState<FormLogin>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<FormError>({});
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = helper.cookie_get('AT');
    if (token) {
      dispatch(login());
      window.location.href = '/';
    }
  }, []);

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formLogin.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống.';
    }
    if (!formLogin.password.trim()) {
      errors.password = 'Mật khẩu không được để trống.';
    }
    return errors;
  };

  const handleLogin = async () => {
    const errors = validateInputs();
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const data = await mutateAsync(formLogin);
      if (data) {
        console.log(data);
        helper.cookie_set('AT', data.accessToken);
        dispatch(login());
        window.location.href = '/';
      }
    } catch (err) {
      setError({ password: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto max-h-screen w-[80%] flex-1 p-4"
        pageHead="Login | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng nhập', link: '/login' }
        ]}
      >
        <div className="">
          <div className="mx-auto w-[35%] rounded-xl bg-background p-4 shadow-lg">
            <h1>Đăng nhập</h1>
            <div className="mt-2 space-y-4">
              <Input
                placeholder="Tên đăng nhập"
                value={formLogin.username}
                onChange={(e) =>
                  setFormLogin({ ...formLogin, username: e.target.value })
                }
              />
              {error.username && (
                <p className="text-[12px] text-red">{error.username}</p>
              )}

              <Input
                placeholder="Mật khẩu"
                type="password"
                value={formLogin.password}
                onChange={(e) =>
                  setFormLogin({ ...formLogin, password: e.target.value })
                }
              />
              {error.password && (
                <p className="text-[12px] text-red">{error.password}</p>
              )}

              <p className="text-[12px] text-orange">Quên mật khẩu?</p>
              <div className="flex flex-col items-center gap-4">
                <Button
                  className="w-full bg-yellow text-black"
                  onClick={handleLogin}
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Đăng nhập'}
                </Button>
                <p className="text-[12px] text-muted-foreground">
                  Bạn chưa có tài khoản?{' '}
                  <a
                    onClick={() => router.push('/register')}
                    className="cursor-pointer text-orange"
                  >
                    Đăng ký ngay
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
