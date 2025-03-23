import { login, setRole } from '@/redux/auth.slice';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';

interface LoginRouteProps {
  children: React.ReactNode;
}

const LoginRoute = ({ children }: LoginRouteProps) => {
  const dispatch = useDispatch();

  const decodedToken: TokenDecoded | null = helpers.decodeTokens(
    __helpers.cookie_get('AT')
  );

  if (decodedToken !== null) {
    try {
      dispatch(setRole(decodedToken.Role));
      dispatch(login());
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return <Navigate to={'/login'} replace />;
    }
  } else {
    __helpers.cookie_delete('AT');
    __helpers.cookie_delete('RT');
    return <Navigate to={'/login'} replace />;
  }

  return <>{children}</>;
};

export default LoginRoute;
