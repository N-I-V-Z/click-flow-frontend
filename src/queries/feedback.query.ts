import { useQuery, useMutation } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';
import { IFeedback, IFeedbackAPIResponse } from '@/types/index';

/**
 * Hook gọi API lấy danh sách Feedback của 1 campaign
 * Endpoint: GET /api/feedbacks/get-feedbacks-by-campaign/{campaignId}/{pageIndex}/{pageSize}
 */
export const useGetFeedbacksByCampaign = (
  campaignId: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery<IFeedback[]>({
    queryKey: ['get-feedbacks-by-campaign', campaignId, pageIndex, pageSize],
    // Chỉ gọi API khi campaignId có giá trị
    enabled: !!campaignId,
    queryFn: async () => {
      const response: IFeedbackAPIResponse = await BaseRequest.Get(
        `/api/feedbacks/get-feedbacks-by-campaign/${campaignId}/${pageIndex}/${pageSize}`
      );

      if (!response.isSuccess) {
        throw new Error(response.message || 'Error fetching feedbacks');
      }
      return response.result;
    }
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
        '/api/Feedbacks/create-feedback',
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
