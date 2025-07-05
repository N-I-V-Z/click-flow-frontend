import BaseRequest from '@/config/axios.config';
import {
  BaseResponse,
  CommentApiResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
  CommentListResponse
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const SUB_URL = `/api/Comments`;

/**
 * Hook gọi API lấy danh sách comments theo post ID
 */
export const useGetCommentsByPostId = (
  postId: number,
  pageIndex: number = 1,
  pageSize: number = 100
) => {
  return useQuery({
    queryKey: ['get-comments-by-post-id', postId, pageIndex, pageSize],
    enabled: !!postId,
    queryFn: async () => {
      const response = await BaseRequest.Get<CommentListResponse>(
        `${SUB_URL}/get-comment-by-post-id/${postId}/${pageIndex}/${pageSize}`
      );

      return response;
    },
    staleTime: 1000 * 60 * 2, // Cache 2 minutes
    retry: 3
  });
};

/**
 * Hook gọi API lấy comment theo ID
 */
export const useGetCommentById = (id?: number) => {
  return useQuery({
    queryKey: ['get-comment-by-id', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return await BaseRequest.Get<CommentApiResponse>(
        `${SUB_URL}/get-comment-by-id/${id}`
      );
    },
    staleTime: 1000 * 60 * 5,
    retry: 3
  });
};

/**
 * Hook tạo comment mới
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-comment'],
    mutationFn: async (model: CreateCommentPayload) => {
      return await BaseRequest.Post<CommentApiResponse>(
        `${SUB_URL}/create-comment`,
        model
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate comments list cho post đó
      queryClient.invalidateQueries({
        queryKey: ['get-comments-by-post-id', variables.postId]
      });
    }
  });
};

/**
 * Hook tạo reply (comment con)
 */
export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-reply'],
    mutationFn: async (model: CreateCommentPayload) => {
      return await BaseRequest.Post<CommentApiResponse>(
        `${SUB_URL}/create-reply`,
        model
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate comments list cho post đó
      queryClient.invalidateQueries({
        queryKey: ['get-comments-by-post-id', variables.postId]
      });
    }
  });
};

/**
 * Hook cập nhật comment
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-comment'],
    mutationFn: async (payload: { id: number; data: UpdateCommentPayload }) => {
      // Sửa lại: truyền id trong body, không truyền trên URL
      return await BaseRequest.Put<CommentApiResponse>(
        `${SUB_URL}/update-comment`,
        { id: payload.id, ...payload.data }
      );
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['get-comment-by-id', variables.id]
      });
      queryClient.invalidateQueries({
        queryKey: ['get-comments-by-post-id']
      });
    }
  });
};

/**
 * Hook xóa comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-comment'],
    mutationFn: async (id: number) => {
      return await BaseRequest.Delete<BaseResponse>(
        `${SUB_URL}/delete-comment/${id}`
      );
    },
    onSuccess: () => {
      // Invalidate all comments queries
      queryClient.invalidateQueries({
        queryKey: ['get-comments-by-post-id']
      });
    }
  });
};

/**
 * Hook like/unlike comment
 */
export const useToggleLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['toggle-like-comment'],
    mutationFn: async (commentId: number) => {
      return await BaseRequest.Post<BaseResponse>(
        `${SUB_URL}/toggle-like/${commentId}`,
        {}
      );
    },
    onSuccess: (data, variables) => {
      // Optimistically update cache hoặc invalidate
      queryClient.invalidateQueries({
        queryKey: ['get-comments-by-post-id']
      });
    }
  });
};
