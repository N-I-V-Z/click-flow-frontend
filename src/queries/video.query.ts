import BaseRequest from '@/config/axios.config';
import {
  ApiResponse,
  VideoCourseResponse,
  CreateVideoPayload,
  CreateVideoResponse,
  UpdateVideoPayload
} from '@/types';
import { useQuery, useMutation } from '@tanstack/react-query';

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

export const useCreateVideo = () => {
  return useMutation({
    mutationKey: ['create-video'],
    mutationFn: async (payload: CreateVideoPayload) => {
      return await BaseRequest.Post<CreateVideoResponse>(`${SUB_URL}`, payload);
    }
  });
};

export const useUpdateVideo = () => {
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
    }
  });
};

export const useDeleteVideo = () => {
  return useMutation({
    mutationKey: ['delete-video'],
    mutationFn: async (videoId: number) => {
      return await BaseRequest.Delete(`${SUB_URL}/${videoId}`);
    }
  });
};
