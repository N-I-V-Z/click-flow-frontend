import BaseRequest from '@/config/axios.config';
import {
  ClickResponse,
  ICreateTrafficPayload,
  PagingResponse,
  TrafficApiResponse
} from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';

const SUB_URL = '/api/Traffics';

export const useGetTraffics = (
  campaignId = 1,
  pageIndex = 1,
  pageSize = 10
) => {
  return useQuery({
    queryKey: ['get-traffics', campaignId, pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<TrafficApiResponse>>(
        `${SUB_URL}/campaign/${campaignId}?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useCreateTraffic = () => {
  return useMutation({
    mutationFn: async (payload: ICreateTrafficPayload) => {
      return await BaseRequest.Post<ClickResponse>(`${SUB_URL}`, payload);
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
      return await BaseRequest.Get<PagingResponse<TrafficApiResponse>>(
        `${SUB_URL}/advertiser?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyword}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export function useGetPublisherTraffic(
  pageIndex = 1,
  pageSize = 10,
  campaignId?: number
) {
  return useQuery({
    queryKey: ['publisher-traffic', pageIndex, pageSize, campaignId],
    queryFn: async () => {
      const campaignParam = campaignId ? `&CampaignId=${campaignId}` : '';
      return await BaseRequest.Get<PagingResponse<TrafficApiResponse>>(
        `/api/Traffics/publisher?PageIndex=${pageIndex}&PageSize=${pageSize}${campaignParam}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
}
