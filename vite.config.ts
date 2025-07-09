import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    hmr: {
      // Giảm frequency của HMR để tránh spam requests
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'https://localhost:7087',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Tối ưu build để giảm file size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
});
