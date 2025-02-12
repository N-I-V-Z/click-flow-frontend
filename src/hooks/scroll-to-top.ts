import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hàm `ScrollToTop` tự động cuộn trang lên đầu mỗi khi đường dẫn thay đổi.
 * Sử dụng `useLocation` để lấy thông tin đường dẫn hiện tại.
 * Sử dụng `useLayoutEffect` để thực hiện cuộn trang ngay sau khi DOM cập nhật.
 * Mỗi khi `pathname` thay đổi, hàm sẽ gọi `window.scrollTo(0, 0)` để cuộn trang lên đầu.
 * Hàm không trả về giao diện nào.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
