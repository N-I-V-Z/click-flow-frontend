import BaseRequest from '@/config/axios.config';
import {
  ApplicationUserApiResponse,
  PagingResponse,
  UserDetailApiResponse
} from '@/types';
import { useQuery } from '@tanstack/react-query';

const SUB_USER_DETAIL_URL = '/api/UserDetails';
const SUB_USER_URL = '/api/Users';

export const useGetUserDetail = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['get-user-detail', userId],
    queryFn: async () => {
      if (!userId || isNaN(userId)) {
        throw new Error('Valid User ID is required');
      }
      return await BaseRequest.Get<UserDetailApiResponse>(
        `${SUB_USER_DETAIL_URL}/get-user-detail?userId=${userId}`
      );
    },
    enabled: !!userId && !isNaN(userId), // Chỉ chạy khi có userId hợp lệ
    retry: 1,
    refetchOnWindowFocus: false
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
      return await BaseRequest.Get<PagingResponse<ApplicationUserApiResponse>>(
        `${SUB_USER_URL}/by-role/${role}/${pageIndex}/${pageSize}`
      );
    }
  });
};
