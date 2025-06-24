import BaseRequest from '@/config/axios.config';
import {
  BaseResponse,
  ForumPost,
  ForumApiResponse,
  CreateForumPostPayload
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

const SUB_URL = `api/Posts`;

/**
 * Hook gọi API lấy danh sách Posts
 */
export const useGetAllPosts = (
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-all-posts', pageIndex, pageSize],
    queryFn: async () => {
      const response = await BaseRequest.Get<ForumApiResponse>(
        `${SUB_URL}/get-all-posts/${pageIndex}/${pageSize}`
      );
      console.log('API Response:', response); // Debug log
      return response;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

/**
 * Hook gọi API lấy bài viết theo ID
 */
export const useGetPostById = (id?: number) => {
  return useQuery({
    queryKey: ['get-post-by-id', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return await BaseRequest.Get<ForumPost>(
        `${SUB_URL}/get-post-by-id/${id}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

/**
 * Hook gọi API lấy bài viết theo topic
 */
export const useGetPostsByTopic = (
  topic: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['get-posts-by-topic', topic, pageIndex, pageSize],
    enabled: !!topic,
    queryFn: async () => {
      return await BaseRequest.Get<ForumApiResponse>(
        `${SUB_URL}/get-posts-by-topic/${topic}/${pageIndex}/${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

/**
 * Hook gọi API tìm kiếm bài viết
 */
export const useSearchPosts = (
  searchTerm: string,
  pageIndex: number = 1,
  pageSize: number = 10
) => {
  return useQuery({
    queryKey: ['search-posts', searchTerm, pageIndex, pageSize],
    enabled: !!searchTerm && searchTerm.trim().length > 0,
    queryFn: async () => {
      return await BaseRequest.Get<ForumApiResponse>(
        `${SUB_URL}/search-posts?searchTerm=${encodeURIComponent(searchTerm)}&pageIndex=${pageIndex}&pageSize=${pageSize}`
      );
    },
    staleTime: 1000 * 60 * 2, // Tìm kiếm có thể cần cập nhật thường xuyên hơn
    retry: 3
  });
};

/**
 * Hook tạo bài viết mới
 */
export const useCreatePost = () => {
  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: async (model: CreateForumPostPayload) => {
      return await BaseRequest.Post<ForumPost>(`${SUB_URL}/create-post`, model);
    }
  });
};

/**
 * Hook cập nhật bài viết
 */
export const useUpdatePost = () => {
  return useMutation({
    mutationKey: ['update-post'],
    mutationFn: async (payload: {
      id: number;
      data: Partial<CreateForumPostPayload>;
    }) => {
      return await BaseRequest.Put<ForumPost>(
        `${SUB_URL}/update-post/${payload.id}`,
        payload.data
      );
    }
  });
};

/**
 * Hook xóa bài viết
 */
export const useDeletePost = () => {
  return useMutation({
    mutationKey: ['delete-post'],
    mutationFn: async (id: number) => {
      return await BaseRequest.Delete<BaseResponse>(
        `${SUB_URL}/delete-post/${id}`
      );
    }
  });
};

/**
 * Hook tăng view cho bài viết
 */
export const useIncrementPostView = () => {
  return useMutation({
    mutationKey: ['increment-post-view'],
    mutationFn: async (id: number) => {
      return await BaseRequest.Post<BaseResponse>(
        `${SUB_URL}/increment-view/${id}`,
        {}
      );
    }
  });
};
