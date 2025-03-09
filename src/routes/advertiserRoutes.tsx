// src/routes/advertiserRoutes.tsx
import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const AdvertiserLayout = lazy(
  () => import('@/components/layout/AdvertiserLayout/index')
);
const AdvertiserDashboard = lazy(() => import('@/pages/Advertiser'));
const AdvertiserCampaigns = lazy(() => import('@/pages/Advertiser/Campaign'));
const AdvertiserProfile = lazy(
  () => import('@/pages/Advertiser/AdvertiserProfile')
);
const ChangePassword = lazy(
  () => import('@/components/shared/change-password')
);

const advertiserRoutes = [
  {
    path: '/advertiser',
    element: (
      <Suspense>
        <AdvertiserLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdvertiserDashboard /> },
      { path: 'campaigns', element: <AdvertiserCampaigns /> },
      { path: 'advertiser-profile', element: <AdvertiserProfile /> },
      { path: 'change-password', element: <ChangePassword /> }
    ]
  }
];

export default advertiserRoutes;
