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
      const { data } = await BaseRequest.Get(
        `/${SUB_URL}/campaign/${campaignId}?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
      return data;
    }
  });
};

export interface ICreateTrafficPayload {
  deviceType: string;
  orderId: string;
  browser: string;
  referrerURL: string;
  timestamp: Date;
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

export const useGetTrafficForAdvertiser = (
  pageIndex: number = 1,
  pageSize: number = 10,
  keyword: string = ''
) => {
  return useQuery({
    queryKey: ['get-traffics-advertiser', pageIndex, pageSize, keyword],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/${SUB_URL}/advertiser?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyword}`
      );
    }
  });
};

export function useGetPublisherTraffic(pageIndex = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['publisher-traffic', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/api/Traffics/publisher?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
}
