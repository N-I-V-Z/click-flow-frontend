import { useEffect, useState } from 'react';
import BasePages from '@/components/shared/base-pages.js';
import Footer from '@/components/shared/footer-home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { useLogin, useLoginGoogle } from '@/queries/auth.query';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/auth.slice';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageLeft from '../Image';
import { useRouter } from '@/routes/hooks';
import {
  ApiResponse,
  LoginApiResponse,
  LoginRequest,
  LoginGoogleRequest,
  TokenDecoded
} from '@/types';
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse
} from '@react-oauth/google';
import ToastNotification from '@/components/shared/toast-notification';

export default function LoginPage() {
  const { mutateAsync: Login, isPending } = useLogin();
  const { mutateAsync: LoginGoogle, isPending: isPendingGoogle } =
    useLoginGoogle();
  const [formLogin, setFormLogin] = useState<LoginRequest>({
    userNameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = helpers.cookie_get('AT');
    if (token) {
      dispatch(login());
      router.push('/');
    }
  }, [dispatch, router]);

  const validateInputs = (): boolean => {
    if (!formLogin.userNameOrEmail.trim()) {
      toast.error('Tên đăng nhập không được để trống.');
      return false;
    }
    if (!formLogin.password.trim()) {
      toast.error('Mật khẩu không được để trống.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      const data = await Login(formLogin);
      const loginResponse = data as ApiResponse<LoginApiResponse>;

      // Lưu cả access token và refresh token
      const accessToken = loginResponse.result?.token ?? '';
      const refreshToken = loginResponse.result?.refreshToken ?? '';

      helpers.cookie_set('AT', accessToken);
      helpers.cookie_set('RT', refreshToken);

      dispatch(login());
      const decoded: TokenDecoded | null = helpers.decodeTokens(
        __helpers.cookie_get('AT')
      );
      const role = decoded?.Role.toLowerCase();

      toast.success('Đăng nhập thành công!');

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'advertiser') {
        router.push('/advertiser');
      } else if (role === 'publisher') {
        router.push('/publisher');
      } else {
        router.push('/404');
      }
    } catch {
      toast.error('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;

    try {
      const googleLoginRequest: LoginGoogleRequest = {
        idToken: credentialResponse.credential
      };

      const data = await LoginGoogle(googleLoginRequest);
      const loginResponse = data as ApiResponse<LoginApiResponse>;

      // Lưu cả access token và refresh token cho Google login
      const accessToken = loginResponse.result?.token ?? '';
      const refreshToken = loginResponse.result?.refreshToken ?? '';

      helpers.cookie_set('AT', accessToken);
      helpers.cookie_set('RT', refreshToken);

      dispatch(login());
      const decoded: TokenDecoded | null = helpers.decodeTokens(accessToken);
      const role = decoded?.Role.toLowerCase();

      toast.success('Đăng nhập Google thành công!');

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'advertiser') {
        router.push('/advertiser');
      } else if (role === 'publisher') {
        router.push('/publisher');
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  };

  const handleGoogleError = () => {
    toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
  };

  return (
    <>
      <div className="bg-gray-50 px-8 py-4">
        <div className="mx-auto max-w-5xl">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-purple-600 hover:text-purple-700">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900">Đăng nhập</span>
          </nav>
        </div>
      </div>

      <BasePages className="bg-gray-50" pageHead="ClickFlow - Đăng nhập">
        <div className="-mt-8 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-4xl">
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex min-h-[500px]">
                <div className="relative hidden w-1/2 lg:block">
                  <ImageLeft />
                  <div className="absolute inset-0 mb-1 rounded bg-gradient-to-t from-black/50 via-transparent to-transparent">
                    <div className="absolute bottom-8 left-8 text-white">
                      <h3 className="mb-2 text-2xl font-bold">
                        Chào mừng đến với ClickFlow
                      </h3>
                      <p className="text-white/90">
                        Nền tảng affiliate marketing hàng đầu Việt Nam
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
                  <div className="mb-6 text-center">
                    <Link to="/" className="inline-block">
                      <img
                        src="/assets/logo.jpg"
                        alt="ClickFlow Logo"
                        className="mx-auto h-12 w-auto rounded-xl shadow-md"
                      />
                    </Link>
                  </div>

                  <div className="mb-6 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                      Đăng nhập
                    </h1>
                    <p className="text-sm text-gray-600">
                      Để truy cập{' '}
                      <Link
                        to="/"
                        className="font-medium text-purple-600 hover:text-purple-700"
                      >
                        Clickflow.space
                      </Link>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Username/Email */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          className="h-11 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Tên tài khoản hoặc Email"
                          value={formLogin.userNameOrEmail}
                          onChange={(e) =>
                            setFormLogin({
                              ...formLogin,
                              userNameOrEmail: e.target.value
                            })
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          disabled={isPending || isPendingGoogle}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          className="h-11 rounded-lg border-gray-300 pl-12 pr-12 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mật khẩu"
                          value={formLogin.password}
                          onChange={(e) =>
                            setFormLogin({
                              ...formLogin,
                              password: e.target.value
                            })
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          disabled={isPending || isPendingGoogle}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isPending || isPendingGoogle}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    {/* Login Button */}
                    <Button
                      className="group h-11 w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                      onClick={handleLogin}
                      disabled={isPending || isPendingGoogle}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isPending ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            Đăng nhập
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </Button>

                    <div className="relative my-6 flex justify-center bg-white px-4 text-sm text-gray-500">
                      <span className="">Hoặc</span>
                    </div>

                    {/* Google Login */}
                    <div className="mt-4 flex justify-center">
                      <GoogleOAuthProvider
                        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                      >
                        <div
                          className={
                            isPendingGoogle
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }
                        >
                          <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap={false}
                          />
                        </div>
                      </GoogleOAuthProvider>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500">
                          Đăng kí với
                        </span>
                      </div>
                    </div>

                    {/* Register Links */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Link to="/register-publisher">
                          <Button
                            variant="outline"
                            className="h-10 w-full rounded-lg border-purple-300 bg-white text-purple-700 hover:bg-purple-50"
                            disabled={isPending || isPendingGoogle}
                          >
                            Publisher
                          </Button>
                        </Link>
                        <Link to="/register-advertiser">
                          <Button
                            variant="outline"
                            className="h-10 w-full rounded-lg border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
                            disabled={isPending || isPendingGoogle}
                          >
                            Advertiser
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="mt-6 rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-xs text-gray-600">
                        Bằng việc đăng nhập, bạn đồng ý với{' '}
                        <Link
                          to="/terms"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link
                          to="/privacy"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Chính sách bảo mật
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
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
