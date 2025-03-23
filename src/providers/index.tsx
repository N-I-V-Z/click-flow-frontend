import { Button } from '@/components/ui/button';
import { useRouter } from '@/routes/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from './theme-provider';
import { SidebarProvider } from '@/hooks/use-sidebar';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2
    }
  }
});

/**
 * Thành phần giao diện hiển thị khi có lỗi xảy ra.
 *
 * @param error - Đối tượng lỗi chứa thông tin về lỗi.
 */
const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter();
  return (
    <div
      className="text-red-500 flex h-screen w-screen flex-col  items-center justify-center"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">Something went wrong :( </h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className="mt-4" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
};

/**
 * AppProvider là một component bao bọc các thành phần con với các nhà cung cấp cần thiết.
 *
 * - `Suspense`: Cho phép tải chậm các component con.
 * - `HelmetProvider`: Cung cấp khả năng quản lý thẻ `<head>` của tài liệu.
 * - `BrowserRouter`: Cung cấp điều hướng cho ứng dụng.
 * - `ErrorBoundary`: Bắt lỗi trong cây component và hiển thị giao diện dự phòng.
 * - `QueryClientProvider`: Cung cấp client cho react-query để quản lý truy vấn dữ liệu.
 * - `ReactQueryDevtools`: Công cụ phát triển cho react-query.
 * - `ThemeProvider`: Cung cấp chủ đề giao diện cho ứng dụng.
 * - `SidebarProvider`: Cung cấp ngữ cảnh cho sidebar.
 *
 * @param children - Các thành phần con cần được bao bọc.
 */
export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools />
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  );
}
