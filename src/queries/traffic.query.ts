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
      // Chú ý: BaseRequest.Get(...) thường trả về AxiosResponse,
      // ta cần destructuring lấy data
      const { data } = await BaseRequest.Get(
        `/${SUB_URL}/campaign/${campaignId}?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
      return data; // data mới là payload JSON trả về
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
      const { data } = await BaseRequest.Post(`/${SUB_URL}`, payload);
      return data;
    }
  });
};

/**
 * Hook lấy danh sách traffic của publisher
 * @param pageIndex Số trang
 * @param pageSize Kích thước trang
 * @param keyword Từ khóa tìm kiếm
 */
export function useGetPublisherTraffic(pageIndex = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['publisher-traffic', pageIndex, pageSize],
    queryFn: async () => {
      // Gọi axios
      return await BaseRequest.Get(
        `/api/Traffics/publisher?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
      // data ở đây chính là payload JSON
    }
  });
}
