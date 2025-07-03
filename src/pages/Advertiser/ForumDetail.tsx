import { useState, useEffect, FC, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaChevronDown, FaEllipsisH } from 'react-icons/fa';
import CommentForm from '@/components/ui/CommentForm';
import RichTextEditor from '@/components/ui/RichTextEditor';
import {
  getTotalCommentCount,
  formatCommentCount,
  formatTimeAgo
} from '@/utils/commentUtils';
import {
  ForumPost,
  ForumAuthor,
  UIComment,
  CreateCommentPayload
} from '@/types';
import {
  useGetCommentsByPostId,
  useCreateComment,
  useCreateReply,
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

  // Track ID comment nào đang được edit, đồng thời store text mới
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Track ID của comment/post nào đang mở menu 3-chấm
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Đảm bảo khai báo state local cho comments ở đầu function ForumDetail
  const [comments, setComments] = useState<UIComment[]>(post.comments || []);

  // State cho popup xác nhận xóa
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'comment' | null;
    id: string;
    title?: string;
  }>({ isOpen: false, type: null, id: '', title: '' });

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
  const createReplyMutation = useCreateReply();
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
          createdAt: Number(new Date(comment.createdAt).getTime()),
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
      if (Array.isArray(commentsResponse.result)) arr = commentsResponse.result;
      else if (Array.isArray(commentsResponse.result.result))
        arr = commentsResponse.result.result;
      else arr = [];
      const transformedComments = transformComments(arr);
      setComments(transformedComments);
      console.log('commentsResponse.result:', arr);
      console.log('transformedComments:', transformedComments);
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
  const currentUserAvatar = decodedToken?.Id
    ? (decodedToken?.Role === 'Advertiser'
        ? post.author?.userDetail?.avatarURL
        : undefined) || 'https://i.pravatar.cc/40?u=' + decodedToken.Id
    : 'https://i.pravatar.cc/40?u=default';

  // --------------------------------------------
  // Sắp xếp comment dựa vào sortBy
  // --------------------------------------------
  const sortedComments = (coms: UIComment[]): UIComment[] => {
    const arr = [...coms];
    if (sortBy === 'likes') {
      arr.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'newest') {
      arr.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      arr.sort((a, b) => a.createdAt - b.createdAt);
    }
    return arr;
  };

  // --------------------------------------------
  // Thêm comment hoặc reply (sử dụng API)
  // --------------------------------------------
  const handlePostComment = async () => {
    const txt = commentText.trim();
    if (!txt) return;

    try {
      const payload: CreateCommentPayload = {
        content: txt,
        postId: post.id,
        parentCommentId: replyToId ? parseInt(replyToId) : null
      };

      if (replyToId) {
        await createReplyMutation.mutateAsync(payload);
      } else {
        await createCommentMutation.mutateAsync(payload);
      }

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
  // --------------------------------------------
  const saveEditedComment = async (id: string) => {
    try {
      await updateCommentMutation.mutateAsync({
        id: parseInt(id),
        data: { content: editingText }
      });

      refetchComments();
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Có lỗi xảy ra khi cập nhật bình luận');
    }
  };

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
                className="ml-1 rounded border px-2 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: '#F5F3FF',
                  color: '#8B5CF6',
                  borderColor: '#C4B5FD'
                }}
              >
                {reply.authorRole}
              </span>
            )}
            {reply.authorId === advertiserId && (
              <span className="ml-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                TÁC GIẢ
              </span>
            )}
          </div>
          <div
            className="prose prose-xs mb-2"
            dangerouslySetInnerHTML={{ __html: reply.content }}
          />
          <div className="mb-1 text-xs text-gray-400">
            {formatTimeAgo(reply.createdAt, 7)}
          </div>
          {reply.replies &&
            reply.replies.length > 0 &&
            renderReplies(reply.replies, level + 1)}
        </div>
      </motion.div>
    ));

  const renderComments = (list: UIComment[]): JSX.Element[] =>
    sortedComments(list).map((c) => {
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
                        className="ml-1 rounded border px-2 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: '#F5F3FF',
                          color: '#8B5CF6',
                          borderColor: '#C4B5FD'
                        }}
                      >
                        {c.authorRole}
                      </span>
                    )}
                  </span>
                  {c.author === getDisplayName(post.author) && (
                    <span className="rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-bold text-purple-600">
                      TÁC GIẢ
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(c.createdAt, 7)}
                </div>
              </div>
            </div>

            {/* Menu cho comment của "Bạn" - FIX: Kiểm tra theo ID thay vì tên */}
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
                            setEditingId(c.id);
                            setEditingText(c.content);
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

          {/* Nội dung comment */}
          {editingId === c.id ? (
            <div className="mb-4">
              <RichTextEditor
                value={editingText}
                onChange={setEditingText}
                placeholder="Chỉnh sửa bình luận..."
                height={150}
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
                  onClick={() => saveEditedComment(c.id)}
                  className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white transition hover:bg-purple-600"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm mb-4 max-w-none whitespace-pre-line break-words leading-relaxed text-gray-700"
              style={{ wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: c.content }}
            />
          )}

          {/* Render replies nếu có */}
          {c.replies && c.replies.length > 0 && (
            <div className="ml-8 mt-2">{renderReplies(c.replies)}</div>
          )}

          {/* Actions cho post */}
          <div className="flex items-center justify-between border-t border-purple-200/50 pt-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-500">
                <FaComment className="text-xl" />
                <span className="text-lg font-medium">
                  {formatCommentCount(getTotalCommentCount(post.comments))}
                </span>
              </div>
              <ForumDetailLikeButton
                postId={post.id}
                likes={post.likes}
                liked={post.liked}
              />
            </div>
          </div>
        </motion.div>
      );
    });

  // Xử lý conversion thời gian từ API
  const getFormattedTime = (dateString: string) => {
    return formatTimeAgo(new Date(dateString).getTime());
  };

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
                {formatCommentCount(getTotalCommentCount(comments))} bình luận
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
                    {getFormattedTime(post.createdAt)}
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
                <div className="flex items-center space-x-2 text-gray-500">
                  <FaComment className="text-xl" />
                  <span className="text-lg font-medium">
                    {formatCommentCount(getTotalCommentCount(post.comments))}
                  </span>
                </div>
                <ForumDetailLikeButton
                  postId={post.id}
                  likes={post.likes}
                  liked={post.liked}
                />
              </div>
            </div>
          </motion.div>

          {/* Chỗ nhập comment chính */}
          {!replyToId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
          )}

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
  onLikeChange
}: {
  postId: number;
  likes: number;
  liked: boolean;
  onLikeChange?: (liked: boolean, likes: number) => void;
}): JSX.Element {
  const { data: likedApi = initialLiked } = useCheckLiked(postId);
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const [liked, setLiked] = useState(likedApi);
  const [likes, setLikes] = useState(initialLikes);
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
      } catch (error) {
        // handle error
      }
    } else {
      try {
        await likePostMutation.mutateAsync(postId);
        setLiked(true);
        setLikes((prev) => prev + 1);
        onLikeChange?.(true, likes + 1);
      } catch (error) {
        // handle error
      }
    }
  };
  // Khi like/unlike thành công, nếu có onLikeChange thì gọi updatePost để đồng bộ lại post cha
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
