import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

/**
 * Hook này cung cấp các phương thức điều hướng cho ứng dụng.
 *
 * @description
 * - `back`: Điều hướng về trang trước đó.
 * - `forward`: Điều hướng tới trang tiếp theo.
 * - `reload`: Tải lại trang hiện tại.
 * - `push`: Điều hướng tới một đường dẫn mới.
 * - `replace`: Thay thế trang hiện tại bằng một đường dẫn mới.
 */
export function useRouter() {
  const navigate = useNavigate();

  const router = useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, { replace: true })
    }),
    [navigate]
  );

  return router;
}
