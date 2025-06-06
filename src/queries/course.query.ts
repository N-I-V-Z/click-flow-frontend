import BaseRequest from '@/config/axios.config';
import { Course, PagingResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Courses`;

/**
 * Hook gọi API lấy danh sách Courses
 */
export const useGetAllCourses = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-courses', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<Course>>(
        `${SUB_URL}/publisher?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
};

export const useGetCourseAdmin = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-courses', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<Course>>(
        `${SUB_URL}/admin?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    }
  });
};
