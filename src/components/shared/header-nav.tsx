import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { useRouter } from '@/routes/hooks';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

/**
 * `HeaderNav` là một component điều hướng cho trang dashboard.
 *
 * @param items - Danh sách các mục điều hướng.
 * @param setOpen - Hàm để thiết lập trạng thái mở của sidebar.
 * @param isMobileNav - Xác định nếu điều hướng đang ở chế độ di động.
 *
 * @description
 * Component này sử dụng các hook để quản lý trạng thái tìm kiếm sản phẩm, điều hướng, và hiển thị tooltip cho các mục điều hướng.
 *
 * Khi người dùng nhập từ khóa tìm kiếm, kết quả sẽ được tìm kiếm và hiển thị trong một danh sách thả xuống. Người dùng có thể nhấp vào sản phẩm để điều hướng đến trang chi tiết sản phẩm.
 *
 * Nếu người dùng đã đăng nhập, sẽ hiển thị biểu tượng giỏ hàng và người dùng, nếu không sẽ hiển thị nút đăng nhập/đăng ký.
 */
export default function HeaderNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const route = useRouter();
  const { isMinimized } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const auth = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

  const handleSearch = async () => {
  };

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid grid-cols-[45%,55%] items-center gap-2">
      <div className="flex space-x-[60px]">
        <TooltipProvider>
          {items.map((item, index) => {
            const Icon = Icons[item.icon || 'arrowRight'];
            return (
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.disabled ? '/' : item.href}
                      className={cn(
                        'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                        path === item.href
                          ? 'text-black hover:text-black'
                          : 'transparent',
                        item.disabled && 'cursor-not-allowed opacity-80'
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                    >
                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <div className="flex flex-col">
                          <span
                            className={`${index == 0 ? 'text-000' : index == 1 ? 'text-[#000]' : 'text-[#000]'} truncate text-[14.5px]`}
                          >
                            {item.title}
                          </span>
                          <span className=" truncate text-[10px]">
                            {item.subTitle}
                          </span>
                        </div>
                      ) : (
                        ''
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden' : 'inline-block'}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            );
          })}
        </TooltipProvider>
      </div>
      <div className="flex items-center justify-end space-x-3">
        <div className="relative w-[80%]">
          <Input
            type="text"
            placeholder="Search gì đó"
            className="h-8 w-full rounded-md bg-gray-200 px-4 py-5 text-[12px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          ></Input>

          {isFocused && searchTerm && (
            <div className="absolute left-0 right-0 top-12 z-10 max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
              
            </div>
          )}
        </div>

        {auth.isLogin ? (
          <>
            <Link to="/cart">
              <div className="font-sm flex gap-2 rounded-lg bg-yellow p-2 font-bold ">
                <Icons.shoppingCart className="" />
              </div>
            </Link>
            <div
              className="font-sm flex cursor-pointer gap-2 rounded-lg bg-gray-300 p-2 font-bold"
              onClick={() => route.push('/profile')}
            >
              <Icons.user className="" />
            </div>
          </>
        ) : (
          <div className="flex  gap-2 rounded-lg bg-yellow ">
            <Button
              onClick={() => route.push('/login')}
              className=" h-[42px] bg-transparent text-black"
              variant="outline"
            >
              Đăng nhập / Đăng ký
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
