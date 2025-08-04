import BaseRequest from '@/config/axios.config';
import { CreateTransactionAPI, PagingResponse, Transaction } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    staleTime: 1000 * 60 * 2, // Giảm staleTime để refresh thường xuyên hơn
    refetchOnWindowFocus: true, // Tự động refetch khi window focus
    refetchOnMount: true, // Tự động refetch khi component mount
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
 * Hook gọi API lấy tất cả transactions (dành cho admin)
 */
export const useGetAllTransactions = (
  pageIndex: number = 1,
  pageSize: number = 10,
  keyword?: string,
  status?: boolean,
  transactionType?: string
) => {
  return useQuery({
    queryKey: [
      'get-all-transactions',
      pageIndex,
      pageSize,
      keyword,
      status,
      transactionType
    ],
    queryFn: async () => {
      let url = `${SUB_URL}?PageIndex=${pageIndex}&PageSize=${pageSize}`;
      if (keyword) {
        url += `&Keyword=${keyword}`;
      }
      if (status !== undefined) {
        url += `&Status=${status}`;
      }
      if (transactionType) {
        url += `&TransactionType=${transactionType}`;
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-new-transaction'],
    mutationFn: async (model: { amount: number; transactionType: string }) => {
      return await BaseRequest.Post<Transaction>(`${SUB_URL}`, model);
    },
    onSuccess: () => {
      // Invalidate wallet data sau khi tạo transaction thành công
      queryClient.invalidateQueries({ queryKey: ['get-own-wallet'] });
      // Invalidate transaction data để cập nhật lịch sử giao dịch
      queryClient.invalidateQueries({ queryKey: ['get-own-transaction'] });
    }
  });
};

/**
 * Hook gọi API cập nhật trạng thái giao dịch (dành cho admin)
 */
export const useUpdateTransactionStatus = () => {
  return useMutation({
    mutationKey: ['update-transaction-status'],
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      return await BaseRequest.Put<Transaction>(`${SUB_URL}/${id}/status`, {
        status
      });
    }
  });
};
