import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaComment, FaEllipsisH } from 'react-icons/fa';
import BasePages from '@/components/shared/base-pages';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreatePostModal from '@/components/ui/CreatePostModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { useToast } from '@/components/ui/use-toast';
import { formatCommentCount } from '@/utils/commentUtils';
import {
  useGetAllPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost
} from '@/queries/forum.query';
import { ForumPost, ExtendedComment } from '@/types';
import helpers from '@/helpers';
import { TokenDecoded } from '@/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useLikePost,
  useUnlikePost,
  useCheckLiked
} from '@/queries/like.query';
import LikeButton from '@/components/ui/LikeButton';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  helpers.cookie_get('AT')
);
const advertiserId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

interface ExtendedForumPost extends ForumPost {
  likes: number;
  liked: boolean;
  comments: ExtendedComment[];
  avatarUrl?: string;
  view?: number;
}

// Helper: trả về class màu hệ 16 cho từng role
function getRoleColor(role?: string) {
  switch (role) {
    case 'Publisher':
      return 'bg-[#F87171] text-[#B91C1C] border-[#FCA5A5]'; // đỏ
    case 'Admin':
      return 'bg-[#A78BFA] text-[#6D28D9] border-[#DDD6FE]'; // tím
    case 'Advertiser':
      return 'bg-[#34D399] text-[#065F46] border-[#6EE7B7]'; // xanh lá
    default:
      return 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]';
  }
}

// Helper: format thời gian kiểu "x phút/giờ trước" nếu <24h, còn lại thì ngày giờ
function formatTimeAgoVi(utcString?: string) {
  if (!utcString) return '';
  try {
    const now = new Date();
    const date = new Date(utcString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      if (diffHour >= 1) return `${diffHour} giờ trước`;
      if (diffMin >= 1) return `${diffMin} phút trước`;
      return 'Vừa xong';
    }
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

export default function Forum() {
  // --------------------------------------------
  // Toast notifications
  // --------------------------------------------
  const { toast } = useToast();

  // --------------------------------------------
  // State & refs
  // --------------------------------------------
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);

  // State cho menu 3 chấm
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Modal xác nhận xóa
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: string;
  }>({
    isOpen: false,
    postId: ''
  });

  // State cần thiết cho logic và JSX
  const [posts, setPosts] = useState<ExtendedForumPost[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostText, setEditingPostText] = useState('');
  const [selectedPost, setSelectedPost] = useState<ExtendedForumPost | null>(
    null
  );

  // Thêm state cho pageSize
  const [pageSize, setPageSize] = useState(limitParam);

  // --------------------------------------------
  // API Hooks
  // --------------------------------------------
  const {
    data: postsResponse,
    isLoading,
    error,
    refetch
  } = useGetAllPosts(currentPage, pageSize);

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // --------------------------------------------
  // Load dữ liệu từ API
  // --------------------------------------------
  useEffect(() => {
    if (postsResponse?.result && Array.isArray(postsResponse.result)) {
      const transformedPosts: ExtendedForumPost[] = postsResponse.result.map(
        (post) => ({
          ...post,
          likes: post.likeCount || 0,
          liked: post.isLikedByCurrentUser || false,
          comments: [],
          avatarUrl: post.author.userDetail.avatarURL,
          view: 0
        })
      );
      setPosts(transformedPosts);
      // Ưu tiên lấy tổng số bài từ totalCount nếu có, fallback về result.length
      let totalItems: number;
      const resultWithTotalCount = postsResponse.result as {
        totalCount?: number;
        length: number;
      };
      if (typeof resultWithTotalCount.totalCount === 'number') {
        totalItems = resultWithTotalCount.totalCount;
      } else {
        totalItems = resultWithTotalCount.length;
      }
      const calculatedPages = Math.ceil(totalItems / pageSize);
      setTotalPages(Math.max(1, calculatedPages));
      if (currentPage > calculatedPages) setCurrentPage(1);
    } else {
      setPosts([]);
    }
  }, [postsResponse, pageSize, currentPage]);

  // Sử dụng useEffect để gọi refetch khi currentPage hoặc pageSize thay đổi
  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, refetch]);

  // Khi đổi currentPage/pageSize thì update query string
  useEffect(() => {
    setSearchParams({ page: String(currentPage), limit: String(pageSize) });
  }, [currentPage, pageSize, setSearchParams]);

  // --------------------------------------------
  // Tạo bài mới
  // --------------------------------------------
  const handleCreatePost = async (data: {
    title: string;
    content: string;
    topic: string;
  }) => {
    try {
      await createPostMutation.mutateAsync({
        title: data.title,
        content: data.content,
        topic: data.topic
      });

      refetch();
      setShowCreate(false);
      toast({
        title: 'Thành công!',
        description: 'Bài viết đã được tạo thành công',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi tạo bài viết',
        variant: 'destructive'
      });
    }
  };

  // --------------------------------------------
  // Edit post
  // --------------------------------------------
  const handleEditPost = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPostId(postId.toString());
      setEditingPostText(post.content);
      setMenuOpenId(null);
    }
  };

  const saveEditedPost = async (postId: string) => {
    try {
      const post = posts.find((p) => p.id.toString() === postId);
      if (!post) return;

      await updatePostMutation.mutateAsync({
        id: parseInt(postId),
        title: post.title,
        content: editingPostText,
        topic: post.topic
      });

      refetch();
      setEditingPostId(null);
      setEditingPostText('');
      toast({
        title: 'Cập nhật thành công!',
        description: 'Bài viết đã được cập nhật',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi cập nhật bài viết',
        variant: 'destructive'
      });
    }
  };

  // --------------------------------------------
  // Delete post
  // --------------------------------------------
  const handleDeletePost = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(parseInt(postId));
      refetch();

      if (selectedPost && selectedPost.id.toString() === postId) {
        setSelectedPost(null);
      }

      toast({
        title: 'Đã xóa!',
        description: 'Bài viết đã được xóa thành công',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi xóa bài viết',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteClick = (postId: number) => {
    setDeleteModal({ isOpen: true, postId: postId.toString() });
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = () => {
    handleDeletePost(deleteModal.postId);
    setDeleteModal({ isOpen: false, postId: '' });
  };

  // --------------------------------------------
  // Handle post click
  // --------------------------------------------
  const navigate = useNavigate();
  const handlePostClick = (post: ExtendedForumPost) => {
    navigate(`/all/forum-detail/${post.id}`, { state: { post } });
  };

  // --------------------------------------------
  // Pagination component
  // --------------------------------------------
  const renderPagination = () => {
    // Luôn hiển thị pagination, kể cả khi chỉ có 1 trang
    return (
      <div className="mt-8 flex flex-wrap items-center justify-between rounded-xl border border-gray-200 bg-white/80 px-2 py-4 shadow-sm">
        {/* Dropdown chọn số bài/trang */}
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select
            className="rounded border px-2 py-1 focus:outline-none"
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              setCurrentPage(1); // Reset về trang 1 khi đổi page size
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        {/* Thông tin trang và nút chuyển trang */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            Trang {currentPage} trên {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="rounded border bg-white px-2 py-1 disabled:opacity-50"
          >
            &#171;
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded border bg-white px-2 py-1 disabled:opacity-50"
          >
            &#60;
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="rounded border bg-white px-2 py-1 disabled:opacity-50"
          >
            &#62;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded border bg-white px-2 py-1 disabled:opacity-50"
          >
            &#187;
          </button>
        </div>
      </div>
    );
  };

  // --------------------------------------------
  // Render Home
  // --------------------------------------------
  const renderHome = () => {
    if (isLoading) {
      return (
        <div
          className="relative flex min-h-screen items-center justify-center overflow-x-hidden"
          style={{
            backgroundImage:
              'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          <div className="relative z-10">
            <span className="text-xl font-medium text-white">
              Đang tải bài viết…
            </span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="relative flex min-h-screen items-center justify-center overflow-x-hidden"
          style={{
            backgroundImage:
              'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          <div className="relative z-10 text-center">
            <span className="mb-4 block text-xl font-medium text-white">
              Có lỗi xảy ra khi tải dữ liệu
            </span>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-[#8B5CF6] px-6 py-2 text-white hover:bg-[#7C3AED]"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    return (
      <BasePages pageHead="ClickFlow - Diễn đàn ">
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
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

          <div className="relative z-10 space-y-6 px-4 py-6 pb-40">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                Diễn đàn
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <motion.button
                  onClick={() => setShowCreate(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-[#7C3AED] hover:to-[#E11D48] hover:shadow-xl"
                >
                  <FaPlus className="text-base" />
                  <span>Tạo bài</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Modal tạo bài */}
            <CreatePostModal
              isOpen={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreatePost}
            />

            {/* Thông tin phân trang */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between text-sm text-white/80"
            >
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <span>{posts.length} bài viết</span>
            </motion.div>

            {/* Danh sách bài viết */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-6"
            >
              {posts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-white/50 bg-white/90 py-16 text-center shadow-xl backdrop-blur-sm"
                >
                  <div className="mb-4 text-6xl">📝</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-700">
                    Không có bài viết
                  </h3>
                  <p className="text-gray-500">Hãy tạo bài viết đầu tiên!</p>
                </motion.div>
              ) : (
                posts.map((p, index) => {
                  const preview =
                    p.content.length > 300
                      ? p.content.substring(0, 300) + '...'
                      : p.content;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="transform cursor-pointer rounded-3xl border border-white/50 bg-white/95 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
                    >
                      <div className="mb-4 flex items-center">
                        <motion.img
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          src={p.author.userDetail.avatarURL}
                          alt={p.author.fullName}
                          className="border-3 mr-3 h-12 w-12 rounded-full border-purple-400 object-cover shadow-lg"
                        />
                        <div className="flex flex-1 flex-col justify-center">
                          <div
                            onClick={() => handlePostClick(p)}
                            className="flex items-center gap-2"
                          >
                            <div className="text-base font-bold text-gray-900">
                              {p.author.fullName}
                            </div>
                            {p.author.role && (
                              <span
                                className={`ml-1 rounded border px-2 py-0.5 text-xs font-bold ${getRoleColor(p.author.role)}`}
                              >
                                {p.author.role}
                              </span>
                            )}
                          </div>
                          {/* Thời gian bài viết nhỏ, phụ, dưới tên user */}
                          {p.createdAt && (
                            <span className="ml-0 mt-1 block text-xs font-normal text-gray-400">
                              {formatTimeAgoVi(p.createdAt)}
                            </span>
                          )}
                        </div>

                        {/* Menu cho bài của user hiện tại */}
                        {p.author.id === advertiserId && (
                          <div
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                setMenuOpenId((prev) =>
                                  prev === p.id.toString()
                                    ? null
                                    : p.id.toString()
                                )
                              }
                              className="rounded-full p-2 transition-colors hover:bg-purple-100/50"
                            >
                              <FaEllipsisH className="text-gray-500" />
                            </motion.button>
                            <AnimatePresence>
                              {menuOpenId === p.id.toString() && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                  className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                                >
                                  <div className="py-2">
                                    <div
                                      onClick={() => handleEditPost(p.id)}
                                      className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                                    >
                                      Chỉnh sửa
                                    </div>
                                    <div
                                      onClick={() => handleDeleteClick(p.id)}
                                      className="text-red-600 hover:bg-red-50 cursor-pointer px-4 py-2 text-sm"
                                    >
                                      Xóa
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Content hoặc RichTextEditor nếu đang edit */}
                      {editingPostId === p.id.toString() ? (
                        <div
                          className="mb-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RichTextEditor
                            value={editingPostText}
                            onChange={setEditingPostText}
                            placeholder="Chỉnh sửa nội dung..."
                            height={200}
                            className="mb-3"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPostId(null);
                                setEditingPostText('');
                              }}
                              className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEditedPost(p.id.toString());
                              }}
                              className="transform rounded-lg bg-purple-500 px-3 py-1 text-xs text-white transition hover:scale-105 hover:bg-purple-600"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => handlePostClick(p)}>
                          {/* Title */}
                          {p.title && (
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                              {p.title}
                            </h3>
                          )}

                          {/* Content (giới hạn 2 dòng, thêm ... nếu dài) */}
                          <div
                            className="prose prose-purple mb-4 line-clamp-2 max-w-none cursor-pointer whitespace-pre-line break-words leading-relaxed text-gray-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                            style={{
                              wordBreak: 'break-word',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            dangerouslySetInnerHTML={{ __html: preview }}
                          />

                          {/* Topic tag */}
                          <div className="mb-3">
                            <span
                              className="inline-block max-w-[120px] cursor-pointer truncate rounded-full px-3 py-1.5 text-xs font-medium"
                              style={{
                                backgroundColor:
                                  p.topic === 'QA'
                                    ? '#EFF6FF'
                                    : p.topic === 'Tips'
                                      ? '#FFFBEB'
                                      : '#F5F3FF',
                                color:
                                  p.topic === 'QA'
                                    ? '#3B82F6'
                                    : p.topic === 'Tips'
                                      ? '#F59E0B'
                                      : '#8B5CF6'
                              }}
                              title={p.topic}
                            >
                              {p.topic === 'QA'
                                ? 'Q&A'
                                : p.topic === 'Tips'
                                  ? 'Tips'
                                  : 'Other'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center space-x-6">
                          {/* Like button */}
                          <ForumLikeButton
                            postId={p.id}
                            likes={p.likes}
                            liked={p.liked}
                            onLikeChange={(liked, likes) => {
                              setPosts((prev) =>
                                prev.map((x) =>
                                  x.id === p.id ? { ...x, liked, likes } : x
                                )
                              );
                            }}
                          />
                          {/* Comment section */}
                          <div
                            className="flex cursor-pointer items-center space-x-2 transition-colors hover:text-[#8B5CF6]"
                            onClick={() => handlePostClick(p)}
                          >
                            <FaComment className="text-lg" />
                            <span className="font-medium">
                              {formatCommentCount(p.feedbackNumber)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>

            {/* Pagination luôn hiển thị dưới danh sách, thêm mb-16 để không bị che */}
            <div className="mb-16 flex w-full justify-center">
              {renderPagination()}
            </div>

            {/* Modal xác nhận xóa */}
            <ConfirmModal
              isOpen={deleteModal.isOpen}
              onClose={() => setDeleteModal({ isOpen: false, postId: '' })}
              onConfirm={handleDeleteConfirm}
              title="Xóa bài viết"
              message="Bạn có chắc chắn muốn xóa bài viết này? Tất cả bình luận cũng sẽ bị xóa."
              confirmText="Xóa"
              cancelText="Hủy"
              type="danger"
            />
          </div>
        </div>
      </BasePages>
    );
  };

  // --------------------------------------------
  // Main render
  // --------------------------------------------
  return renderHome();
}

// Component Like cho từng post, dùng hook đúng chuẩn React
function ForumLikeButton({
  postId,
  likes: initialLikes,
  liked: initialLiked,
  onLikeChange
}: {
  postId: number;
  likes: number;
  liked: boolean;
  onLikeChange: (liked: boolean, likes: number) => void;
}) {
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
        onLikeChange(false, likes - 1);
      } catch (error) {
        // handle error
      }
    } else {
      try {
        await likePostMutation.mutateAsync(postId);
        setLiked(true);
        setLikes((prev) => prev + 1);
        onLikeChange(true, likes + 1);
      } catch (error) {
        // handle error
      }
    }
  };
  return (
    <LikeButton
      liked={liked}
      likes={likes}
      onToggle={handleToggleLike}
      size="md"
    />
  );
}
