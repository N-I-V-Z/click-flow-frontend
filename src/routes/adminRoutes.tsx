// src/routes/adminRoutes.tsx
import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoginRoute from './private/LoginRoute';
import RoleRoute from './private/RoleRoute';

const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/Admin/index'));
const AdminCampaignRequest = lazy(
  () => import('@/pages/Admin/CampaignRequest')
);
const AdminPublisherList = lazy(() => import('@/pages/Admin/ManagePublisher'));
const AdminCampaignList = lazy(() => import('@/pages/Admin/CampaignList'));
const AdminAdvertiserList = lazy(
  () => import('@/pages/Admin/ManageAdvertiser')
);
const AdminCampaignDetail = lazy(() => import('@/pages/Admin/CampaignDetail'));
const AdminManageReport = lazy(() => import('@/pages/Admin/ManageReport'));
const AdminCampaignPendingDetail = lazy(
  () => import('@/pages/Admin/CampaignPendingDetail')
);
// Nếu có các trang khác, lazy load tiếp:
// const AdminCampaign = lazy(() => import('@/pages/Admin/Campaign'));
// ...

const adminRoutes = [
  {
    path: '/admin',
    element: (
      <LoginRoute>
        <Suspense fallback={<div>Loading Admin Layout...</div>}>
          <AdminLayout />
        </Suspense>
      </LoginRoute>
    ),
    children: [
      // Nếu gõ "/admin" thì tự chuyển sang "/admin/dashboard"
      { index: true, element: <Navigate to="dashboard" replace /> },

      {
        path: 'dashboard',
        element: (
          <RoleRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </RoleRoute>
        )
      },
      {
        path: 'campaignlist',
        element: (
          <RoleRoute allowedRoles={['Admin']}>
            {' '}
            <AdminCampaignList />
          </RoleRoute>
        )
      },
      {
        path: 'campaignrequest',
        element: (
          <RoleRoute allowedRoles={['Admin']}>
            {' '}
            <AdminCampaignRequest />
          </RoleRoute>
        )
      },
      {
        path: 'managepublisher',
        element: (
          <RoleRoute allowedRoles={['Admin']}>
            <AdminPublisherList />{' '}
          </RoleRoute>
        )
      },
      {
        path: 'manageadvertiser',
        element: (
          <RoleRoute allowedRoles={['Admin']}>
            {' '}
            <AdminAdvertiserList />{' '}
          </RoleRoute>
        )
      },
      {
        path: 'managereport',
        element: (
          <RoleRoute allowedRoles={['Admin']}>
            {' '}
            <AdminManageReport />{' '}
          </RoleRoute>
        )
      },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'campaignlist', element: <AdminCampaignList /> },
      { path: 'campaignrequest', element: <AdminCampaignRequest /> },
      { path: 'managepublisher', element: <AdminPublisherList /> },
      { path: 'manageadvertiser', element: <AdminAdvertiserList /> },
      { path: 'managereport', element: <AdminManageReport /> },
      { path: 'campaign-detail/:id', element: <AdminCampaignDetail /> },
      {
        path: 'campaign-request-detail/:id',
        element: <AdminCampaignPendingDetail />
      }
      // { path: 'campaign', element: <AdminCampaign /> },
      // ...
    ]
  }
];

export default adminRoutes;
