import { Icons } from '@/components/ui/icons';
import RegisterChoiceModal from '@/pages/AuthPage/Register/RegisterChoise';
import helpers from '@/helpers';
import { Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useRouter } from '@/routes/hooks';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/auth.slice';
import { useLogout } from '@/queries/auth.query';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { logoURL } from '@/constants/data';

export default function HeaderNav() {
  const route = useRouter();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const { mutateAsync: logoutAccount, isPending } = useLogout();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsModalVisible(false);

      const refreshToken =
        helpers.cookie_get('RT') || localStorage.getItem('refreshToken');

      if (refreshToken) {
        await logoutAccount({ refreshToken });
      }

      helpers.cookie_delete('AT');
      helpers.cookie_delete('RT');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      // Clear all React Query cache
      queryClient.clear();

      dispatch(logout());
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);

      helpers.cookie_delete('AT');
      helpers.cookie_delete('RT');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      // Clear all React Query cache
      queryClient.clear();

      dispatch(logout());
      router.push('/login');
    }
  };

  return (
    <nav className="to relative border-b border-purple-500/30 bg-purple-600 bg-gradient-to-r from-purple-800 via-purple-900 backdrop-blur-md">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-purple-500/5 to-indigo-600/10"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO Section */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <img
                  src={logoURL}
                  alt="Logo"
                  className="h-8 w-auto rounded-lg transition-transform "
                />
              </div>
            </Link>
          </div>

          {/* ACCOUNT Section */}
          <div className="flex items-center space-x-3">
            {auth.isLogin ? (
              <Button
                onClick={showLogoutModal}
                disabled={isPending}
                className="to-red hover:to-red group relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-pink-500 px-6 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Icons.logOut className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  <span>{isPending ? 'Đang xử lý...' : 'Đăng xuất'}</span>
                </div>
                {/* Subtle shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"></div>
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    route.push('/login');
                  }}
                  className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-indigo-600 hover:shadow-xl"
                >
                  <span className="relative z-10">Đăng nhập</span>
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"></div>
                </Button>

                <Button
                  onClick={() => setRegisterOpen(true)}
                  className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-purple-400 to-purple-500 px-6 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-500 hover:to-purple-600 hover:shadow-xl"
                >
                  <span className="relative z-10">Đăng ký</span>
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"></div>
                </Button>

                <RegisterChoiceModal
                  open={isRegisterOpen}
                  onClose={() => setRegisterOpen(false)}
                />
              </>
            )}

            {/* Logout Confirmation Modal */}
            <Modal
              open={isModalVisible}
              centered
              closable={false}
              onCancel={handleCancelLogout}
              footer={[
                <Button
                  key="cancel"
                  onClick={handleCancelLogout}
                  disabled={isPending}
                  className="mr-3 rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 font-medium text-black backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/70"
                >
                  Hủy
                </Button>,
                <Button
                  key="logout"
                  onClick={handleConfirmLogout}
                  disabled={isPending}
                  className="to-red rounded-xl border-0 bg-gradient-to-r from-pink-500 px-6 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:from-pink-600 hover:to-red-600 hover:shadow-xl"
                >
                  {isPending ? (
                    <>
                      <span className="mr-2 animate-spin">⟳</span>
                      Đang đăng xuất...
                    </>
                  ) : (
                    'Đăng xuất'
                  )}
                </Button>
              ]}
              className="overflow-hidden rounded-2xl"
              bodyStyle={{
                textAlign: 'center',
                padding: '2rem',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
              }}
            >
              <div className="mb-6">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-200">
                  <LogoutOutlined className="text-2xl text-purple-600" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-purple-900">
                  Xác nhận đăng xuất
                </h2>
                <p className="leading-relaxed text-purple-700">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
                </p>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </nav>
  );
}
