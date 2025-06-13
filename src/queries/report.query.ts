import BaseRequest from '@/config/axios.config';
import { PagingResponse, ReportApiResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = '/api/Reports';

export const useGetReports = (
  pageIndex: number = 1,
  pageSize: number = 10,
  keyword: string = ''
) => {
  return useQuery({
    queryKey: ['get-reports', pageIndex, pageSize, keyword],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<ReportApiResponse>>(
        `${SUB_URL}?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyword}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
