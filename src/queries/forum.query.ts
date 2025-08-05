import BaseRequest from '@/config/axios.config';
import {
  BaseResponse,
  ForumPost,
  ForumApiResponse,
  CreateForumPostPayload
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SUB_URL = `/api/Posts`;

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
 * Hook tìm kiếm bài viết với phân trang
 */
export const useSearchPosts = () => {
  return useMutation({
    mutationKey: ['search-posts'],
    mutationFn: async (payload: {
      keyword: string;
      topic?: string;
      authorId?: number;
      pageIndex: number;
      pageSize: number;
    }) => {
      return await BaseRequest.Post<ForumApiResponse>(
        `${SUB_URL}/search?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
        {
          keyword: payload.keyword,
          topic: payload.topic || 'QA',
          authorId: payload.authorId || 0
        }
      );
    }
  });
};

/**
 * Hook tạo bài viết mới
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-post'],
    mutationFn: async (model: CreateForumPostPayload) => {
      return await BaseRequest.Post<ForumPost>(`${SUB_URL}/create-post`, model);
    },
    onSuccess: () => {
      // Invalidate forum posts để refresh danh sách
      queryClient.invalidateQueries({
        queryKey: ['forum-posts']
      });
    }
  });
};

/**
 * Hook cập nhật bài viết
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-post'],
    mutationFn: async (payload: {
      id: number;
      title: string;
      content: string;
      topic: string;
    }) => {
      return await BaseRequest.Put<ForumPost>(`${SUB_URL}/update-post`, {
        id: payload.id,
        title: payload.title,
        content: payload.content,
        topic: payload.topic
      });
    },
    onSuccess: () => {
      // Invalidate forum posts để refresh danh sách
      queryClient.invalidateQueries({
        queryKey: ['forum-posts']
      });
    }
  });
};

/**
 * Hook xóa bài viết
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-post'],
    mutationFn: async (id: number) => {
      return await BaseRequest.Delete<BaseResponse>(
        `${SUB_URL}/delete-post/${id}`
      );
    },
    onSuccess: () => {
      // Invalidate forum posts để refresh danh sách
      queryClient.invalidateQueries({
        queryKey: ['forum-posts']
      });
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
