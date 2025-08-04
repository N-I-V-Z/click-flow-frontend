import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook để tự động refresh dữ liệu khi:
 * 1. Component mount
 * 2. Window focus
 * 3. Route change (chuyển tab trong sidebar)
 */
export const useAutoRefresh = (refreshFunctions: (() => void)[]) => {
  const location = useLocation();

  const executeRefresh = useCallback(() => {
    refreshFunctions.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.error('Error executing refresh function:', error);
      }
    });
  }, [refreshFunctions]);

  useEffect(() => {
    // Refetch ngay khi component mount
    executeRefresh();

    // Lắng nghe sự kiện window focus
    const handleFocus = () => {
      executeRefresh();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [executeRefresh]);

  // Effect riêng để handle route change
  useEffect(() => {
    // Delay một chút để component có thể mount hoàn toàn
    const timeoutId = setTimeout(executeRefresh, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, executeRefresh]);
};
