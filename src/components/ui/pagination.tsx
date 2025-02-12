import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Thành phần `Pagination` tạo một thanh điều hướng phân trang.
 *
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho thành phần.
 * @param props - Các thuộc tính khác được truyền vào thành phần `nav`.
 */
const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('cursor-pointer', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

/**
 * Thành phần `PaginationLink` đại diện cho một liên kết trong phân trang.
 *
 * @param className - Lớp CSS tùy chỉnh để áp dụng cho liên kết.
 * @param isActive - Xác định xem liên kết có đang hoạt động hay không.
 * @param size - Kích thước của liên kết, mặc định là 'icon'.
 * @param props - Các thuộc tính khác được truyền vào liên kết.
 *
 * @description
 * Thành phần này sử dụng các biến thể của nút để xác định kiểu dáng dựa trên trạng thái hoạt động và kích thước.
 * Nếu `isActive` là true, liên kết sẽ có kiểu 'default', ngược lại là 'ghost'.
 */
const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'default' : 'ghost',
        size
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

/**
 * Thành phần `PaginationPreviousLast` dùng để điều hướng đến trang trước đó.
 *
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho thành phần.
 * @param props - Các thuộc tính khác được truyền vào thành phần.
 *
 * @description
 * Thành phần này sử dụng `PaginationLink` để tạo liên kết điều hướng, với biểu tượng `ChevronLeft` để biểu thị hướng quay lại.
 * Kích thước mặc định của liên kết là 'default'.
 *
 * `aria-label` được sử dụng để cung cấp mô tả cho người dùng công nghệ hỗ trợ.
 * `sr-only` được sử dụng để ẩn văn bản khỏi giao diện người dùng nhưng vẫn có thể truy cập được cho người dùng công nghệ hỗ trợ.
 */
const PaginationPreviousLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous Last</span>
  </PaginationLink>
);

PaginationPreviousLast.displayName = 'PaginationPreviousLast';

/**
 * Thành phần PaginationPrevious hiển thị một liên kết để chuyển đến trang trước đó trong phân trang.
 *
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho liên kết.
 * @param props - Các thuộc tính khác được truyền vào liên kết.
 *
 * @description
 * Thành phần này sử dụng `PaginationLink` để tạo liên kết với biểu tượng mũi tên trái và văn bản "Trước".
 * Biểu tượng mũi tên trái được hiển thị bằng cách sử dụng `ChevronLeftIcon`.
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span>Trước</span>
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

/**
 * Thành phần `PaginationNext` đại diện cho nút chuyển đến trang tiếp theo trong phân trang.
 *
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho thành phần.
 * @param props - Các thuộc tính khác được truyền vào thành phần `PaginationLink`.
 *
 * @description
 * Thành phần này sử dụng `PaginationLink` để tạo một liên kết với nhãn "Sau" và biểu tượng mũi tên phải.
 * Biểu tượng mũi tên phải được hiển thị với kích thước 4x4.
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Sau</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

/**
 * `PaginationNextLast` là một thành phần giao diện người dùng cho phép người dùng
 * điều hướng đến trang cuối cùng trong một danh sách phân trang.
 *
 * Thành phần này sử dụng `PaginationLink` để tạo một liên kết điều hướng,
 * với các thuộc tính bổ sung được truyền vào thông qua `props`.
 *
 * @param className - Chuỗi CSS tùy chỉnh để thêm vào lớp mặc định.
 * @param props - Các thuộc tính khác được truyền vào `PaginationLink`.
 *
 * @description
 * Thành phần này hiển thị một biểu tượng mũi tên phải từ `ChevronRight`
 * và một văn bản ẩn "Next Last" để hỗ trợ truy cập.
 */
const PaginationNextLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span className="sr-only">Next Last</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNextLast.displayName = 'PaginationNextLast';

/**
 * Thành phần PaginationEllipsis hiển thị dấu ba chấm để chỉ ra rằng có nhiều trang hơn.
 *
 * @param className - Lớp CSS tùy chỉnh để áp dụng cho thành phần.
 * @param props - Các thuộc tính khác được truyền vào thành phần.
 *
 * @description
 * Thành phần này sử dụng `DotsHorizontalIcon` để hiển thị biểu tượng dấu ba chấm.
 * Nó cũng bao gồm một phần tử `span` ẩn với văn bản "More pages" để hỗ trợ truy cập.
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationPreviousLast,
  PaginationNextLast
};
