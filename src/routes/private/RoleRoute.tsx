import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface RoleRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const userRole = auth.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
