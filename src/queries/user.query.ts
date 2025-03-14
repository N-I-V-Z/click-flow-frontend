// user.query.ts
import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook gọi API lấy danh sách user theo role
 * Endpoint: GET /api/Users/by-role/{role}/{pageIndex}/{pageSize}
 *
 * @param role      - Vai trò (Admin, Advertiser, Publisher, ...)
 * @param pageIndex - Số trang (mặc định = 1)
 * @param pageSize  - Kích thước trang (mặc định = 10)
 */
export const useGetUsersByRole = (
  role: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['users-by-role', role, pageIndex, pageSize],
    queryFn: async () => {
      // Gọi API: /api/Users/by-role/{role}/{pageIndex}/{pageSize}
      return await BaseRequest.Get(
        `/api/Users/by-role/${role}/${pageIndex}/${pageSize}`
      );
    }
  });
};
