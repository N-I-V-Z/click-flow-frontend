import { useEffect } from 'react';

export const usePageTitle = (title: string, restoreOnUnmount = false): void => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    return () => {
      if (restoreOnUnmount) {
        document.title = originalTitle;
      }
    };
  }, [title, restoreOnUnmount]);
};
