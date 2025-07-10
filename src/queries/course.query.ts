import BaseRequest from '@/config/axios.config';
import {
  BaseResponse,
  CourseResponse,
  CreateCourseFormData,
  UpdateCourseFormData,
  PagingResponse,
  CourseJoinResponse
} from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SUB_URL = `/api/Courses`;

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
      return await BaseRequest.Get<PagingResponse<CourseResponse>>(
        `${SUB_URL}/publisher?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useGetAllCoursesJoin = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-courses-join', pageIndex, pageSize],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<CourseResponse>>(
        `${SUB_URL}/joined?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
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
      return await BaseRequest.Get<PagingResponse<CourseResponse>>(
        `${SUB_URL}/admin?PageIndex=${pageIndex}&PageSize=${pageSize}&Keyword=${keyWord}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useCreateCourse = () => {
  return useMutation({
    mutationKey: ['create-course'],
    mutationFn: async (payload: CreateCourseFormData) => {
      return await BaseRequest.Post<CreateCourseFormData>(
        `${SUB_URL}`,
        payload
      );
    }
  });
};

export const useUpdateCourse = () => {
  return useMutation({
    mutationKey: ['update-course'],
    mutationFn: async ({
      courseId,
      ...payload
    }: { courseId: number } & UpdateCourseFormData) => {
      return await BaseRequest.Put<UpdateCourseFormData>(
        `${SUB_URL}/${courseId}`,
        payload
      );
    }
  });
};

export const useJoinCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['join-course'],
    mutationFn: async (campaignId: number) => {
      return await BaseRequest.Post<CourseJoinResponse>(
        `${SUB_URL}/${campaignId}/join`
      );
    },
    onSuccess: () => {
      // Invalidate wallet data sau khi mua khóa học thành công
      queryClient.invalidateQueries({ queryKey: ['get-own-wallet'] });
      // Invalidate transaction data để cập nhật lịch sử giao dịch
      queryClient.invalidateQueries({ queryKey: ['get-own-transaction'] });
      // Invalidate course queries để cập nhật trạng thái khóa học
      queryClient.invalidateQueries({ queryKey: ['get-courses'] });
      queryClient.invalidateQueries({ queryKey: ['get-courses-join'] });
    }
  });
};

export const useGetVideoCheck = (courseId?: number) => {
  return useQuery({
    queryKey: ['get-courses-check'],
    queryFn: async () => {
      return await BaseRequest.Get<boolean>(`${SUB_URL}/${courseId}/check`);
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

export const useDeleteCourse = () => {
  return useMutation({
    mutationKey: ['delete-course'],
    mutationFn: async (courseId: number) => {
      return await BaseRequest.Delete<boolean>(`${SUB_URL}/${courseId}`);
    },
    onSuccess: () => {
      // Có thể thêm logic invalidate cache ở đây nếu cần
    }
  });
};

export const useCheckCourseRate = (courseId: number) => {
  return useQuery({
    queryKey: ['check-course-rate', courseId],
    queryFn: async () => {
      return await BaseRequest.Get<boolean>(
        `${SUB_URL}/${courseId}/rate/check`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled: !!courseId
  });
};

export const useRateCourse = () => {
  return useMutation({
    mutationKey: ['rate-course'],
    mutationFn: async ({
      courseId,
      rate
    }: {
      courseId: number;
      rate: number;
    }) => {
      return await BaseRequest.Post<BaseResponse>(
        `${SUB_URL}/${courseId}/rate`,
        { rate }
      );
    }
  });
};
