/**
 * Request Logger - Utility để debug và theo dõi các requests
 */

// Bỏ qua các requests này để tránh spam log
const IGNORED_REQUESTS = [
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
  'ws:', // WebSocket
  'sockjs' // WebSocket fallback
];

/**
 * Kiểm tra xem có nên log request này không
 */
export const shouldLogRequest = (url: string): boolean => {
  if (!url) return false;

  // Chỉ log trong development mode
  if (!import.meta.env.DEV) return false;

  // Kiểm tra xem URL có chứa các pattern bị ignore không
  return !IGNORED_REQUESTS.some((ignored) =>
    url.toLowerCase().includes(ignored.toLowerCase())
  );
};

/**
 * Log request với format đẹp
 */
export const logRequest = (
  method: string,
  url: string,
  type: 'API' | 'NETWORK' | 'FETCH' = 'API'
): void => {
  // Tắt tất cả log requests để tránh spam console
  return;
};

/**
 * Intercept và log tất cả fetch requests (không chỉ axios)
 */
export const initializeRequestLogger = (): void => {
  // Tắt request logger để tránh spam console
  return;
};

/**
 * Tắt request logger
 */
export const disableRequestLogger = (): void => {
  // Restore original functions nếu cần
  return;
};
