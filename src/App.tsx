import { useState, useEffect } from 'react';
import ScrollToTop from './hooks/scroll-to-top';
import AppProvider from './providers';
import AppRouter from '@/routes/AppRouter';
import Loading from './components/ui/loading';
import ToastNotification from './components/shared/ToastNotification';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ScrollToTop />
          <AppRouter />
          <ToastNotification />
        </>
      )}
    </AppProvider>
  );
}
