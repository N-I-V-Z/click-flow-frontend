import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import AdvertiserLayout from '@/components/layout/AdvertiserLayout';
import PublisherLayout from '@/components/layout/PublisherLayout';

export default function AllCommonLayout() {
  const userRole = useSelector((state: RootState) => state.auth.role);

  // Nếu chưa login → /login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Nếu là Admin → /admin
  if (userRole === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  // Nếu là Advertiser → render AdvertiserLayout (nó cũng phải chứa Outlet bên trong)
  if (userRole === 'Advertiser') {
    return <AdvertiserLayout />;
  }

  // Nếu là Publisher → render PublisherLayout (nó đã có Outlet bên trong)
  if (userRole === 'Publisher') {
    return <PublisherLayout />;
  }

  // Role khác → /login
  return <Navigate to="/login" replace />;
}
