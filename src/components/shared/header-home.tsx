import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import RegisterChoiceModal from '@/pages/AuthPage/Register/RegisterChoise';
import helpers from '@/helpers';
import { Modal } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';
import { useRouter } from '@/routes/hooks';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/auth.slice';
import { useLogout } from '@/queries/auth.query';
import { useDispatch } from 'react-redux';
import { logoURL } from '@/constants/data';

interface DashboardNavProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

const items: NavItem[] = [{ title: '', href: '/' }];

export default function HeaderNav({ setOpen }: DashboardNavProps) {
  const path = usePathname();
  const route = useRouter();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const { mutateAsync: logoutAccount, isPending } = useLogout(); // ✅ Fix: Gộp destructuring
  const dispatch = useDispatch();
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

      // Lấy refresh token từ cookie hoặc localStorage
      const refreshToken =
        helpers.cookie_get('RT') || localStorage.getItem('refreshToken');

      if (refreshToken) {
        // Call API logout với refreshToken
        await logoutAccount({ refreshToken });
      }

      // Xóa tokens khỏi storage
      helpers.cookie_delete('AT');
      helpers.cookie_delete('RT');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      // Dispatch logout action
      dispatch(logout());

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);

      // Ngay cả khi API lỗi, vẫn clear local data và logout
      helpers.cookie_delete('AT');
      helpers.cookie_delete('RT');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      dispatch(logout());
      router.push('/login');
    }
  };

  return (
    <nav className="grid grid-cols-[15%,55%,25%] items-center bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 py-4 shadow-md">
      {/* LOGO */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoURL}
            alt="Logo"
            className="ml-20 h-[30px] w-[100px] rounded-lg"
          />
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-center space-x-[40px]">
        <TooltipProvider>
          {items.map((item, index) => {
            // const Icon = Icons[item.icon || 'arrowRight'];
            return (
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.disabled ? '/' : item.href}
                      className={cn(
                        'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                        path === item.href
                          ? 'text-white hover:text-muted-foreground'
                          : 'text-white',
                        item.disabled && 'cursor-not-allowed opacity-80'
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                    >
                      <span className="text-[14.5px]">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent align="center" side="bottom">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            );
          })}
        </TooltipProvider>
      </div>

      {/* ACCOUNT */}
      <div className="flex items-center justify-end space-x-4">
        {auth.isLogin ? (
          <Button
            onClick={showLogoutModal} // ✅ Fix: Gọi modal thay vì logout trực tiếp
            disabled={isPending}
            className="bg-yellow-400 hover:bg-yellow-500 flex h-[42px] items-center gap-2 font-bold text-white"
          >
            <Icons.logOut className="text-white" />
            {isPending ? 'Đang xử lý...' : 'Đăng xuất'}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                route.push('/login');
              }}
              className="h-[42px] bg-[#E67E00] text-black hover:bg-[#d4710a]"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => setRegisterOpen(true)}
              className="h-[42px] bg-[#818A91] text-white hover:bg-[#6c757d]"
            >
              Đăng ký
            </Button>
            <RegisterChoiceModal
              open={isRegisterOpen}
              onClose={() => setRegisterOpen(false)}
            />
          </>
        )}

        {/* Logout Confirmation Modal */}
        <Modal
          open={isModalVisible} // ✅ Fix: Dùng 'open' thay vì 'visible' (Antd v5)
          centered
          closable={false}
          onCancel={handleCancelLogout}
          footer={[
            <Button
              key="cancel"
              onClick={handleCancelLogout}
              disabled={isPending}
              className="mr-2 border border-gray-300 hover:border-[#9B52BF]"
            >
              Hủy
            </Button>,
            <Button
              key="logout"
              onClick={handleConfirmLogout}
              disabled={isPending}
              className="border-red bg-red text-white hover:border-red hover:bg-red"
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
          bodyStyle={{ textAlign: 'center', paddingTop: 30 }}
          modalRender={(modal) => (
            <div
              className="p-5"
              style={{ borderRadius: 12, overflow: 'hidden' }}
            >
              {modal}
            </div>
          )}
        >
          <LogoutOutlined
            style={{ fontSize: 28, color: '#9B52BF', marginBottom: 20 }}
          />
          <h2 className="mb-2 text-xl font-bold">Xác nhận đăng xuất</h2>
          <p className="mb-5 text-gray-600">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
          </p>
        </Modal>
      </div>
    </nav>
  );
}
