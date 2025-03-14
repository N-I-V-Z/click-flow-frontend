import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

export const useGetUserDetail = (userId: number) => {
  return useQuery({
    queryKey: ['get-user-detail', userId],
    queryFn: async () => {
      return await BaseRequest.Get(
        `/api/UserDetails/get-user-detail?userId=${userId}`
      );
    }
  });
};
