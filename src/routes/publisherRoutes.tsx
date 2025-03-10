import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PublisherLayout from '@/components/layout/PublisherLayout';

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
      <Suspense fallback={<div>Loading Publisher Layout...</div>}>
        <PublisherLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <PublisherDashboard /> },
      { path: 'campaign', element: <PublisherCampaignPage /> },
      { path: 'campaign-detail', element: <PublisherCampaignDetailPage /> }
      // Các route con khác nếu có...
    ]
  }
];

export default PublisherRoutes;
