import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PublisherLayout from '@/components/layout/PublisherLayout';
import LoginRoute from './private/LoginRoute';
import RoleRoute from './private/RoleRoute';

const PublisherDashboard = lazy(() => import('@/pages/Publisher/index'));
const PublisherCampaignPage = lazy(
  () => import('@/pages/Publisher/CampaignsPage')
);
const PublisherCampaignDetailPage = lazy(
  () => import('@/pages/Publisher/CampaignDetailPage')
);
const ChangePassword = lazy(
  () => import('@/components/shared/change-password')
);
const PublisherProfile = lazy(
  () => import('@/pages/Publisher/PublisherProfile')
);
const Wallet = lazy(() => import('@/pages/Publisher/Wallet'));
const Courses = lazy(() => import('@/pages/Publisher/Course'));
const PublisherRoutes = [
  {
    path: '/publisher',
    element: (
      <LoginRoute>
        <Suspense fallback={<div>Loading Publisher Layout...</div>}>
          <PublisherLayout />
        </Suspense>
      </LoginRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            <PublisherDashboard />{' '}
          </RoleRoute>
        )
      },
      {
        path: 'campaign',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            {' '}
            <PublisherCampaignPage />{' '}
          </RoleRoute>
        )
      },
      {
        path: 'campaign-detail/:id',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            <PublisherCampaignDetailPage />{' '}
          </RoleRoute>
        )
      },
      {
        path: 'publisher-profile',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            <PublisherProfile />
          </RoleRoute>
        )
      },
      {
        path: 'change-password',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            {' '}
            <ChangePassword />
          </RoleRoute>
        )
      },
      {
        path: 'wallet-publisher',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            {' '}
            <Wallet />
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
      // Đã chuyển route courses sang adverAndPubRoute, xóa khỏi publisherRoutes
      // Các route con khác nếu có...
    ]
  }
];

export default PublisherRoutes;
