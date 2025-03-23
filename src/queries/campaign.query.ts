import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Campaigns`;
const SUB_URL_IMAGE = `api/Upload`;
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
      return await BaseRequest.Get(
        `${SUB_URL}/get-campaigns-by-status/${status}/${pageIndex}/${pageSize}`
      );
    }
  });
};

// Hook cập nhật trạng thái campaign (ví dụ PUT /api/campaigns/update-campaign-status)
export const useUpdateCampaignStatus = () => {
  return useMutation({
    mutationFn: async (payload: { id: number; status: string }) => {
      return await BaseRequest.Put(
        '/api/campaigns/update-campaign-status',
        payload
      );
    }
  });
};

/**
 * Hook gọi API lấy thông tin chi tiết 1 campaign theo id
 * Endpoint: GET /api/campaigns/get-campaign-by-id/{id}
 *
 * @param id - ID của campaign
 */
export const useGetCampaignById = (id?: number) => {
  return useQuery({
    // Mỗi campaign ID sẽ có cache riêng
    queryKey: ['get-campaign-by-id', id],
    // Nếu id chưa xác định (undefined hoặc 0), có thể skip query
    enabled: !!id,
    queryFn: async () => {
      // Nếu id là falsy, trả về null hoặc bạn có thể throw error
      if (!id) return null;

      // Gọi API lấy campaign theo ID
      return await BaseRequest.Get(`${SUB_URL}/get-campaign-by-id/${id}`);
    }
  });
};

export const useGetCampaignAdvertiser = (
  status: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-campaign-advertiser', status, pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `${SUB_URL}/get-campaigns-by-advertiser/${status}/${pageIndex}/${pageSize}`
      );
    }
  });
};

export const useGetCampaignPublisher = (
  publisherId: number = 1,
  pageIndex: number = 1,
  pageSize: number = 1
) => {
  return useQuery({
    queryKey: ['get-campaigns-publisher', publisherId, pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/${SUB_URL}/get-all-campaign-for-publisher/${publisherId}?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
};

export const useCreateCampaign = () => {
  return useMutation({
    mutationKey: ['create-campaign'],
    mutationFn: async (model: {
      name: string;
      description: string;
      originURL: string;
      budget: number;
      startDate: string;
      endDate: string;
      typePay: string;
      typeCampaign: string;
      commission: number;
      percents: number;
      image: string;
    }) => {
      return await BaseRequest.Post(`/${SUB_URL}/create-campaign`, model);
    }
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationKey: ['upload-image'],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('File', file);
      return await BaseRequest.Post(
        `/${SUB_URL_IMAGE}/upload-image`,
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
export const useGetPublisherParticipationByStatusForAdvertiser = (
  pageIndex: number,
  pageSize: number,
  campaignParticipationStatus: 'Pending' | 'Participated' | 'Rejected'
) => {
  return useQuery({
    // Tạo key để cache, tuỳ ý bạn đặt
    queryKey: [
      'get-publisher-participation-by-status-for-advertiser',
      pageIndex,
      pageSize,
      campaignParticipationStatus
    ],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/${SUB_URL}/get-publisher-paticipation-by-status-for-advertiser/${pageIndex}/${pageSize}?campaignParticipationStatus=${campaignParticipationStatus}`
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
      return await BaseRequest.Get(
        `${SUB_URL}/get-campaigns-joined-by-publisher/${publisherId}/${pageIndex}/${pageSize}`
      );
    }
  });
};
export const useGetCampaignListExcpPending = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-campaigns-except-from-pending', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `${SUB_URL}/get-campaigns-except-from-pending/${pageIndex}/${pageSize}`
      );
    }
  });
};
export const useGetAllCampaignForPublisher = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-all-campaign-for-publisher/', pageIndex, pageSize],
    queryFn: async () => {
      // Gọi API
      const response = await BaseRequest.Get(
        `${SUB_URL}/get-all-campaign-for-publisher/${pageIndex}/${pageSize}`
      );
      return response;
    }
  });
};

// Hook lấy danh sách chiến dịch tương tự
export const useGetSimilarCampaigns = (
  campaignId?: number,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-similar-campaigns', campaignId, pageIndex, pageSize],
    enabled: !!campaignId, // chỉ gọi nếu có campaignId
    queryFn: async () => {
      const response = await BaseRequest.Get(
        `/api/Campaigns/get-similar-campaigns/${campaignId}/${pageIndex}/${pageSize}`
      );
      return response;
    }
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
    queryKey: ['get-campaign-by-id', id],
    // Chỉ gọi nếu có id
    enabled: !!id,
    // Trả về dữ liệu gốc (IApiCampaign)
    queryFn: async (): Promise<IApiCampaign> => {
      const response = await BaseRequest.Get(
        `/api/Campaigns/get-campaign-by-id/${id}`
      );
      // Giả sử server trả về { result: { ... } }
      return response.result as IApiCampaign;
    }
  });
}
