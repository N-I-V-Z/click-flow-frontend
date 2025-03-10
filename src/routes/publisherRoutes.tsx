import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PublisherLayout from '@/components/layout/PublisherLayout';

const PublisherDashboard = lazy(() => import('@/pages/Publisher/index'));

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
      { path: 'dashboard', element: <PublisherDashboard /> }
      // Các route con khác nếu có...
    ]
  }
];

export default PublisherRoutes;
