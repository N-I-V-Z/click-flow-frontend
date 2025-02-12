import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Thành phần Toaster hiển thị thông báo với chủ đề tùy chỉnh.
 *
 * @param props - Các thuộc tính được truyền vào cho thành phần Toaster.
 *
 * @description
 * Sử dụng hook `useTheme` để lấy chủ đề hiện tại, mặc định là 'system'.
 * Thành phần `Sonner` được sử dụng để hiển thị thông báo với các tùy chọn
 * về lớp CSS cho các phần tử khác nhau như toast, description, actionButton,
 * và cancelButton. Các lớp CSS này được định nghĩa để thay đổi giao diện
 * dựa trên chủ đề và trạng thái của thông báo.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
