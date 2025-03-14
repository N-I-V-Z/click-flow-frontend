import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = 'api/Traffics/campaign';

export const useGetTraffics = (
  campaignId = 1,
  pageIndex = 1,
  pageSize = 10
) => {
  return useQuery({
    // Gồm đầy đủ các tham số để React Query cache chính xác
    queryKey: ['get-traffics', campaignId, pageIndex, pageSize],
    queryFn: async () => {
      // Gửi request kèm các query params
      return await BaseRequest.Get(
        `/${SUB_URL}?campaignId=${campaignId}&PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
};
