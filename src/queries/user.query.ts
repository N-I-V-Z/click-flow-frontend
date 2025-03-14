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
export const useGetUsersByRole = (
  role: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['users-by-role', role, pageIndex, pageSize],
    queryFn: async () => {
      // Gọi API: /api/Users/by-role/{role}/{pageIndex}/{pageSize}
      return await BaseRequest.Get(
        `/api/Users/by-role/${role}/${pageIndex}/${pageSize}`
      );
    }
  });
};
