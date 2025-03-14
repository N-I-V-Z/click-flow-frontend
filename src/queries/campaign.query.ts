import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

/**
 * Hook gọi API lấy danh sách Campaigns theo status
 */
export const useGetCampaign = (
  status: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-campaign', status, pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/api/campaigns/get-campaigns-by-status/${status}/${pageIndex}/${pageSize}`
      );
    }
  });
};

// Hook cập nhật trạng thái campaign (ví dụ PUT /api/campaigns/update-campaign-status)
export const useUpdateCampaignStatus = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; status: string }) => {
      return await BaseRequest.Put(
        '/api/campaigns/update-campaign-status',
        payload
      );
    }
  });
};

/**
 * Hook gọi API lấy thông tin chi tiết 1 campaign theo id
 * Endpoint: GET /api/campaigns/get-campaign-by-id/{id}
 *
 * @param id - ID của campaign
 */
export const useGetCampaignById = (id?: number) => {
  return useQuery({
    // Mỗi campaign ID sẽ có cache riêng
    queryKey: ['get-campaign-by-id', id],
    // Nếu id chưa xác định (undefined hoặc 0), có thể skip query
    enabled: !!id,
    queryFn: async () => {
      // Nếu id là falsy, trả về null hoặc bạn có thể throw error
      if (!id) return null;

      // Gọi API lấy campaign theo ID
      return await BaseRequest.Get(`/api/campaigns/get-campaign-by-id/${id}`);
    }
  });
};

export const useGetCampaignAdvertiser = (
  status: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    // queryKey giúp React Query xác định khi nào cần refetch
    queryKey: ['get-campaign-advertiser', status, pageIndex, pageSize],
    queryFn: async () => {
      // Gọi API đến endpoint với 3 tham số động: status, pageIndex, pageSize
      return await BaseRequest.Get(
        `/api/Campaigns/get-campaigns-by-advertiser/${status}/${pageIndex}/${pageSize}`
      );
    }
  });
};

export const useCreateCampaign = () => {
  return useMutation({
    mutationKey: ['create-campaign'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/api/Campaigns/create-campaign`, model);
    }
  });
};
