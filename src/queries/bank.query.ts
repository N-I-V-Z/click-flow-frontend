import { useQuery } from '@tanstack/react-query';

export interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string | null;
}

export interface BankApiResponse {
  code: string;
  desc: string;
  data: Bank[];
}

// Fetch banks from VietQR API
const fetchBanks = async (): Promise<BankApiResponse> => {
  const response = await fetch('https://api.vietqr.io/v2/banks');
  if (!response.ok) {
    throw new Error('Failed to fetch banks');
  }
  return response.json();
};

export const useGetBanks = () => {
  return useQuery({
    queryKey: ['banks'],
    queryFn: fetchBanks,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - bank list doesn't change often
    gcTime: 24 * 60 * 60 * 1000 // React Query v5 uses gcTime instead of cacheTime
  });
};
