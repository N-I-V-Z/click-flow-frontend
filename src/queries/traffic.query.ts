import BaseRequest from '@/config/axios.config';
import { useQuery, useMutation } from '@tanstack/react-query';

const SUB_URL = 'api/Traffics';

export const useGetTraffics = (
  campaignId = 1,
  pageIndex = 1,
  pageSize = 10
) => {
  return useQuery({
    queryKey: ['get-traffics', campaignId, pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/${SUB_URL}/campaign/${campaignId}?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
};

export interface ICreateTrafficPayload {
  ipAddress: string;
  deviceType: string;
  orderId: string;
  browser: string;
  referrerUrl: string; // Updated key name
  campaignId: number;
  publisherId: number;
}

export const useCreateTraffic = () => {
  return useMutation({
    mutationFn: async (payload: ICreateTrafficPayload) => {
      return await BaseRequest.Post(`/${SUB_URL}`, payload);
    }
  });
};
