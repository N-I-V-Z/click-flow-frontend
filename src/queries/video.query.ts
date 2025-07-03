import BaseRequest from '@/config/axios.config';
import { ApiResponse, VideoCourseResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = `/api/Videos`;

export const useGetVideoCourses = (courseId?: number) => {
  return useQuery({
    queryKey: ['get-courses'],
    queryFn: async () => {
      return await BaseRequest.Get<ApiResponse<VideoCourseResponse>>(
        `${SUB_URL}/course/${courseId}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};
