import BaseRequest from '@/config/axios.config';
import { CreateTransactionAPI, PagingResponse, Transaction } from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';

const SUB_URL = `/api/Transactions`;

/**
 * Hook gọi API lấy danh sách transaction của user với filter
 */
export const useGetOwnTransaction = (
  pageIndex: number = 1,
  pageSize: number = 10,
  transactionType?: string
) => {
  return useQuery({
    queryKey: ['get-own-transaction', pageIndex, pageSize, transactionType],
    queryFn: async () => {
      let url = `${SUB_URL}/own?PageIndex=${pageIndex}&PageSize=${pageSize}`;
      if (transactionType) {
        url += `&TransactionType=${transactionType}`;
      }
      return await BaseRequest.Get<PagingResponse<Transaction>>(url);
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

/**
 * Hook gọi API lấy tất cả transactions với keyword search (dành cho admin)
 */
export const useGetAllTransactions = (
  pageIndex: number = 1,
  pageSize: number = 10,
  keyword?: string
) => {
  return useQuery({
    queryKey: ['get-all-transactions', pageIndex, pageSize, keyword],
    queryFn: async () => {
      let url = `${SUB_URL}?PageIndex=${pageIndex}&PageSize=${pageSize}`;
      if (keyword) {
        url += `&Keyword=${keyword}`;
      }
      return await BaseRequest.Get<PagingResponse<Transaction>>(url);
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

/**
 * Hook gọi API tạo transaction mới (Deposit/Withdraw)
 */
export const useCreateNewTransaction = () => {
  return useMutation({
    mutationKey: ['create-new-transaction'],
    mutationFn: async (model: { amount: number; transactionType: string }) => {
      return await BaseRequest.Post<Transaction>(`${SUB_URL}`, model);
    }
  });
};
