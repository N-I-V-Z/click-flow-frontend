import BaseRequest from '@/config/axios.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Type cho Wallet trả về
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
      return await BaseRequest.Get<WalletApiResult>('/api/Wallets/own');
    },
    staleTime: 1000 * 60 * 5,
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
      return await BaseRequest.Put(`/api/Wallets/${walletId}`, bankData);
    },
    onSuccess: () => {
      // Invalidate và refetch wallet data sau khi cập nhật thành công
      queryClient.invalidateQueries({ queryKey: ['get-own-wallet'] });
    }
  });
};
