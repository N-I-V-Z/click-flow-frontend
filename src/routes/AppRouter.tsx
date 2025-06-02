import { useRoutes, Navigate } from 'react-router-dom';
import homeRoutes from './homeRoutes';
import advertiserRoutes from './advertiserRoutes';
import publisherRoutes from './publisherRoutes';
import adminRoutes from './adminRoutes';
import NotFound from '@/pages/NotFound';
import LinkRoutes from './linkRoutes';
import adverAndPubRoutes from './adverAndPubRoute';

export default function AppRouter() {
  const routes = useRoutes([
    ...homeRoutes,
    ...advertiserRoutes,
    ...publisherRoutes,
    ...adminRoutes,
    ...adverAndPubRoutes,
    ...LinkRoutes,
    { path: '/404', element: <NotFound /> },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);

  return routes;
}
