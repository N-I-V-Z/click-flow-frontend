import { useState, useEffect, FC, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaChevronDown, FaEllipsisH } from 'react-icons/fa';
import CommentForm from '@/components/ui/CommentForm';
import RichTextEditor from '@/components/ui/RichTextEditor';
import {
  getTotalCommentCountUI,
  formatCommentCount
} from '@/utils/commentUtils';
import { formatTimeAgoVi } from '@/utils/dateUtils';
import {
  ForumPost,
  ForumAuthor,
  UIComment,
  CreateCommentPayload
} from '@/types';
import {
  useGetCommentsByPostId,
  useCreateComment,
  useUpdateComment
} from '@/queries/comment.query';
import { useDeletePost } from '@/queries/forum.query';
import { useDeleteComment } from '@/queries/comment.query';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import type { TokenDecoded } from '@/types';
import {
  useCheckLiked,
  useLikePost,
  useUnlikePost
} from '@/queries/like.query';
import LikeButton from '@/components/ui/LikeButton';
import { useGetUserDetail } from '@/queries/user.query';
import { useGetPostById } from '@/queries/forum.query';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const advertiserId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

// Extend ForumPost để thêm các field cần thiết cho UI
interface ExtendedForumPost extends ForumPost {
  likes: number;
  liked: boolean;
  comments: UIComment[];
  // Thêm helper properties cho UI
  avatarUrl?: string; // Để tương thích với comment interface
}

// ----------------------------------------------
// Props cho ForumDetail
// ----------------------------------------------
interface ForumDetailProps {
  post: ExtendedForumPost;
  onBack: () => void;
  updatePost: (p: ExtendedForumPost) => void;
}

const ForumDetail: FC<ForumDetailProps> = ({ post, onBack, updatePost }) => {
  // --------------------------------------------
  // State local
  // --------------------------------------------
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingGif, setEditingGif] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [comments, setComments] = useState<UIComment[]>(post.comments || []);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    id: string;
    title?: string;
  }>({ isOpen: false, type: null, id: '', title: '' });
  // Thêm state cho phân trang comment
  const [commentsToShow, setCommentsToShow] = useState(10);

  // --------------------------------------------
  // API Hooks
  // --------------------------------------------
  const {
    data: commentsResponse,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments
  } = useGetCommentsByPostId(post.id);

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deletePostMutation = useDeletePost();
  const deleteCommentMutation = useDeleteComment();

  // Move transformComments to top-level scope so it is accessible in useEffect
  const transformComments = useCallback(
    (apiComments: import('@/types').CommentApiResponse[]): UIComment[] => {
      return (apiComments || []).map((comment) => {
        const authorData =
          (comment as { authorInfo?: ForumAuthor }).authorInfo ||
          comment.author;
        const name = authorData?.fullName || 'Người dùng';
        const role = authorData?.role || '';
        const avatarUrl =
          authorData?.userDetail?.avatarURL ||
          'https://i.pravatar.cc/40?u=default';
        const likes = typeof comment.likes === 'number' ? comment.likes : 0;
        const liked =
          typeof comment.liked === 'boolean' ? comment.liked : false;
        return {
          id: comment.id ? comment.id.toString() : '',
          content: comment.content,
          createdAt: comment.createdAt, // giữ nguyên string ISO từ API
          author: name,
          authorRole: role,
          avatarUrl,
          postId: comment.postId,
          parentCommentId: comment.parentCommentId
            ? comment.parentCommentId.toString()
            : null,
          replies: transformComments(comment.replies || []),
          likes,
          liked,
          authorId: comment.authorId
        };
      });
    },
    []
  );

  // --------------------------------------------
  // Sync API data với local state
  // --------------------------------------------
  useEffect(() => {
    if (commentsResponse?.result) {
      let arr: import('@/types').CommentApiResponse[] = [];
      // Ưu tiên lấy từ datas nếu có (API paging)
      if (Array.isArray(commentsResponse.result.datas)) {
        arr = commentsResponse.result.datas;
      } else if (Array.isArray(commentsResponse.result)) {
        arr = commentsResponse.result;
      } else if (
        typeof commentsResponse.result === 'object' &&
        commentsResponse.result !== null &&
        Array.isArray((commentsResponse.result as { result?: unknown }).result)
      ) {
        arr = (
          commentsResponse.result as {
            result: import('@/types').CommentApiResponse[];
          }
        ).result;
      } else {
        arr = [];
      }
      const transformedComments = transformComments(arr);
      setComments(transformedComments);
      // ...log nếu cần...
    }
  }, [commentsResponse, transformComments]);

  useEffect(() => {
    console.log('comments state:', comments);
  }, [comments]);

  // Helper để lấy avatar URL từ API data
  const getAvatarUrl = (authorData?: ForumAuthor) => {
    return (
      authorData?.userDetail?.avatarURL || 'https://i.pravatar.cc/40?u=default'
    );
  };

  // Helper để lấy display name từ API data
  const getDisplayName = (authorData?: ForumAuthor) => {
    return authorData?.fullName || 'Người dùng';
  };

  // Helper lấy avatar user hiện tại
  // Sửa: lấy avatar từ comment đầu tiên của user hiện tại nếu có, nếu không thì dùng avatar mặc định
  const userId = decodedToken?.Id ? Number(decodedToken.Id) : undefined;
  const { data: userDetail } = useGetUserDetail(userId);
  const currentUserAvatar =
    userDetail?.result?.avatarURL ||
    `https://i.pravatar.cc/40?u=${userId || 'default'}`;

  // --------------------------------------------
  // Sắp xếp comment dựa vào sortBy
  // --------------------------------------------
  const sortedComments = (coms: UIComment[]): UIComment[] => {
    const arr = [...coms];
    if (sortBy === 'likes') {
      arr.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'newest') {
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      arr.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    return arr;
  };

  // --------------------------------------------
  // Thêm comment hoặc reply (sử dụng API)
  // Sửa lại để nhận cả text và gifUrl từ CommentForm
  const handlePostComment = async ({
    text,
    gifUrl
  }: {
    text: string;
    gifUrl: string | null;
  }) => {
    const txt = text.trim();
    if (!txt && !gifUrl) return;

    let content = txt;
    if (gifUrl) {
      content = content + (content ? '\n' : '') + `[GIF]${gifUrl}[/GIF]`;
    }

    try {
      const payload: CreateCommentPayload = {
        content,
        postId: post.id,
        parentCommentId: replyToId ? parseInt(replyToId) : null
      };

      await createCommentMutation.mutateAsync(payload);

      // Refresh comments
      refetchComments();

      setCommentText('');
      setReplyToId(null);
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Có lỗi xảy ra khi đăng bình luận');
    }
  };

  // --------------------------------------------
  // Lưu chỉnh sửa comment (sử dụng API)
  // Khi vào chế độ edit, nếu comment có GIF thì tự động lấy GIF đầu tiên ra preview
  const saveEditedComment = async (id: string) => {
    try {
      let content = editingText;
      if (editingGif) {
        content = content + (content ? '\n' : '') + `[GIF]${editingGif}[/GIF]`;
      }
      await updateCommentMutation.mutateAsync({
        id: parseInt(id),
        data: { content }
      });

      refetchComments();
      setEditingId(null);
      setEditingText('');
      setEditingGif(null);
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Có lỗi xảy ra khi cập nhật bình luận');
    }
  };

  // Khi bắt đầu edit comment, nếu có GIF thì setEditingGif
  const handleEditComment = (comment: UIComment) => {
    setEditingId(comment.id);
    setEditingText(comment.content.replace(/\[GIF\](.*?)\[\/GIF\]/g, ''));
    // Lấy GIF đầu tiên nếu có
    const match = comment.content.match(/\[GIF\](.*?)\[\/GIF\]/);
    setEditingGif(match ? match[1] : null);
    setMenuOpenId(null);
  };

  // Helper: trả về class màu hệ 16 cho từng role (giống Forum)
  function getRoleColor(role?: string) {
    switch (role) {
      case 'Publisher':
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]'; // đỏ lợt
      case 'Admin':
        return 'bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]'; // tím lợt
      case 'Advertiser':
        return 'bg-[#D1FAE5] text-[#065F46] border-[#6EE7B7]'; // xanh lá lợt
      default:
        return 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
    }
  }

  // --------------------------------------------
  // Render comment chính + replies (có đệ quy)
  // --------------------------------------------
  const renderReplies = (replies: UIComment[], level = 1): JSX.Element[] =>
    replies.map((reply) => (
      <motion.div
        key={reply.id}
        initial={{ opacity: 0, x: 10 * level }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: level * 0.05 }}
        className={`ml-${level * 4} mb-4`}
      >
        <div className="rounded-xl border border-purple-100 bg-white/90 p-4 shadow backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <img
              src={reply.avatarUrl}
              alt={reply.author}
              className="h-8 w-8 rounded-full border border-purple-300 object-cover"
            />
            <span className="text-sm font-semibold">{reply.author}</span>
            {reply.authorRole && (
              <span
                className={`ml-1 rounded border px-2 py-0.5 text-xs font-bold ${getRoleColor(reply.authorRole)}`}
              >
                {reply.authorRole}
              </span>
            )}
            {reply.authorId === post.author.id && (
              <span className="ml-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                TÁC GIẢ
              </span>
            )}
            {/* Menu cho reply của user hiện tại */}
            {reply.authorId === advertiserId && (
              <div className="relative ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setMenuOpenId((prev) =>
                      prev === reply.id ? null : reply.id
                    )
                  }
                  className="rounded-full p-2 transition-colors hover:bg-purple-100/50"
                >
                  <FaEllipsisH className="text-xs text-gray-500" />
                </motion.button>
                <AnimatePresence>
                  {menuOpenId === reply.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleEditComment(reply);
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-purple-50"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick('comment', reply.id)}
                          className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          {/* Nội dung hoặc form chỉnh sửa */}
          {editingId === reply.id ? (
            <div className="mb-2">
              <CommentForm
                value={editingText}
                onChange={setEditingText}
                gifUrl={editingGif}
                onGifChange={setEditingGif}
                onSubmit={({ gifUrl }) => {
                  setEditingGif(gifUrl);
                  saveEditedComment(reply.id);
                }}
                onCancel={() => {
                  setEditingId(null);
                  setEditingText('');
                  setEditingGif(null);
                }}
                placeholder="Chỉnh sửa bình luận..."
                size="sm"
                avatarUrl={reply.avatarUrl}
                showActions={true}
              />
            </div>
          ) : (
            <div
              className="prose prose-xs mb-2 break-words"
              style={{ wordBreak: 'break-word' }}
            >
              {renderCommentContent(reply.content)}
            </div>
          )}
          <div className="mb-1 text-xs text-gray-400">
            {formatTimeAgoVi(reply.createdAt)}
          </div>
          {/* Nút trả lời cho reply */}
          <button
            className="mt-2 rounded-lg border border-purple-200 bg-white/80 px-3 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50"
            onClick={() => setReplyToId(reply.id)}
          >
            Trả lời
          </button>
          {/* Form reply cho reply */}
          {replyToId === reply.id && (
            <div className="mt-2">
              <CommentForm
                value={commentText}
                onChange={setCommentText}
                onSubmit={handlePostComment}
                placeholder={`Phản hồi cho ${reply.author}...`}
                size="sm"
                avatarUrl={currentUserAvatar}
                autoFocus
                onCancel={() => {
                  setReplyToId(null);
                  setCommentText('');
                }}
              />
            </div>
          )}
          {/* Render reply lồng nếu có */}
          {reply.replies &&
            reply.replies.length > 0 &&
            renderReplies(reply.replies, level + 1)}
        </div>
      </motion.div>
    ));

  // Render comments: chỉ render comment cha (parentCommentId === null)
  const renderComments = (list: UIComment[]): JSX.Element[] =>
    sortedComments(list.filter((c) => !c.parentCommentId))
      .slice(0, commentsToShow)
      .map((c) => {
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 rounded-3xl border border-white/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
          >
            {/* Avatar + header của comment chính */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={c.avatarUrl}
                  alt={c.author}
                  className="h-14 w-14 rounded-full border-4 border-purple-400 object-cover shadow-lg"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    {/* Hiển thị tên + tag role đẹp cho comment chính */}
                    <span className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      {c.author}
                      {c.authorRole && (
                        <span
                          className={`ml-1 rounded border px-2 py-0.5 text-xs font-bold ${getRoleColor(c.authorRole)}`}
                        >
                          {c.authorRole}
                        </span>
                      )}
                    </span>
                    {/* Tag tác giả: so sánh id tác giả với post.author.id */}
                    {c.authorId === post.author.id && (
                      <span className="rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-bold text-purple-600">
                        TÁC GIẢ
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgoVi(c.createdAt)}
                  </div>
                </div>
              </div>

              {/* Menu cho comment cha của user hiện tại */}
              {c.authorId === advertiserId && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setMenuOpenId((prev) => (prev === c.id ? null : c.id))
                    }
                    className="rounded-full p-3 transition-colors hover:bg-purple-100/50"
                  >
                    <FaEllipsisH className="text-gray-500" />
                  </motion.button>
                  <AnimatePresence>
                    {menuOpenId === c.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 z-20 mt-2 w-36 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              handleEditComment(c);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeleteClick('comment', c.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Nội dung comment */}
            {editingId === c.id ? (
              <div className="mb-4">
                <CommentForm
                  value={editingText}
                  onChange={setEditingText}
                  gifUrl={editingGif}
                  onGifChange={setEditingGif}
                  onSubmit={({ gifUrl }) => {
                    setEditingGif(gifUrl);
                    saveEditedComment(c.id);
                  }}
                  onCancel={() => {
                    setEditingId(null);
                    setEditingText('');
                    setEditingGif(null);
                  }}
                  placeholder="Chỉnh sửa bình luận..."
                  size="sm"
                  avatarUrl={c.avatarUrl}
                  showActions={true}
                />
              </div>
            ) : (
              <div
                className="prose prose-sm mb-4 max-w-none whitespace-pre-line break-words leading-relaxed text-gray-700"
                style={{ wordBreak: 'break-word' }}
              >
                {renderCommentContent(c.content)}
              </div>
            )}

            {/* Render replies nếu có */}
            {c.replies && c.replies.length > 0 && (
              <div className="ml-8 mt-2">{renderReplies(c.replies)}</div>
            )}

            {/* Nút trả lời cho comment chính */}
            <button
              className="mt-2 rounded-lg border border-purple-200 bg-white/80 px-3 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50"
              onClick={() => setReplyToId(c.id)}
            >
              Trả lời
            </button>
            {/* Form reply cho comment chính */}
            {replyToId === c.id && (
              <div className="mt-3">
                <CommentForm
                  value={commentText}
                  onChange={setCommentText}
                  onSubmit={handlePostComment}
                  placeholder={`Phản hồi cho ${c.author}...`}
                  size="sm"
                  avatarUrl={currentUserAvatar}
                  autoFocus
                  onCancel={() => {
                    setReplyToId(null);
                    setCommentText('');
                  }}
                />
              </div>
            )}
          </motion.div>
        );
      });

  // --------------------------------------------
  // Hàm mở popup xác nhận xóa
  // --------------------------------------------
  const handleDeleteClick = (
    type: 'post' | 'comment',
    id: string,
    title?: string
  ) => {
    setDeleteModal({ isOpen: true, type, id, title });
  };

  // --------------------------------------------
  // Hàm xác nhận xóa
  // --------------------------------------------
  const handleDeleteConfirm = async () => {
    if (deleteModal.type === 'post') {
      try {
        await deletePostMutation.mutateAsync(Number(deleteModal.id));
        setDeleteModal({ isOpen: false, type: null, id: '', title: '' });
        onBack(); // Quay lại sau khi xóa post
      } catch (error) {
        // handle error
      }
    } else if (deleteModal.type === 'comment') {
      try {
        await deleteCommentMutation.mutateAsync(Number(deleteModal.id));
        setDeleteModal({ isOpen: false, type: null, id: '', title: '' });
        refetchComments();
      } catch (error) {
        // handle error
      }
    }
  };

  // Helper: render nội dung comment, tự động hiển thị GIF nếu có [GIF]url[/GIF]
  function renderCommentContent(content: string) {
    const gifRegex = /\[GIF\](.*?)\[\/GIF\]/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match;
    while ((match = gifRegex.exec(content)) !== null) {
      const [full, url] = match;
      if (match.index > lastIndex) {
        elements.push(content.slice(lastIndex, match.index));
      }
      elements.push(
        <img
          src={url}
          alt="GIF"
          className="my-2 inline-block max-h-40 rounded-lg border border-purple-200"
          style={{ display: 'block' }}
        />
      );
      lastIndex = match.index + full.length;
    }
    if (lastIndex < content.length) {
      elements.push(content.slice(lastIndex));
    }
    return <>{elements}</>;
  }

  // --------------------------------------------
  // Giao diện Detail
  // --------------------------------------------
  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage:
          'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay để làm mờ background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      <div className="relative z-10">
        {/* Header với nút quay lại */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 border-b border-white/30 bg-white/80 shadow-lg backdrop-blur-lg"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 rounded-lg bg-white/90 px-4 py-2 font-semibold text-purple-600 shadow-md backdrop-blur-sm transition-all hover:text-purple-700 hover:shadow-lg"
            >
              <span>← Quay lại</span>
            </motion.button>

            <div className="flex items-center space-x-2 rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-600 shadow-md backdrop-blur-sm">
              <FaComment />
              <span className="font-medium">
                {formatCommentCount(getTotalCommentCountUI(comments))} bình luận
              </span>
            </div>
          </div>
        </motion.div>

        {/* Container chính */}
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-32">
          {/* Post chính */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/50 bg-white/95 p-8 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={getAvatarUrl(post.author)}
                  alt={getDisplayName(post.author)}
                  className="h-16 w-16 rounded-full border-4 border-purple-400 object-cover shadow-xl"
                />
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {getDisplayName(post.author)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgoVi(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Menu cho post của user hiện tại - FIX: Sử dụng ID thay vì email */}
              {post.author.id === advertiserId && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setMenuOpenId((prev) =>
                        prev === post.id.toString() ? null : post.id.toString()
                      )
                    }
                    className="rounded-full p-3 transition-colors hover:bg-purple-100/50"
                  >
                    <FaEllipsisH className="text-gray-500" />
                  </motion.button>
                  <AnimatePresence>
                    {menuOpenId === post.id.toString() && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 z-20 mt-2 w-36 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setEditingId(post.id.toString());
                              setEditingText(post.content);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick(
                                'post',
                                post.id.toString(),
                                post.title
                              )
                            }
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Title */}
            {post.title && (
              <h1 className="mb-4 text-2xl font-bold text-gray-800">
                {post.title}
              </h1>
            )}

            {/* Topic */}
            <div className="mb-4">
              <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                {post.topic}
              </span>
            </div>

            {/* Nội dung post */}
            {/* 123456 */}
            {editingId === post.id.toString() ? (
              <div className="mb-6">
                <RichTextEditor
                  value={editingText}
                  onChange={setEditingText}
                  placeholder="Chỉnh sửa nội dung..."
                  height={300}
                  className="mb-3"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingText('');
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      const updatedPost: ExtendedForumPost = {
                        ...post,
                        content: editingText
                      };
                      updatePost(updatedPost);
                      setEditingId(null);
                      setEditingText('');
                    }}
                    className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white transition hover:bg-purple-600"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="prose prose-purple mb-6 max-w-none text-lg leading-relaxed text-gray-700 [&>*:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Actions cho post */}
            <div className="flex items-center justify-between border-t border-purple-200/50 pt-6">
              <div className="flex items-center space-x-8">
                {/* Like button trước, comment sau */}
                <ForumDetailLikeButton
                  postId={post.id}
                  likes={post.likes}
                  liked={post.liked}
                  post={post}
                  updatePost={updatePost}
                />
                {/* Số comment kế bên nút tim */}
                <div className="flex items-center space-x-2 text-gray-500">
                  <FaComment className="text-xl" />
                  <span className="text-lg font-medium">
                    {formatCommentCount(getTotalCommentCountUI(comments))}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dropdown lọc comment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative inline-block"
          >
            <motion.button
              onClick={() => setFilterOpen(!filterOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 rounded-xl border border-purple-200 bg-white/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
            >
              <span>
                {sortBy === 'newest'
                  ? 'Mới nhất'
                  : sortBy === 'oldest'
                    ? 'Cũ nhất'
                    : 'Liên quan'}
              </span>
              <motion.div
                animate={{ rotate: filterOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-purple-500" />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute z-10 mt-2 w-40 origin-top-left rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                >
                  <div className="py-2">
                    {[
                      { value: 'newest', label: 'Mới nhất' },
                      { value: 'oldest', label: 'Cũ nhất' },
                      { value: 'likes', label: 'Liên quan' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortBy(value as 'newest' | 'oldest' | 'likes');
                          setFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          sortBy === value
                            ? 'bg-purple-50 font-medium text-purple-600'
                            : 'text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Form comment chính luôn hiển thị */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <CommentForm
              value={commentText}
              onChange={setCommentText}
              onSubmit={handlePostComment}
              placeholder="Chia sẻ suy nghĩ của bạn..."
              size="lg"
              avatarUrl={currentUserAvatar}
            />
          </motion.div>

          {/* Loading state cho comments */}
          {commentsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-white/50 bg-white/90 py-8 text-center shadow-xl backdrop-blur-sm"
            >
              <div className="text-purple-500">Đang tải bình luận...</div>
            </motion.div>
          )}

          {/* Error state cho comments */}
          {commentsError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-red-200 bg-red-50/90 py-8 text-center shadow-xl backdrop-blur-sm"
            >
              <div className="mb-2 text-red-600">Có lỗi khi tải bình luận</div>
              <button
                onClick={() => refetchComments()}
                className="text-sm text-red-500 underline hover:text-red-700"
              >
                Thử lại
              </button>
            </motion.div>
          )}

          {/* Danh sách comment */}
          {!commentsLoading && !commentsError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {renderComments(comments)}
              {/* Nút xem thêm nếu còn comment chưa render */}
              {sortedComments(comments.filter((c) => !c.parentCommentId))
                .length > commentsToShow && (
                <div className="mt-6 flex justify-center">
                  <button
                    className="rounded-full bg-purple-100 px-6 py-2 font-semibold text-purple-700 shadow transition hover:bg-purple-200"
                    onClick={() => setCommentsToShow((prev) => prev + 10)}
                  >
                    Xem thêm bình luận
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty state */}
          {!commentsLoading && !commentsError && comments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-white/50 bg-white/90 py-16 text-center shadow-xl backdrop-blur-sm"
            >
              <div className="mb-4 text-6xl">💬</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                Chưa có bình luận nào
              </h3>
              <p className="text-gray-500">
                Hãy là người đầu tiên chia sẻ suy nghĩ về bài viết này!
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Popup xác nhận xóa */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
              <h3 className="mb-4 text-lg font-bold text-gray-800">
                Xác nhận xóa{' '}
                {deleteModal.type === 'post' ? 'bài viết' : 'bình luận'}
              </h3>
              <div className="mb-6 text-gray-600">
                {deleteModal.type === 'post'
                  ? `Bạn có chắc chắn muốn xóa bài viết "${deleteModal.title}"?`
                  : 'Bạn có chắc chắn muốn xóa bình luận này?'}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: false,
                      type: null,
                      id: '',
                      title: ''
                    })
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ForumDetailLikeButton: đồng bộ lại state cha khi like/unlike
function ForumDetailLikeButton({
  postId,
  likes: initialLikes,
  liked: initialLiked,
  post,
  onLikeChange,
  updatePost
}: {
  postId: number;
  likes: number;
  liked: boolean;
  post: ExtendedForumPost;
  onLikeChange?: (liked: boolean, likes: number) => void;
  updatePost?: (post: ExtendedForumPost) => void;
}): JSX.Element {
  const { data: likedApi = initialLiked } = useCheckLiked(postId);
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const [liked, setLiked] = useState(likedApi);
  const [likes, setLikes] = useState(initialLikes);
  const { refetch: refetchPost } = useGetPostById(postId);

  useEffect(() => {
    setLiked(likedApi);
  }, [likedApi]);
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);
  const handleToggleLike = async () => {
    if (liked) {
      try {
        await unlikePostMutation.mutateAsync(postId);
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
        onLikeChange?.(false, likes - 1);
        if (updatePost) {
          const { data } = await refetchPost();
          const forumData = data?.result ? data.result : data;
          if (
            forumData &&
            'likeCount' in forumData &&
            'isLikedByCurrentUser' in forumData
          ) {
            updatePost({
              ...post,
              ...forumData,
              likes: forumData.likeCount,
              liked: forumData.isLikedByCurrentUser
            });
          }
        }
      } catch (error) {
        // handle error
      }
    } else {
      try {
        await likePostMutation.mutateAsync(postId);
        setLiked(true);
        setLikes((prev) => prev + 1);
        onLikeChange?.(true, likes + 1);
        if (updatePost) {
          const { data } = await refetchPost();
          const forumData = data?.result ? data.result : data;
          if (
            forumData &&
            'likeCount' in forumData &&
            'isLikedByCurrentUser' in forumData
          ) {
            updatePost({
              ...post,
              ...forumData,
              likes: forumData.likeCount,
              liked: forumData.isLikedByCurrentUser
            });
          }
        }
      } catch (error) {
        // handle error
      }
    }
  };
  useEffect(() => {
    if (onLikeChange) onLikeChange(liked, likes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liked, likes]);
  return (
    <LikeButton
      liked={liked}
      likes={likes}
      onToggle={handleToggleLike}
      size="md"
    />
  );
}

export default ForumDetail;
