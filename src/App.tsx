import ScrollToTop from './hooks/scroll-to-top';
import AppProvider from './providers';
import AppRouter from './routes';

/**
 * Thành phần `App` là thành phần gốc của ứng dụng.
 * Nó bao bọc các thành phần con trong `AppProvider` để cung cấp ngữ cảnh toàn cục.
 * `ScrollToTop` đảm bảo rằng trang sẽ cuộn lên đầu khi điều hướng.
 * `AppRouter` quản lý các tuyến đường của ứng dụng.
 */
export default function App() {
  return (
    <AppProvider>
      {/* 1 hook được tạo để di chuyển lên đầu trang */}
      <ScrollToTop />
      <AppRouter />
    </AppProvider>
  );
}
