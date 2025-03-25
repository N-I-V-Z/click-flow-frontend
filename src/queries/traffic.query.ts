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
  deviceType: string;
  orderId: string;
  browser: string;
  referrerURL: string;
  timestamp: string;
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
    // Thêm keyword vào queryKey để quản lý cache chính xác
    queryKey: ['get-traffics-advertiser', pageIndex, pageSize, keyword],
    queryFn: async () => {
      // Tuỳ backend định nghĩa query param tên gì, ví dụ: ?PageIndex=1&PageSize=10&Keyword=...
      return await BaseRequest.Get(
        `/${SUB_URL}/advertiser?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyword}`
      );
    }
  });
};
