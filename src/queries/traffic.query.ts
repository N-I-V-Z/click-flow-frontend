import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = 'api/Traffics/';

export const useGetTraffics = (
  campaignId = 1,
  PageIndex = 1,
  PageSize = 10
) => {
  return useQuery({
    // Gồm đầy đủ các tham số để React Query cache chính xác
    queryKey: ['get-traffics', campaignId, PageIndex, PageSize],
    queryFn: async () => {
      // Gửi request kèm các query params
      return await BaseRequest.Get(
        `/${SUB_URL}/campaign/${campaignId}?PageIndex=${PageIndex}&PageSize=${PageSize}`
      );
    }
  });
};
