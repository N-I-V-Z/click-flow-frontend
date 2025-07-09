import { Suspense, lazy } from 'react';
import LoginRoute from './private/LoginRoute';

// Import Payment components
const PaymentSuccess = lazy(() => import('@/pages/Payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('@/pages/Payment/PaymentCancel'));

const paymentRoutes = [
  // Direct payment success route for payment gateway callbacks
  {
    path: '/payment-success',
    element: (
      <LoginRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentSuccess />
        </Suspense>
      </LoginRoute>
    )
  },
  // Direct payment cancel route for payment gateway callbacks
  {
    path: '/payment-cancel',
    element: (
      <LoginRoute>
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentCancel />
        </Suspense>
      </LoginRoute>
    )
  }
];

export default paymentRoutes;
