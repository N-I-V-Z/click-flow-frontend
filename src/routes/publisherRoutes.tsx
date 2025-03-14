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
      }
      // Các route con khác nếu có...
    ]
  }
];

export default PublisherRoutes;
