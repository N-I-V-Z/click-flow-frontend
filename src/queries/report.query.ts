// report.query.ts
import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook gọi API lấy danh sách Reports
 * Endpoint: GET /api/Reports?pageIndex={pageIndex}&pageSize={pageSize}&keyword={keyword}
 *
 * @param pageIndex - Số trang (mặc định = 1)
 * @param pageSize  - Kích thước trang (mặc định = 10)
 * @param keyword   - Từ khoá lọc (mặc định = '')
 */
export const useGetReports = (
  pageIndex: number = 1,
  pageSize: number = 10,
  keyword: string = ''
) => {
  return useQuery({
    queryKey: ['get-reports', pageIndex, pageSize, keyword],
    queryFn: async () => {
      // Gọi API. Nếu keyword rỗng, backend có thể bỏ qua filter
      return await BaseRequest.Get(
        `/api/Reports?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyword}`
      );
    }
  });
};
