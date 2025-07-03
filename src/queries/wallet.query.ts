import BaseRequest from '@/config/axios.config';
import { useQuery } from '@tanstack/react-query';

// Type cho Wallet trả về
export interface WalletApiResult {
  id: number;
  balance: number;
  userId: number;
}

export const useGetOwnWallet = () => {
  return useQuery({
    queryKey: ['get-own-wallet'],
    queryFn: async () => {
      return await BaseRequest.Get<WalletApiResult>('api/Wallets/own');
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
