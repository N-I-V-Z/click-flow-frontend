import BaseRequest from '@/config/axios.config';
import {
  ApiResponse,
  VideoCourseResponse,
  CreateVideoPayload,
  CreateVideoResponse,
  UpdateVideoPayload
} from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SUB_URL = `/api/Videos`;

export const useGetVideoCourses = (courseId?: number) => {
  return useQuery({
    queryKey: ['get-video-courses', courseId],
    queryFn: async () => {
      return await BaseRequest.Get<ApiResponse<VideoCourseResponse>>(
        `${SUB_URL}/course/${courseId}`
      );
    },
    enabled: !!courseId, // Only run when courseId exists
    staleTime: 0, // Always fetch fresh data for course videos
    retry: 3
  });
};

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-video'],
    mutationFn: async (payload: CreateVideoPayload) => {
      return await BaseRequest.Post<CreateVideoResponse>(`${SUB_URL}`, payload);
    },
    onSuccess: () => {
      // Invalidate video queries để refresh danh sách video
      queryClient.invalidateQueries({
        queryKey: ['get-video-courses']
      });
    }
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-video'],
    mutationFn: async ({
      videoId,
      ...payload
    }: { videoId: number } & UpdateVideoPayload) => {
      return await BaseRequest.Put<UpdateVideoPayload>(
        `${SUB_URL}/${videoId}`,
        payload
      );
    },
    onSuccess: () => {
      // Invalidate video queries để refresh danh sách video
      queryClient.invalidateQueries({
        queryKey: ['get-video-courses']
      });
    }
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-video'],
    mutationFn: async (videoId: number) => {
      return await BaseRequest.Delete(`${SUB_URL}/${videoId}`);
    },
    onSuccess: () => {
      // Invalidate video queries để refresh danh sách video
      queryClient.invalidateQueries({
        queryKey: ['get-video-courses']
      });
    }
  });
};
