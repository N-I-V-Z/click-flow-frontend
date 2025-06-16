import BaseRequest from '@/config/axios.config';
import {
  ApplicationUserApiResponse,
  PagingResponse,
  UserDetailApiResponse
} from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const SUB_USER_DETAIL_URL = '/api/UserDetails';
const SUB_USER_URL = '/api/Users';
const SUB_ACCOUNT_URL = '/api/Accounts';

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
    staleTime: 1000 * 60 * 5,
    retry: 3,
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
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      isBlocked
    }: {
      userId: number;
      isBlocked: boolean;
    }) => {
      return await BaseRequest.Post(
        `${SUB_ACCOUNT_URL}/update-user-status/${userId}/${isBlocked}`,
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-by-role'] });
    },
    onError: (error) => {
      console.error('Error updating user status:', error);
    }
  });
};
