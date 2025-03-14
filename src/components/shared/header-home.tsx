import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import RegisterChoiceModal from '@/pages/AuthPage/Register/RegisterChoise';
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
import helpers from '@/helpers';
import { logout } from '@/redux/auth.slice';
import { useLogout } from '@/queries/auth.query';
import { useDispatch } from 'react-redux';

interface DashboardNavProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

const items: NavItem[] = [{ title: 'Trang chủ', href: '/' }];

export default function HeaderNav({ setOpen }: DashboardNavProps) {
  const path = usePathname();
  const route = useRouter();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const { mutateAsync: logoutAccount } = useLogout();
  const refreshToken = helpers.cookie_get('RT');
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutAccount({
      refreshToken: refreshToken
    });
    helpers.cookie_delete('RT');
    helpers.cookie_delete('AT');
    router.push('/login');
    dispatch(logout());
  };
  return (
    <nav className="grid grid-cols-[15%,55%,25%] items-center bg-[#8329af] shadow-md">
      {/* LOGO */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="src/assets/logo.jpg"
            alt="Logo"
            className="ml-20 h-[100px] w-[140px] rounded-lg"
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
            onClick={handleLogout}
            className="bg-yellow-400 flex h-[42px] items-center gap-2 font-bold text-black"
          >
            <Icons.logOut className="text-white" />
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                route.push('/login');
              }}
              className="h-[42px] bg-[#E67E00] text-black"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => setRegisterOpen(true)}
              className="h-[42px] bg-[#818A91] text-white"
            >
              Đăng ký
            </Button>
            <RegisterChoiceModal
              open={isRegisterOpen}
              onClose={() => setRegisterOpen(false)}
            />
          </>
        )}
      </div>
    </nav>
  );
}
