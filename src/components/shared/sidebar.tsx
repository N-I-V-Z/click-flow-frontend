import HeaderNav from '@/components/shared/header-home';
import { navItems, subNavItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

/**
 * Sidebar là một thành phần giao diện người dùng hiển thị thanh điều hướng bên trái.
 * Nó bao gồm tiêu đề và một danh sách các mục điều hướng phụ.
 * Các biểu tượng cho mỗi mục điều hướng phụ được lấy từ thư viện `Icons`.
 * Thành phần `HeaderNav` được sử dụng để hiển thị các mục điều hướng chính.
 */
export default function Sidebar() {
  return (
    <nav
      className={cn(
        `relative z-10 mx-auto hidden w-[80%] flex-none md:block`,
        status && 'duration-500',
        'w-full'
      )}
    >
      <div className={cn('mx-auto w-[100%] px-0 pb-1', 'justify-center ')}>
        <div className=" flex  items-center justify-between">
          <>
            {/* <div className="text-[20px] font-bold">Click Flow</div> */}
            <div className="flex gap-2">
              {subNavItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground"
                  >
                    <span className="mr-2 truncate text-[13px]">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        </div>
        <div className=" space-y-4 ">
          <HeaderNav items={navItems} />
        </div>
      </div>
    </nav>
  );
}
