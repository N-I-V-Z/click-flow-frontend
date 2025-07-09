/**
 * Cấu hình để giảm thiểu requests spam và tối ưu performance
 */

export const REQUEST_CONFIG = {
  // Tắt các dev tools polling trong production
  DISABLE_DEV_TOOLS_IN_PROD: true,

  // Giảm frequency của HMR
  HMR_THROTTLE: 1000, // 1 giây

  // Chỉ log requests quan trọng
  LOG_ONLY_API_REQUESTS: true,

  // Timeout cho requests
  DEFAULT_TIMEOUT: 10000, // 10 giây
  UPLOAD_TIMEOUT: 30000, // 30 giây

  // Retry config
  MAX_RETRIES: 1,
  RETRY_DELAY: 2000,

  // Cache config
  QUERY_STALE_TIME: 5 * 60 * 1000, // 5 phút

  // Ignored request patterns để không log
  IGNORED_PATTERNS: [
    'hot-update',
    'favicon',
    '__vite_ping',
    '/@vite',
    '/src/',
    '/node_modules/',
    '.js',
    '.css',
    '.map',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    'ws:',
    'sockjs',
    'webpack',
    'livereload'
  ]
};

/**
 * Kiểm tra xem có phải request spam không
 */
export const isSpamRequest = (url: string): boolean => {
  if (!url) return false;

  return REQUEST_CONFIG.IGNORED_PATTERNS.some((pattern) =>
    url.toLowerCase().includes(pattern.toLowerCase())
  );
};

/**
 * Tối ưu React Query config để giảm requests
 */
export const getOptimizedQueryConfig = () => ({
  defaultOptions: {
    queries: {
      staleTime: REQUEST_CONFIG.QUERY_STALE_TIME,
      retry: (failureCount: number, error: any) => {
        // Tắt retry cho network errors để tránh spam requests
        if (
          error.message?.includes('Network Error') ||
          error.message?.includes('timeout')
        ) {
          return false;
        }
        // Chỉ retry tối đa 1 lần cho các lỗi khác
        return failureCount < REQUEST_CONFIG.MAX_RETRIES;
      },
      retryDelay: REQUEST_CONFIG.RETRY_DELAY,
      refetchOnWindowFocus: false, // Tắt refetch khi focus window
      refetchOnMount: true,
      refetchOnReconnect: true,
      // Thêm error boundary để tránh crash
      throwOnError: false
    },
    mutations: {
      retry: false, // Tắt retry cho mutations
      throwOnError: false
    }
  }
});

export default REQUEST_CONFIG;
