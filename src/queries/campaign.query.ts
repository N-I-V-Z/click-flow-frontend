import BaseRequest from '@/config/axios.config';
import {
  BaseResponse,
  CampaignApiResponse,
  CampaignParticipationApiResponse,
  PagingResponse,
  UploadImageResponse,
  CreateCampaignPayload,
  PublisherInCampaignApiResponse
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `/api/Campaigns`;
const SUB_URL_IMAGE = `/api/Upload`;
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
      return await BaseRequest.Get<PagingResponse<CampaignApiResponse>>(
        `${SUB_URL}/get-campaigns-by-status/${status}/${pageIndex}/${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useUpdateCampaignStatus = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; status: string }) => {
      return await BaseRequest.Put<BaseResponse>(
        `${SUB_URL}/update-campaign-status`,
        payload
      );
    }
  });
};

export const useGetCampaignById = (id?: number) => {
  return useQuery({
    queryKey: ['get-campaign-by-id', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return await BaseRequest.Get<CampaignApiResponse>(
        `${SUB_URL}/get-campaign-by-id/${id}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetCampaignAdvertiser = (
  advertiserId: number,
  status?: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: [
      'get-campaign-advertiser',
      advertiserId,
      status,
      pageIndex,
      pageSize
    ],
    queryFn: async () => {
      let url = `${SUB_URL}/get-campaigns-by-advertiser/${advertiserId}/${pageIndex}/${pageSize}`;
      if (status) {
        url += `?status=${status}`;
      }
      return await BaseRequest.Get<PagingResponse<CampaignApiResponse>>(url);
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetCampaignPublisher = (
  publisherId?: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-campaigns-publisher', publisherId, pageIndex, pageSize],
    enabled: !!publisherId,
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<CampaignApiResponse>>(
        `${SUB_URL}/get-campaigns-joined-by-publisher/${publisherId}/${pageIndex}/${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useCreateCampaign = () => {
  return useMutation({
    mutationKey: ['create-campaign'],
    mutationFn: async (model: CreateCampaignPayload) => {
      return await BaseRequest.Post<CampaignApiResponse>(
        `${SUB_URL}/create-campaign`,
        model
      );
    }
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationKey: ['upload-image'],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('File', file);
      return await BaseRequest.Post<UploadImageResponse>(
        `${SUB_URL_IMAGE}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    }
  });
};

export const useGetCampaignsJoinedByPublisher = (
  publisherId: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: [
      'get-campaigns-joined-by-publisher',
      publisherId,
      pageIndex,
      pageSize
    ],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<CampaignApiResponse>>(
        `${SUB_URL}/get-campaigns-joined-by-publisher/${publisherId}/${pageIndex}/${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
export const useGetCampaignListExcpPending = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-campaigns-except-from-pending', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<CampaignApiResponse>>(
        `${SUB_URL}/get-campaigns-except-from-pending/${pageIndex}/${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3, // Data sẽ được coi là stale ngay lập tức
    refetchOnMount: true // Luôn refetch khi component mount
    // Bỏ keepPreviousData vì không có trong React Query v5
  });
};
export const useGetAllCampaignForPublisher = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-all-campaign-for-publisher/', pageIndex, pageSize],
    queryFn: async () => {
      const response = await BaseRequest.Get<
        PagingResponse<CampaignApiResponse>
      >(`${SUB_URL}/get-all-campaign-for-publisher/${pageIndex}/${pageSize}`);
      return response;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetSimilarCampaigns = (
  campaignId?: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-similar-campaigns', campaignId, pageIndex, pageSize],
    enabled: !!campaignId,
    queryFn: async () => {
      const response = await BaseRequest.Get<
        PagingResponse<CampaignApiResponse>
      >(
        `${SUB_URL}/get-similar-campaigns/${campaignId}/${pageIndex}/${pageSize}`
      );
      return response;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
export interface IApiCampaign {
  id: number;
  name: string;
  description: string;
  originURL: string;
  budget: number;
  remainingBudget: number;
  startDate: string;
  endDate: string;
  typePay: string;
  typeCampaign: string;
  status: string;
  commission: number;
  percents?: number;
  image?: string;
  averageStarRate?: number;
  advertiserId: number;
  publisherStatus?: string;
  advertiser?: {
    id: number;
    companyName: string;
    introductionWebsite: string;
    staffSize: number;
    industry: string;
  };
}

/**
 * Hook gọi API lấy chi tiết 1 campaign theo ID.
 * GET /api/Campaigns/get-campaign-by-id/{id}
 */

export function useGetCampaignByIdd(id?: number) {
  return useQuery({
    queryKey: ['get-campaign-by-id-for-publisher', id],
    enabled: !!id,
    queryFn: async (): Promise<IApiCampaign> => {
      const response = await BaseRequest.Get(
        `${SUB_URL}/get-campaign-by-id-for-publisher/${id}`
      );
      return response.result as IApiCampaign;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
}
export const useRegisterCampaign = () => {
  return useMutation({
    mutationFn: async (payload: { campaignId: number }) => {
      return await BaseRequest.Post<BaseResponse>(
        `${SUB_URL}/register`,
        payload
      );
    }
  });
};

type CampaignCount = number;
export const useGetCampaignCountByAdvertiser = (
  advertiserId: number,
  status: string
) => {
  return useQuery<CampaignCount>({
    queryKey: ['campaign-count-by-advertiser', advertiserId, status],
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `${SUB_URL}/campaigns/count-by-advertiser/${advertiserId}?status=${status}`
      );
      return response.result as number;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: !!advertiserId && !!status
  });
};

export const useGetCampaignParticipationCountByStatusForAdvertiser = (
  status: 'Pending' | 'Participated' | 'Rejected'
) => {
  return useQuery<number>({
    queryKey: ['campaign-participations-count', status],
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `${SUB_URL}/campaign-participations/count-by-status-for-advertiser?campaignParticipationStatus=${status}`
      );
      return response.result as number;
    },
    enabled: !!status,
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetPublisherParticipationByStatusForAdvertiser = (
  pageIndex: number,
  pageSize: number,
  campaignParticipationStatus: 'Pending' | 'Participated' | 'Rejected'
) => {
  return useQuery({
    queryKey: [
      'get-publisher-participation-by-status-for-advertiser',
      pageIndex,
      pageSize,
      campaignParticipationStatus
    ],
    queryFn: async () => {
      return await BaseRequest.Get<
        PagingResponse<CampaignParticipationApiResponse>
      >(
        `${SUB_URL}/get-publisher-paticipation-by-status-for-advertiser/${pageIndex}/${pageSize}?campaignParticipationStatus=${campaignParticipationStatus}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useUpdateParticipationStatus = () => {
  return useMutation({
    mutationFn: async (payload: {
      publisherId: number;
      campaignParticipationId: number;
      newStatus: 'Pending' | 'Participated' | 'Rejected';
    }) => {
      const { publisherId, campaignParticipationId, newStatus } = payload;
      return await BaseRequest.Put(
        `${SUB_URL}/update-status/${publisherId}/${campaignParticipationId}/${newStatus}`,
        {}
      );
    }
  });
};

export const useGetCampaignDetail = (id?: number) => {
  return useQuery({
    queryKey: ['get-campaign-detail', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return await BaseRequest.Get<CampaignApiResponse>(
        `${SUB_URL}/get-campaign-by-id/${id}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetPublishersInCampaign = (
  campaignId?: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-publishers-in-campaign', campaignId, pageIndex, pageSize],
    enabled: !!campaignId,
    queryFn: async () => {
      if (!campaignId) return null;
      return await BaseRequest.Get<
        PagingResponse<PublisherInCampaignApiResponse>
      >(
        `${SUB_URL}/get-publishers-in-campaign/${campaignId}/${pageIndex}/${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetCampaignCountByStatus = (statuses: string) => {
  return useQuery({
    queryKey: ['get-campaign-count-by-status', statuses],
    queryFn: async () => {
      return await BaseRequest.Get<number>(
        `${SUB_URL}/campaigns/count-by-statuses?statuses=${statuses}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
