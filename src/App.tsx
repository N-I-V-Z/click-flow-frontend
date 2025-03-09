import ScrollToTop from './hooks/scroll-to-top';
import AppProvider from './providers';
import AppRouter from '@/routes/AppRouter';

export default function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <AppRouter />
    </AppProvider>
  );
}
