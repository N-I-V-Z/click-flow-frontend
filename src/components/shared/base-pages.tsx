import PageHead from '@/components/shared/page-head.jsx';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';

interface IBasePages {
  children?: React.ReactNode;
  className?: string;
  pageHead?: string;
  breadcrumbs?: { title: string; link: string }[];
}

/**
 * `BasePages` là một component React dùng để tạo cấu trúc cơ bản cho các trang trong ứng dụng.
 *
 * @param children - Nội dung con sẽ được hiển thị bên trong trang.
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho thẻ `div` bao quanh.
 * @param pageHead - Tiêu đề của trang, được truyền vào component `PageHead`.
 * @param breadcrumbs - Mảng các đối tượng breadcrumb, mỗi đối tượng chứa tiêu đề và liên kết.
 *
 * @returns Trả về một phần tử JSX chứa cấu trúc trang với tiêu đề, breadcrumb và nội dung con.
 */
const BasePages = ({
  children,
  className,
  pageHead,
  breadcrumbs
}: IBasePages) => {
  return (
    <>
      <PageHead title={pageHead} />
      <div className={className}>
        <div className="hidden items-center justify-between md:flex md:pr-8">
          <div> {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}</div>
          <div className="flex items-center justify-center">
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default BasePages;
