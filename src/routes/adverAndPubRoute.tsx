import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import LoginRoute from './private/LoginRoute';
import RoleRoute from './private/RoleRoute';

const AllCommonLayout = lazy(
  () => import('@/components/layout/AllLayout/index')
);
const Forum = lazy(() => import('@/pages/Advertiser/Forum'));
const News = lazy(() => import('@/pages/Advertiser/NewsSection'));
const PaymentSuccess = lazy(() => import('@/pages/Payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('@/pages/Payment/PaymentCancel'));
const ForumDetailPage = lazy(
  () => import('@/pages/Advertiser/ForumDetailPage')
);
const Courses = lazy(() => import('@/pages/Publisher/Course'));
const adverAndPubRoutes = [
  {
    path: '/all', // hay bạn muốn gọi là '/common' cũng được
    element: (
      <LoginRoute>
        <Suspense>
          <AllCommonLayout />
        </Suspense>
      </LoginRoute>
    ),
    children: [
      // Khi user vào /all → tự redirect sang /all/forum
      { index: true, element: <Navigate to="forum" replace /> },

      // Route /all/forum
      {
        path: 'forum',
        element: (
          <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
            <Forum />
          </RoleRoute>
        )
      },
      {
        path: 'news',
        element: (
          <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
            <News />
          </RoleRoute>
        )
      },
      {
        path: 'payment-success',
        element: (
          <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
            <PaymentSuccess />
          </RoleRoute>
        )
      },
      {
        path: 'payment-cancel',
        element: (
          <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
            <PaymentCancel />
          </RoleRoute>
        )
      },
      // Thêm route forum-detail vào adverAndPubRoute
      {
        path: 'forum-detail/:id',
        element: (
          <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
            <Suspense>
              {/** ForumDetailPage sẽ tự lấy post từ location.state hoặc fetch từ API */}
              <ForumDetailPage />
            </Suspense>
          </RoleRoute>
        )
      },
      {
        path: 'courses',
        element: (
          <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
            <Courses />
          </RoleRoute>
        )
      }
    ]
  }
];

export default adverAndPubRoutes;
