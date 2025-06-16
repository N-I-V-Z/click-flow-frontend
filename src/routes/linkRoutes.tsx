import { Suspense, lazy } from 'react';

const LinkPage = lazy(() => import('@/pages/Link/Link'));
const LinkRoutes = [
  {
    path: '/link',
    element: (
      <Suspense>
        <LinkPage />
      </Suspense>
    )
  }
];

export default LinkRoutes;
