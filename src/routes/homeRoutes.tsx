import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ScrollToTop from '@/hooks/scroll-to-top';

const SystemLayout = lazy(() => import('@/components/layout/index'));
const HomePage = lazy(() => import('@/pages/Home/index'));
const LoginPage = lazy(() => import('@/pages/AuthPage/Login/index'));
const RegisterPage = lazy(() => import('@/pages/AuthPage/Register/index'));
const ForgotPasswordPage = lazy(() => import('@/pages/AuthPage/ResetPassword'));
const RegisterAdvertiserPage = lazy(
  () => import('@/pages/AuthPage/Register/RegisterAdvertiser')
);
const RegisterPublisherPage = lazy(
  () => import('@/pages/AuthPage/Register/RegisterPublisher')
);
const Privacy = lazy(() => import('@/pages/OtherPage/privacy'));
const LearnMorePage = lazy(() => import('./../pages/Home/LearnMore'));
const LinkPage = lazy(() => import('@/pages/Home/Link'));
const homeRoutes = [
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
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'register-advertiser', element: <RegisterAdvertiserPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'register-publisher', element: <RegisterPublisherPage /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'learn-more', element: <LearnMorePage /> },
      {
        path: 'link/:publisherId/:campaignId',
        element: <LinkPage />
      }
    ]
  }
];

export default homeRoutes;
