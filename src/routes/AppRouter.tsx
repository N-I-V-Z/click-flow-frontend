import { useRoutes } from 'react-router-dom';
import homeRoutes from './homeRoutes';
import advertiserRoutes from './advertiserRoutes';
import publisherRoutes from './publisherRoutes';

export default function AppRouter() {
  const routes = useRoutes([
    ...homeRoutes,
    ...advertiserRoutes,
    ...publisherRoutes
  ]);

  return routes;
}
