import { login, setRole } from '@/redux/auth.slice';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';

interface LoginRouteProps {
  children: React.ReactNode;
}

const LoginRoute = ({ children }: LoginRouteProps) => {
  const dispatch = useDispatch();

  const decodedToken: TokenDecoded = helpers.decodeTokens();
  if (decodedToken) {
    try {
      const role =
        decodedToken.Role === 'Admin'
          ? 'Admin'
          : decodedToken.Role === 'Advertiser'
            ? 'Advertiser'
            : 'Publisher';
      dispatch(setRole(role));
      dispatch(login());
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return <Navigate to={'/login'} replace />;
    }
  } else {
    return <Navigate to={'/login'} replace />;
  }

  return <>{children}</>;
};

export default LoginRoute;
