import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from '@/redux/store.ts';
import { detectDevTools } from './utils/devtools-bypass.ts';

detectDevTools();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* redux */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
