import { cn } from '@/lib/utils';

/**
 * Thành phần Skeleton được sử dụng để hiển thị một khung xương cho các phần tử giao diện người dùng
 * trong khi dữ liệu thực tế đang được tải. Nó giúp cải thiện trải nghiệm người dùng bằng cách
 * cung cấp một hình ảnh tạm thời thay vì để trống.
 *
 * @param className - Tên lớp CSS tùy chỉnh để áp dụng cho thành phần
 * @param props - Các thuộc tính HTML khác có thể được truyền vào thành phần
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
}

export { Skeleton };
