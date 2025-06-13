import { useQuery, useMutation } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';
import { IFeedback, ApiResponse } from '@/types/index';

const SUB_URL = '/api/Feedbacks';

export const useGetFeedbacksByCampaign = (
  campaignId: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery<IFeedback[]>({
    queryKey: ['get-feedbacks-by-campaign', campaignId, pageIndex, pageSize],
    enabled: !!campaignId,
    queryFn: async (): Promise<IFeedback[]> => {
      const response: ApiResponse<IFeedback[]> = await BaseRequest.Get(
        `${SUB_URL}/get-feedbacks-by-campaign/${campaignId}/${pageIndex}/${pageSize}`
      );

      if (!response.isSuccess) {
        throw new Error(response.message || 'Error fetching feedbacks');
      }

      // Đảm bảo return type chính xác
      return response.result ?? [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: async (payload: {
      campaignId: number;
      description: string;
      starRate: number;
    }) => {
      // Thay đổi endpoint hoặc payload tùy backend
      const response = await BaseRequest.Post(
        `${SUB_URL}/create-feedback`,
        payload
      );
      return response;
    }
  });
};
export const useUpdateFeedback = () => {
  return useMutation({
    mutationFn: async (payload: {
      id: number;
      description: string;
      starRate: number;
    }) => {
      // Gọi PUT /api/feedbacks/update-feedback với payload
      const response = await BaseRequest.Put(
        '/api/feedbacks/update-feedback',
        payload
      );
      return response;
    }
  });
};
