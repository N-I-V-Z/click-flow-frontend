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
    enabled: !!campaignId && campaignId > 0,
    queryFn: async (): Promise<IFeedback[]> => {
      try {
        const url = `${SUB_URL}/get-feedbacks-by-campaign/${campaignId}/${pageIndex}/${pageSize}`;

        const response: ApiResponse<{
          pageIndex: number;
          totalPages: number;
          totalItems: number;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
          datas: IFeedback[];
        }> = await BaseRequest.Get(url);

        if (!response.isSuccess) {
          throw new Error(response.message || 'Error fetching feedbacks');
        }

        // Extract feedbacks from pagination response
        const feedbacks = response.result?.datas || [];

        if (!Array.isArray(feedbacks)) {
          return [];
        }

        return feedbacks;
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
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
        `${SUB_URL}/update-feedback`,
        payload
      );
      return response;
    }
  });
};
export const useCheckUserFeedback = (campaignId: number) => {
  return useQuery<boolean>({
    queryKey: ['check-user-feedback', campaignId],
    enabled: !!campaignId,
    queryFn: async (): Promise<boolean> => {
      const response: ApiResponse<boolean> = await BaseRequest.Get(
        `${SUB_URL}/check-feedback/${campaignId}`
      );

      if (!response.isSuccess) {
        throw new Error(response.message || 'Error checking feedback status');
      }

      return response.result ?? false;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    retry: 2
  });
};
