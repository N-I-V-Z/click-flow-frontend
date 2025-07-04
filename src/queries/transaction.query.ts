import BaseRequest from '@/config/axios.config';
import { CreateTransactionAPI, PagingResponse, Transaction } from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';

const SUB_URL = `/api/Transactions`;

/**
 * Hook gọi API lấy danh sách Courses
 */
export const useGetOwnTransaction = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-own-transaction', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<Transaction>>(
        `${SUB_URL}/own?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationKey: ['crete-transaction'],
    mutationFn: async (model: CreateTransactionAPI) => {
      return await BaseRequest.Post<string>(
        `${SUB_URL}/payos/create-payment-link`,
        model
      );
    }
  });
};
