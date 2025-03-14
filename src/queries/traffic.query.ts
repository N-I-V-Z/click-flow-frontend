import BaseRequest from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Traffics`;
export const useGetTraffics = (pageIndex = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['get-traffics', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/${SUB_URL}?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
};
