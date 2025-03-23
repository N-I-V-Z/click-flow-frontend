import __helpers from '@/helpers';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const userRole = auth.role || '';

  if (!userRole || !allowedRoles.includes(userRole)) {
    if (userRole === 'Admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'Advertiser') {
      return <Navigate to="/advertiser" replace />;
    } else if (userRole === 'Publisher') {
      return <Navigate to="/publisher" replace />;
    } else return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
