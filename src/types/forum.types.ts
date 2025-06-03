// File: src/types/forum.types.ts

export interface Comment {
  id: string;
  author: string;
  authorId: string;
  avatarUrl: string;
  content: string;
  likes: number;
  liked: boolean;
  createdAt: number;
  updatedAt?: number;
  replies?: Comment[];
  parentId?: string;
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  avatarUrl: string;
  title: string;
  content: string; // HTML content from rich text editor
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: number;
  updatedAt?: number;
  isPublished: boolean;
  viewCount?: number;
}

// API Request/Response types
export interface CreatePostRequest {
  content: string;
}

export interface CreatePostResponse {
  success: boolean;
  data: Post;
  message?: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string; // For replies
}

export interface CreateCommentResponse {
  success: boolean;
  data: Comment;
  message?: string;
}

export interface GetPostsRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'likes' | 'comments';
}

export interface GetPostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
}

export interface UpdatePostRequest {
  postId: string;
  content: string;
}

export interface UpdateCommentRequest {
  commentId: string;
  content: string;
}

export interface DeletePostRequest {
  postId: string;
}

export interface DeleteCommentRequest {
  commentId: string;
}

export interface ToggleLikeRequest {
  targetId: string;
  targetType: 'post' | 'comment';
}

export interface ToggleLikeResponse {
  success: boolean;
  data: {
    likes: number;
    liked: boolean;
  };
  message?: string;
}

// Utility types for frontend state management
export interface ForumState {
  posts: Post[];
  filteredPosts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
  searchText: string;
  sortBy: 'newest' | 'oldest' | 'likes' | 'comments';
}

export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  replyToId: string | null;
  editingId: string | null;
}

// API Error types
export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
