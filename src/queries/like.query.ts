import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const SUB_URL = `/api/Likes`;
// Nếu đã có axios instance cấu hình sẵn, hãy import từ config/axios.config thay cho axios mặc định
// import axios from '../config/axios.config';

/**
 * Lấy số lượng like của một post
 * @param postId ID của bài viết
 */

export function useGetLikeCount(postId?: number | string) {
  return useQuery({
    queryKey: ['like-count', postId],
    queryFn: async () => {
      if (!postId) return 0;
      const res = await axios.get(`${SUB_URL}/count/${postId}`);
      // API trả về { count: number }
      return res.data?.count ?? 0;
    },
    enabled: !!postId,
    staleTime: 1000 * 10 // 10s
  });
}

/**
 * Kiểm tra đã like post chưa (trả về true/false)
 * @param postId ID của bài viết
 */
export function useCheckLiked(postId?: number | string) {
  return useQuery({
    queryKey: ['like-check', postId],
    queryFn: async () => {
      if (!postId) return false;
      const res = await axios.get(`${SUB_URL}/check/${postId}`);
      return res.data === true || res.data === 'true';
    },
    enabled: !!postId,
    staleTime: 1000 * 10 // 10s
  });
}

/**
 * Like một post
 */
export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number | string) => {
      await axios.post(`${SUB_URL}/like/${postId}`);
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['like-count', postId] });
      queryClient.invalidateQueries({ queryKey: ['like-check', postId] });
    }
  });
}

/**
 * Unlike một post
 */
export function useUnlikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number | string) => {
      await axios.delete(`${SUB_URL}/unlike/${postId}`);
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['like-count', postId] });
      queryClient.invalidateQueries({ queryKey: ['like-check', postId] });
    }
  });
}
