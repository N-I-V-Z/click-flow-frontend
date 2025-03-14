import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook gọi API lấy danh sách Campaigns theo status
 * Endpoint: GET /api/campaigns/get-campaigns-by-status/{status}/{pageIndex}/{pageSize}
 *
 * @param status     - Trạng thái chiến dịch (Approved, Pending, Activing, Paused, Canceled, Completed, v.v.)
 * @param pageIndex  - Số trang (mặc định = 1)
 * @param pageSize   - Kích thước trang (mặc định = 10)
 */
export const useGetCampaign = (
  status: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    // queryKey giúp React Query xác định khi nào cần refetch
    queryKey: ['get-campaign', status, pageIndex, pageSize],
    queryFn: async () => {
      // Gọi API đến endpoint với 3 tham số động: status, pageIndex, pageSize
      return await BaseRequest.Get(
        `/api/campaigns/get-campaigns-by-status/${status}/${pageIndex}/${pageSize}`
      );
    }
    // Các tùy chọn khác (vd: enabled, staleTime, refetchOnWindowFocus, ...)
  });
};
