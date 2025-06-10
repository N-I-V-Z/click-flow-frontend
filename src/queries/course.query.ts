import BaseRequest from '@/config/axios.config';
import { Course, CreateCourseFormData, PagingResponse } from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';

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
  pageSize: number = 10,
  keyWord?: string
) => {
  return useQuery({
    queryKey: ['get-courses', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<Course>>(
        `${SUB_URL}/admin?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyWord}`
      );
    }
  });
};

export const useCreateCourse = () => {
  return useMutation({
    mutationKey: ['create-course'],
    mutationFn: async (payload: CreateCourseFormData) => {
      return await BaseRequest.Post<CreateCourseFormData>(
        `/${SUB_URL}`,
        payload
      );
    }
  });
};
