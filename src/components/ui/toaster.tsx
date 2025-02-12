import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

/**
 * Thành phần Toaster hiển thị các thông báo (toast) cho người dùng.
 * Sử dụng hook `useToast` để lấy danh sách các thông báo hiện tại.
 * Mỗi thông báo bao gồm tiêu đề, mô tả, và hành động tùy chọn.
 * Các thông báo được hiển thị trong một lưới với khoảng cách giữa các phần tử.
 * Thành phần `ToastClose` cho phép người dùng đóng thông báo.
 * `ToastViewport` quản lý vị trí hiển thị của các thông báo.
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
