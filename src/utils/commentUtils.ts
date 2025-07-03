// File: src/utils/commentUtils.ts

interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  likes: number;
  liked: boolean;
  createdAt: number;
  replies?: Comment[];
}

/**
 * Đếm tổng số comment bao gồm cả replies
 */
export const getTotalCommentCount = (comments: Comment[]): number => {
  let total = 0;

  const countRecursively = (commentList: Comment[]) => {
    for (const comment of commentList) {
      total += 1; // Đếm comment hiện tại
      if (comment.replies && comment.replies.length > 0) {
        countRecursively(comment.replies); // Đệ quy đếm replies
      }
    }
  };

  countRecursively(comments);
  return total;
};

/**
 * Format số comment để hiển thị (1K, 1.2K, etc.)
 */
export const formatCommentCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1).replace('.0', '') + 'K';
  } else {
    return (count / 1000000).toFixed(1).replace('.0', '') + 'M';
  }
};

/**
 * Tìm comment theo ID (bao gồm cả trong replies)
 */
export const findCommentById = (
  comments: Comment[],
  id: string
): Comment | null => {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Lấy độ sâu tối đa của comment tree
 */
export const getMaxDepth = (comments: Comment[]): number => {
  let maxDepth = 0;

  const calculateDepth = (commentList: Comment[], currentDepth: number = 0) => {
    for (const comment of commentList) {
      maxDepth = Math.max(maxDepth, currentDepth + 1);
      if (comment.replies && comment.replies.length > 0) {
        calculateDepth(comment.replies, currentDepth + 1);
      }
    }
  };

  calculateDepth(comments);
  return maxDepth;
};

/**
 * Format thời gian hiển thị comment, có hỗ trợ offset múi giờ (mặc định +7)
 */
export const formatTimeAgo = (
  timestamp: number,
  offsetHours: number = 7
): string => {
  if (!timestamp || isNaN(timestamp)) return 'Không xác định';
  // Nếu timestamp là string ISO, convert sang số
  let ts = timestamp;
  if (typeof timestamp === 'string') {
    ts = Date.parse(timestamp);
  }
  // Cộng offset múi giờ (mặc định +7)
  const localTs = ts + offsetHours * 60 * 60 * 1000;
  const now = Date.now() + offsetHours * 60 * 60 * 1000;
  const diffInSeconds = Math.floor((now - localTs) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else {
    return new Date(localTs).toLocaleDateString('vi-VN');
  }
};
