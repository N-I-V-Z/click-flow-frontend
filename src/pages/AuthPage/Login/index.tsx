import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/queries/auth.query';
import { useEffect, useState } from 'react';
import helper from '@/helpers/index';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/auth.slice';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';

type FormLogin = {
  userNameOrEmail: string;
  password: string;
};

type FormError = Partial<FormLogin>;

export default function LoginPage() {
  const { mutateAsync: Login, isPending } = useLogin();
  const [formLogin, setFormLogin] = useState<FormLogin>({
    userNameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState<FormError>({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = helper.cookie_get('AT');
    if (token) {
      dispatch(login());
      console.log('Người dùng đã đăng nhập');
      window.location.href = '/';
    }
  }, [dispatch]);

  const validateInputs = (): FormError => {
    const errors: FormError = {};
    if (!formLogin.userNameOrEmail.trim()) {
      errors.userNameOrEmail = 'Tên đăng nhập không được để trống.';
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
      const data = await Login(formLogin);
      console.log(await Login(formLogin));
      console.log(data.data);
      if (data) {
        console.log(formLogin);
        helper.cookie_set('AT', data.accessToken);
        dispatch(login());
        window.location.href = '/';
        console.log('Người dùng đã đăng nhập');
      }
    } catch (err) {
      setError({ password: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
  };

  return (
    <>
      <BasePages
        className="relative mx-auto mb-40 max-h-screen w-[80%] flex-1 p-4"
        pageHead="Login | Click Flow"
        breadcrumbs={[
          { title: 'Trang chủ', link: '/' },
          { title: 'Đăng nhập', link: '/login' }
        ]}
      >
        <div className="mx-auto mb-20 mt-10 flex w-[70%] rounded-xl bg-background p-4 shadow-lg">
          {/* Bên trái - Hình ảnh */}
          <div className="hidden w-full lg:block lg:w-1/2">
            <ImageLeft />
          </div>
          {/* Bên phải - Form đăng nhập */}
          <div className="w-1/2 p-20">
            <h1 className="mb-2 text-center text-xl font-bold">Đăng nhập</h1>
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
            <div className="mt-2 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tên đăng nhập
                </label>
                <Input
                  value={formLogin.userNameOrEmail}
                  onChange={(e) =>
                    setFormLogin({
                      ...formLogin,
                      userNameOrEmail: e.target.value
                    })
                  }
                />
                {error.userNameOrEmail && (
                  <p className="text-[12px] text-red">
                    {error.userNameOrEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formLogin.password}
                    onChange={(e) =>
                      setFormLogin({ ...formLogin, password: e.target.value })
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
                {error.password && (
                  <p className="text-[12px] text-red">{error.password}</p>
                )}
              </div>
              <br />
              <Link to="/reset-password">
                <p className="text-right text-[12px] text-orange">
                  Quên mật khẩu?
                </p>
              </Link>
              <div className="flex flex-col items-center gap-4">
                <Button
                  className="w-full bg-purple-600 text-white"
                  onClick={handleLogin}
                  disabled={isPending}
                >
                  {isPending ? 'Đang xử lý...' : 'Đăng nhập'}
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
