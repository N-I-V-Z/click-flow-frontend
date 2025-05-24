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
const Misson = lazy(() => import('@/pages/Publisher/Misson'));
const Wallet = lazy(() => import('@/pages/Publisher/Wallet'));
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
        path: 'mission',
        element: (
          <RoleRoute allowedRoles={['Publisher']}>
            {' '}
            <Misson />
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
      }
      // Các route con khác nếu có...
    ]
  }
];

export default PublisherRoutes;
