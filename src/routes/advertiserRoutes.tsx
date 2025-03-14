import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoginRoute from './private/LoginRoute';
import RoleRoute from './private/RoleRoute';

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
const Wallet = lazy(() => import('@/pages/Advertiser/Wallet'));

const advertiserRoutes = [
  {
    path: '/advertiser',
    element: (
      <LoginRoute>
        <Suspense>
          <AdvertiserLayout />
        </Suspense>
      </LoginRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['Advertiser']}>
            {' '}
            <AdvertiserDashboard />{' '}
          </RoleRoute>
        )
      },
      {
        path: 'campaigns',
        element: (
          <RoleRoute allowedRoles={['Advertiser']}>
            {' '}
            <AdvertiserCampaigns />
          </RoleRoute>
        )
      },
      {
        path: 'advertiser-profile',
        element: (
          <RoleRoute allowedRoles={['Advertiser']}>
            <AdvertiserProfile />
          </RoleRoute>
        )
      },
      {
        path: 'change-password',
        element: (
          <RoleRoute allowedRoles={['Advertiser']}>
            {' '}
            <ChangePassword />
          </RoleRoute>
        )
      },
      {
        path: 'wallet',
        element: (
          <RoleRoute allowedRoles={['Advertiser']}>
            <Wallet />{' '}
          </RoleRoute>
        )
      }
    ]
  }
];

export default advertiserRoutes;
