import BaseRequest from '@/config/axios.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Type cho Wallet trả về

const SUB_URL = `/api/Wallets`;

export interface WalletApiResult {
  id: number;
  balance: number;
  userId: number;
  bankCode?: string;
  bankName?: string;
}

// Type cho request cập nhật thông tin ngân hàng
export interface UpdateBankInfoRequest {
  bankCode: string;
  bankName: string;
}

export const useGetOwnWallet = () => {
  return useQuery({
    queryKey: ['get-own-wallet'],
    queryFn: async () => {
      return await BaseRequest.Get<WalletApiResult>(`${SUB_URL}/own`);
    },
    staleTime: 1000 * 60 * 2, // Giảm staleTime để refresh thường xuyên hơn
    refetchOnWindowFocus: true, // Tự động refetch khi window focus
    refetchOnMount: true, // Tự động refetch khi component mount
    retry: 3
  });
};

export const useUpdateBankInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      walletId,
      bankData
    }: {
      walletId: number;
      bankData: UpdateBankInfoRequest;
    }) => {
      return await BaseRequest.Put(`${SUB_URL}/${walletId}`, bankData);
    },
    onSuccess: () => {
      // Invalidate và refetch wallet data sau khi cập nhật thành công
      queryClient.invalidateQueries({ queryKey: ['get-own-wallet'] });
    }
  });
};
