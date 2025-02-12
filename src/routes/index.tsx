import ScrollToTop from '@/hooks/scroll-to-top';
import NotFound from '@/pages/NotFound';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

// Lazy loading là kỹ thuật chỉ tải các thành phần cần thiết khi chúng được yêu cầu, giúp cải thiện hiệu suất ứng dụng. Ở đây, sử dụng lazy để tải các trang và layout khi cần thiết.
const SystemLayout = lazy(() => import('@/components/layout/layout'));
const HomePage = lazy(() => import('@/pages/Home/index'));
const LoginPage = lazy(() => import('@/pages/AuthPage/Login/index'));
const RegisterPage = lazy(() => import('@/pages/AuthPage/Register/index'));

export default function AppRouter() {
  const systemRoute = [
    {
      path: '/',
      element: (
        <SystemLayout>
          <Suspense>
            <ScrollToTop />
            <Outlet />
          </Suspense>
        </SystemLayout>
      ),
      children: [
        {
          element: <HomePage />,
          index: true
        },
        {
          path: '/login',
          element: <LoginPage />
        },
        {
          path: '/register',
          element: <RegisterPage />
        }
      ]
    }
  ];

  // Đây là các tuyến không thuộc phần hệ thống chính, bao gồm các trang như "404 - Not Found".
  const publicRoutes = [
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...systemRoute, ...publicRoutes]);

  return routes;
}
