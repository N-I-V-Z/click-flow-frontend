import { navItems } from '@/constants/data';
import { usePathname } from '@/routes/hooks';
import Heading from './heading';
import UserNav from './user-nav';
import { ModeToggle } from './theme-toggle';

/**
 * Hàm `useMatchedPath` tìm kiếm và trả về tiêu đề của đường dẫn phù hợp từ danh sách `navItems`.
 *
 * @param pathname Đường dẫn hiện tại cần kiểm tra.
 * @returns Tiêu đề của đường dẫn phù hợp hoặc chuỗi rỗng nếu không tìm thấy.
 */
const useMatchedPath = (pathname: string) => {
  const matchedPath =
    navItems.find((item) => item.href === pathname) ||
    navItems.find(
      (item) => pathname.startsWith(item.href + '/') && item.href !== '/'
    );
  return matchedPath?.title || '';
};

/**
 * Hàm `Header` tạo ra một tiêu đề với văn bản phù hợp dựa trên đường dẫn hiện tại.
 *
 * @description
 * Sử dụng `usePathname` để lấy đường dẫn hiện tại và `useMatchedPath` để tìm tiêu đề tương ứng.
 * Hiển thị tiêu đề, điều hướng người dùng và chế độ sáng/tối.
 */
export default function Header() {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname);

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4">
      <Heading title={headingText} />
      <div className="ml-4 flex items-center md:ml-6">
        <UserNav />
        <ModeToggle />
      </div>
    </div>
  );
}
