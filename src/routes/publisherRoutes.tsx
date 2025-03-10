import { Navigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

const publicRoutes = [
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> }
];

export default publicRoutes;
