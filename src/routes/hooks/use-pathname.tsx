import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

/**
 * Hook để lấy giá trị `pathname` từ `useLocation`.
 */
export function usePathname() {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
}
