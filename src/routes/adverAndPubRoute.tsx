// src/routes/adverAndPubRoutes.tsx
import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import LoginRoute from './private/LoginRoute';
import RoleRoute from './private/RoleRoute';

// Layout trung gian
const AllCommonLayout = lazy(
  () => import('@/components/layout/AllLayout/index')
);

// Các trang con dùng chung (Forum, Course, v.v.)
const Forum = lazy(() => import('@/pages/Advertiser/Forum'));
const News = lazy(() => import('@/pages/Advertiser/NewsSection'));

// Nếu có thêm các route con chi tiết, import tương tự
// const ForumDetail = lazy(() => import('@/pages/Forum/ForumDetail'));
// const CourseDetail = lazy(() => import('@/pages/Course/CourseDetail'));

const adverAndPubRoutes = [
  {
    path: '/all', // hay bạn muốn gọi là '/common' cũng được
    element: (
      <LoginRoute>
        <Suspense fallback={<div>Loading common layout…</div>}>
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
