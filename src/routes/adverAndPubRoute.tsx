import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import LoginRoute from './private/LoginRoute';
import RoleRoute from './private/RoleRoute';

const AllCommonLayout = lazy(
  () => import('@/components/layout/AllLayout/index')
);
const Forum = lazy(() => import('@/pages/Advertiser/Forum'));
const News = lazy(() => import('@/pages/Advertiser/NewsSection'));
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
      }

      // Route /all/course

      // Ví dụ thêm route con chi tiết Forum
      // {
      //   path: 'forum/:threadId',
      //   element: (
      //     <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
      //       <ForumDetail />
      //     </RoleRoute>
      //   ),
      // },

      // Ví dụ thêm route con chi tiết Course
      // {
      //   path: 'course/:courseId',
      //   element: (
      //     <RoleRoute allowedRoles={['Advertiser', 'Publisher']}>
      //       <CourseDetail />
      //     </RoleRoute>
      //   ),
      // },
    ]
  }
];

export default adverAndPubRoutes;
