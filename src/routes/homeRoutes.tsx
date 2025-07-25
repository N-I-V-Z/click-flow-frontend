import { Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ScrollToTop from '@/hooks/scroll-to-top';
import RenewPasswordPage from '@/pages/AuthPage/ResetPassword/ForgotPassword';

const SystemLayout = lazy(() => import('@/components/layout/index'));
const HomePage = lazy(() => import('@/pages/Home/index'));
const LoginPage = lazy(() => import('@/pages/AuthPage/Login/index'));
const ForgotPasswordPage = lazy(() => import('@/pages/AuthPage/ResetPassword'));
const RegisterAdvertiserPage = lazy(
  () => import('@/pages/AuthPage/Register/RegisterAdvertiser')
);
const RegisterPublisherPage = lazy(
  () => import('@/pages/AuthPage/Register/RegisterPublisher')
);
const Privacy = lazy(() => import('@/pages/OtherPage/privacy'));
const TermsOfService = lazy(() => import('@/pages/OtherPage/TermsOfService'));
const LearnMorePage = lazy(() => import('./../pages/Home/LearnMore'));
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
      { path: 'register-advertiser', element: <RegisterAdvertiserPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'register-publisher', element: <RegisterPublisherPage /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <TermsOfService /> },
      { path: 'learn-more', element: <LearnMorePage /> },
      { path: 'renew-password', element: <RenewPasswordPage /> }
    ]
  }
];

export default homeRoutes;
