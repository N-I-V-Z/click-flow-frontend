import BaseRequest from '@/config/axios.config';
import { Wallet } from '@/types';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Wallets`;

export const useGetOwnWallet = () => {
  return useQuery({
    queryKey: ['get-own-wallet'],
    queryFn: async () => {
      return await BaseRequest.Get<Wallet>(`${SUB_URL}/own`);
    }
  });
};
