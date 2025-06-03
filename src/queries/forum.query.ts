// File: src/hooks/forum.query.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Post,
  Comment,
  CreatePostRequest,
  CreateCommentRequest,
  GetPostsRequest,
  UpdatePostRequest,
  UpdateCommentRequest,
  DeletePostRequest,
  DeleteCommentRequest,
  ToggleLikeRequest
} from '../types/forum.types';

// API endpoints (replace with your actual API base URL)
const API_BASE = '/api/forum';

// ============================================
// API Functions (to be implemented)
// ============================================

const forumAPI = {
  // Posts
  getPosts: async (
    params: GetPostsRequest = {}
  ): Promise<{ posts: Post[]; pagination: any }> => {
    // TODO: Implement API call
    // const response = await fetch(`${API_BASE}/posts?${new URLSearchParams(params)}`);
    // return response.json();
    throw new Error('API not implemented yet');
  },

  getPost: async (postId: string): Promise<Post> => {
    // TODO: Implement API call
    // const response = await fetch(`${API_BASE}/posts/${postId}`);
    // return response.json();
    throw new Error('API not implemented yet');
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    // TODO: Implement API call
    // const response = await fetch(`${API_BASE}/posts`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // return response.json();
    throw new Error('API not implemented yet');
  },

  updatePost: async ({ postId, ...data }: UpdatePostRequest): Promise<Post> => {
    // TODO: Implement API call
    throw new Error('API not implemented yet');
  },

  deletePost: async ({ postId }: DeletePostRequest): Promise<void> => {
    // TODO: Implement API call
    throw new Error('API not implemented yet');
  },

  // Comments
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    // TODO: Implement API call
    throw new Error('API not implemented yet');
  },

  updateComment: async ({
    commentId,
    ...data
  }: UpdateCommentRequest): Promise<Comment> => {
    // TODO: Implement API call
    throw new Error('API not implemented yet');
  },

  deleteComment: async ({ commentId }: DeleteCommentRequest): Promise<void> => {
    // TODO: Implement API call
    throw new Error('API not implemented yet');
  },

  // Likes
  toggleLike: async (
    data: ToggleLikeRequest
  ): Promise<{ likes: number; liked: boolean }> => {
    // TODO: Implement API call
    throw new Error('API not implemented yet');
  }
};

// ============================================
// React Query Hooks
// ============================================

// Query keys
export const forumKeys = {
  all: ['forum'] as const,
  posts: () => [...forumKeys.all, 'posts'] as const,
  post: (id: string) => [...forumKeys.all, 'post', id] as const,
  postComments: (id: string) =>
    [...forumKeys.all, 'post', id, 'comments'] as const
};

// Posts queries
export const usePostsQuery = (params: GetPostsRequest = {}) => {
  return useQuery({
    queryKey: [...forumKeys.posts(), params],
    queryFn: () => forumAPI.getPosts(params),
    staleTime: 30000, // 30 seconds
    enabled: true
  });
};

export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: forumKeys.post(postId),
    queryFn: () => forumAPI.getPost(postId),
    enabled: !!postId
  });
};

// Posts mutations
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    }
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.updatePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.post(data.id) });
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    }
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    }
  });
};

// Comments mutations
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: forumKeys.postComments(data.id)
      });
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    }
  });
};

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all });
    }
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all });
    }
  });
};

// Likes mutation
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forumAPI.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all });
    }
  });
};

// ============================================
// Usage Examples (for when API is ready)
// ============================================

/*
// In your Forum component:
const { data: postsData, isLoading, error } = usePostsQuery({
  page: 1,
  limit: 10,
  search: searchText,
  sortBy: sortBy
});

const createPostMutation = useCreatePostMutation();

const handleCreatePost = async (data: CreatePostRequest) => {
  try {
    await createPostMutation.mutateAsync(data);
    // Success! Post created and cache updated automatically
  } catch (error) {
    // Handle error
  }
};

// In your ForumDetail component:
const { data: post, isLoading } = usePostQuery(postId);
const createCommentMutation = useCreateCommentMutation();
const toggleLikeMutation = useToggleLikeMutation();

const handleCreateComment = async (content: string) => {
  await createCommentMutation.mutateAsync({
    postId: post.id,
    content,
    parentId: replyToId || undefined
  });
};

const handleToggleLike = async (targetId: string, targetType: 'post' | 'comment') => {
  await toggleLikeMutation.mutateAsync({ targetId, targetType });
};
*/
