import React, { useState } from 'react';
import {
  useGetFeedbacksByCampaign,
  useCreateFeedback,
  useUpdateFeedback,
  useCheckUserFeedback
} from '@/queries/feedback.query';
import { IFeedback } from '@/types/index';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { Spin } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { motion } from 'framer-motion';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const PUBLISHER_ID =
  decodedToken?.Id !== undefined ? parseInt(decodedToken?.Id) : 0;

/** Tính phân bố sao */
function computeStarDistribution(feedbacks: IFeedback[]) {
  const distribution = [0, 0, 0, 0, 0];
  feedbacks.forEach((fb) => {
    if (fb.starRate >= 1 && fb.starRate <= 5) {
      distribution[fb.starRate - 1]++;
    }
  });
  return distribution;
}

/** Custom Components */
const MoreVertical: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const CheckCircle: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const Edit: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const MessageSquare: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Send: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
);

const Save: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
);

const ArrowLeft: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);

const ArrowRight: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4'
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);

const Sparkles: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5'
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4l3-3z" />
    <path d="M12 8l1.5 1.5L15 8l1.5 1.5L15 11l-1.5 1.5L12 11l-1.5 1.5L9 11l-1.5-1.5L9 8l1.5-1.5L12 8z" />
  </svg>
);

/** Rating Feedback Component */
const RatingFeedback: React.FC<{ rating: number; className?: string }> = ({
  rating,
  className = 'font-semibold text-lg'
}) => {
  const feedbackMap = {
    1: { text: 'Rất không hài lòng', color: '#DC2626' },
    2: { text: 'Không hài lòng', color: '#EA580C' },
    3: { text: 'Bình thường', color: '#D97706' },
    4: { text: 'Hài lòng', color: '#8B5CF6' },
    5: { text: 'Rất hài lòng', color: '#10B981' }
  };

  const feedback = feedbackMap[rating as keyof typeof feedbackMap];
  if (!feedback) return null;

  return (
    <span className={className} style={{ color: feedback.color }}>
      {feedback.text}
    </span>
  );
};
const CustomStar: React.FC<{
  filled: boolean;
  half?: boolean;
  size?: string;
}> = ({ filled, half = false, size = 'w-5 h-5' }) => {
  return (
    <div className={`${size} relative`}>
      <svg
        viewBox="0 0 24 24"
        className={`${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-200`}
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {half && (
        <div className="absolute inset-0 w-1/2 overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            className={`${size} text-yellow-400 transition-colors duration-200`}
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

/** Render stars with proper half-star logic */
function renderStars(
  rating: number,
  showHalf: boolean = false,
  size: string = 'w-5 h-5'
) {
  const stars: React.ReactElement[] = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = showHalf && rating - fullStars >= 0.5;

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<CustomStar key={i} filled={true} size={size} />);
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <CustomStar key="half" filled={false} half={true} size={size} />
    );
  }

  // Empty stars
  const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<CustomStar key={`empty-${i}`} filled={false} size={size} />);
  }

  return <div className="flex items-center justify-center gap-1">{stars}</div>;
}

/** Get initials from name for avatar */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Feedback: React.FC<{
  campaignId: number;
  publisherStatus?: string;
}> = ({ campaignId, publisherStatus }) => {
  // Queries
  const {
    data: feedbacks = [],
    isLoading,
    error,
    refetch
  } = useGetFeedbacksByCampaign(campaignId, 1, 50);

  const {
    data: hasUserFeedback = false,
    isLoading: isCheckingFeedback,
    refetch: refetchCheck
  } = useCheckUserFeedback(campaignId);

  const { mutateAsync: createFeedback, isPending: isCreating } =
    useCreateFeedback();
  const { mutateAsync: updateFeedback, isPending: isUpdating } =
    useUpdateFeedback();

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newContent, setNewContent] = useState<string>('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(
    null
  );
  const [editingStarRate, setEditingStarRate] = useState<number>(0);
  const [editingContent, setEditingContent] = useState<string>('');

  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [starFilter, setStarFilter] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const isError = !!error;
  const totalFeedback = feedbacks.length;
  const avgRating = totalFeedback
    ? feedbacks.reduce((sum, fb) => sum + fb.starRate, 0) / totalFeedback
    : 0;

  const distribution = computeStarDistribution(feedbacks);
  const starPercentages = distribution.map((count) =>
    totalFeedback > 0 ? Math.round((count / totalFeedback) * 100) : 0
  );

  // Filter and sort feedbacks
  let displayedFeedbacks = [...feedbacks];
  if (starFilter > 0) {
    displayedFeedbacks = displayedFeedbacks.filter(
      (fb) => fb.starRate === starFilter
    );
  }

  displayedFeedbacks.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const totalPages = Math.ceil(displayedFeedbacks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = displayedFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handlers
  const handleSubmitReview = async () => {
    if (newRating === 0 || !newContent.trim()) {
      showToast.warning('Vui lòng chọn số sao và nhập nội dung đánh giá!');
      return;
    }
    try {
      await createFeedback({
        campaignId,
        starRate: newRating,
        description: newContent
      });
      await refetch();
      await refetchCheck();
      closeModal();
      showToast.success('Đánh giá của bạn đã được gửi thành công!');
    } catch (err) {
      showToast.error(`Tạo feedback thất bại: ${(err as Error).message}`);
    }
  };

  const handleUpdateFeedback = async () => {
    if (!editingFeedbackId || editingStarRate === 0 || !editingContent.trim()) {
      showToast.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try {
      await updateFeedback({
        id: editingFeedbackId,
        starRate: editingStarRate,
        description: editingContent
      });
      await refetch();
      closeEditModal();
      showToast.success('Cập nhật đánh giá thành công!');
    } catch (err) {
      showToast.error(`Cập nhật thất bại: ${(err as Error).message}`);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewRating(0);
    setNewContent('');
  };

  const openEditModal = (fb: IFeedback) => {
    setEditingFeedbackId(fb.id);
    setEditingStarRate(fb.starRate);
    setEditingContent(fb.description);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingFeedbackId(null);
    setEditingStarRate(0);
    setEditingContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Loading state
  if (isLoading || isCheckingFeedback) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin size="large" />
        <span className="ml-3 text-gray-600">Đang tải đánh giá...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center">
        <div className="mb-2 text-lg font-medium text-red-500">
          Có lỗi xảy ra khi tải đánh giá
        </div>
        <p className="text-gray-600">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Statistics Section */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Thống kê đánh giá
            </h2>

            {totalFeedback > 0 ? (
              <div className="space-y-6">
                {/* Average Rating */}
                <div className="text-center">
                  <div
                    className="mb-2 text-4xl font-bold"
                    style={{ color: '#8B5CF6' }}
                  >
                    {avgRating.toFixed(1)}
                  </div>
                  {renderStars(avgRating, true)}
                  <p className="mt-2 text-sm text-gray-500">
                    {totalFeedback} đánh giá
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const index = star - 1;
                    const count = distribution[index];
                    const percent = starPercentages[index];
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-6 text-sm font-medium text-gray-700">
                          {star}
                        </span>
                        <CustomStar filled={true} size="w-4 h-4" />
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: '#8B5CF6'
                            }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm text-gray-500">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <CustomStar filled={false} size="w-12 h-12" />
                <p className="mt-3 text-gray-500">Chưa có đánh giá nào</p>
              </div>
            )}

            {/* Add Review Button - only show if user has participated and hasn't left feedback */}
            {publisherStatus === 'Participated' && !hasUserFeedback && (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={openModal}
                className="group relative mt-6 w-full overflow-hidden rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{
                  background:
                    'linear-gradient(to right, #8B5CF6, #A855F7, #C084FC)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(to right, #7C3AED, #9333EA, #A855F7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(to right, #8B5CF6, #A855F7, #C084FC)';
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Viết đánh giá của bạn
                  <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            )}

            {/* Show different messages based on status and feedback */}
            {publisherStatus !== 'Participated' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mt-6 overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-slate-100/50"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-800">
                      Cần tham gia chiến dịch để đánh giá
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {publisherStatus === 'Participated' && hasUserFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mt-6 overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-green-800">
                      Cảm ơn bạn đã đánh giá!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Reviews List Section */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Tất cả đánh giá ({displayedFeedbacks.length})
              </h2>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value as 'newest' | 'oldest')
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all"
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #8B5CF6';
                    e.target.style.borderColor = '#8B5CF6';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                    e.target.style.borderColor = '#D1D5DB';
                  }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>

                <select
                  value={starFilter}
                  onChange={(e) => setStarFilter(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all"
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #8B5CF6';
                    e.target.style.borderColor = '#8B5CF6';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                    e.target.style.borderColor = '#D1D5DB';
                  }}
                >
                  <option value={0}>Tất cả sao</option>
                  <option value={5}>5 sao</option>
                  <option value={4}>4 sao</option>
                  <option value={3}>3 sao</option>
                  <option value={2}>2 sao</option>
                  <option value={1}>1 sao</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            {currentFeedbacks.length === 0 ? (
              <div className="py-12 text-center">
                <CustomStar filled={false} size="w-12 h-12" />
                <p className="mt-3 text-gray-500">
                  Không có đánh giá nào phù hợp với bộ lọc
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentFeedbacks.map((feedback, index) => {
                  const authorName =
                    feedback.feedbacker?.applicationUser?.fullName ||
                    'Người dùng ẩn danh';
                  const avatarURL =
                    feedback.feedbacker?.applicationUser?.userDetail?.avatarURL;
                  const isMyFeedback =
                    feedback.feedbacker?.userId === PUBLISHER_ID;

                  return (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {avatarURL ? (
                            <img
                              src={avatarURL}
                              alt={authorName}
                              className="h-12 w-12 rounded-full border-2 object-cover"
                              style={{ borderColor: '#C084FC' }}
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextSibling) {
                                  (
                                    e.currentTarget.nextSibling as HTMLElement
                                  ).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${avatarURL ? 'hidden' : ''}`}
                            style={{ backgroundColor: '#C084FC' }}
                          >
                            <span className="text-sm font-medium text-white">
                              {getInitials(authorName)}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="mb-2 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {authorName}
                              </h4>
                              <div className="mt-1 flex items-center gap-2">
                                {renderStars(feedback.starRate)}
                                <span className="text-sm text-gray-500">
                                  {formatDate(feedback.timestamp)}
                                </span>
                              </div>
                            </div>

                            {isMyFeedback && (
                              <button
                                onClick={() => openEditModal(feedback)}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <p className="leading-relaxed text-gray-700">
                            {feedback.description}
                          </p>

                          {isMyFeedback && (
                            <div className="mt-3">
                              <span
                                className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white"
                                style={{ backgroundColor: '#8B5CF6' }}
                              >
                                Đánh giá của bạn
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.borderColor = '#8B5CF6';
                      e.currentTarget.style.color = '#8B5CF6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.color = '#6B7280';
                    }
                  }}
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Trước
                </motion.button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(idx + 1)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        currentPage === idx + 1
                          ? 'text-white shadow-lg'
                          : 'border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50'
                      }`}
                      style={
                        currentPage === idx + 1
                          ? {
                              background:
                                'linear-gradient(to right, #8B5CF6, #A855F7)'
                            }
                          : {}
                      }
                      onMouseEnter={(e) => {
                        if (currentPage !== idx + 1) {
                          e.currentTarget.style.backgroundColor = '#F3F4F6';
                          e.currentTarget.style.borderColor = '#8B5CF6';
                          e.currentTarget.style.color = '#8B5CF6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== idx + 1) {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.color = '#6B7280';
                        }
                      }}
                    >
                      {idx + 1}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.borderColor = '#8B5CF6';
                      e.currentTarget.style.color = '#8B5CF6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.color = '#6B7280';
                    }
                  }}
                >
                  Sau
                  <ArrowRight className="ml-1 h-4 w-4" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div
              className="px-6 py-4"
              style={{
                background: 'linear-gradient(to right, #8B5CF6, #A855F7)'
              }}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Đánh giá chiến dịch
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: '#DDD6FE' }}>
                    Chia sẻ trải nghiệm của bạn với chúng tôi
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Star Rating Section */}
              <div className="mb-6">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <CustomStar filled={true} size="w-4 h-4" />
                  Bạn đánh giá chiến dịch này như thế nào?
                </label>
                <div className="flex items-center justify-center gap-4 rounded-xl bg-gray-50 p-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-xl p-2 transition-all duration-200 hover:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                    >
                      <CustomStar filled={star <= newRating} size="w-12 h-12" />
                    </motion.button>
                  ))}
                </div>
                {newRating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    <RatingFeedback rating={newRating} />
                  </motion.div>
                )}
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  Chi tiết đánh giá
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Hãy chia sẻ chi tiết về trải nghiệm của bạn với chiến dịch này. Điều gì làm bạn ấn tượng? Có gì cần cải thiện không?"
                    className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 placeholder-gray-400 transition-all"
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 2px #8B5CF6';
                      e.target.style.borderColor = '#8B5CF6';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#E5E7EB';
                    }}
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {newContent.length}/500
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Hủy bỏ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitReview}
                  disabled={isCreating || newRating === 0 || !newContent.trim()}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background:
                      isCreating || newRating === 0 || !newContent.trim()
                        ? '#9CA3AF'
                        : 'linear-gradient(to right, #8B5CF6, #A855F7)'
                  }}
                  onMouseEnter={(e) => {
                    if (
                      !(isCreating || newRating === 0 || !newContent.trim())
                    ) {
                      e.currentTarget.style.background =
                        'linear-gradient(to right, #7C3AED, #9333EA)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (
                      !(isCreating || newRating === 0 || !newContent.trim())
                    ) {
                      e.currentTarget.style.background =
                        'linear-gradient(to right, #8B5CF6, #A855F7)';
                    }
                  }}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang gửi...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Gửi đánh giá
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Feedback Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Gradient Header */}
            <div
              className="relative overflow-hidden px-6 py-8 text-white"
              style={{
                background:
                  'linear-gradient(to right, #059669, #10B981, #14B8A6)'
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))'
                }}
              ></div>
              <div className="relative flex items-center gap-3">
                <Edit className="h-6 w-6 text-white" />
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Chỉnh sửa đánh giá
                  </h3>
                  <p className="text-sm" style={{ color: '#A7F3D0' }}>
                    Cập nhật trải nghiệm của bạn
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Star Rating */}
              <div className="mb-8">
                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <CustomStar filled={true} size="w-4 h-4" />
                  Cập nhật đánh giá
                </label>
                <div className="flex items-center justify-center gap-4 py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setEditingStarRate(star)}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-xl p-2 transition-all duration-200 hover:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                    >
                      <CustomStar
                        filled={star <= editingStarRate}
                        size="w-12 h-12"
                      />
                    </motion.button>
                  ))}
                </div>
                {/* Rating Feedback */}
                <div className="mt-2 text-center">
                  {editingStarRate > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-medium"
                    >
                      <RatingFeedback
                        rating={editingStarRate}
                        className="text-sm font-medium"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  Cập nhật nội dung
                </label>
                <div className="relative">
                  <textarea
                    rows={5}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    maxLength={500}
                    placeholder="Cập nhật trải nghiệm của bạn về chiến dịch này. Có gì thay đổi trong đánh giá không?"
                    className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-500 transition-all duration-200"
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 0 0 2px #10B981';
                      e.target.style.borderColor = '#10B981';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = '#F9FAFB';
                      e.target.style.boxShadow = '';
                      e.target.style.borderColor = '#E5E7EB';
                    }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {editingContent.length}/500
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeEditModal}
                  className="flex-1 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                >
                  Hủy bỏ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateFeedback}
                  disabled={
                    isUpdating ||
                    editingStarRate === 0 ||
                    !editingContent.trim()
                  }
                  className="flex-1 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background:
                      isUpdating ||
                      editingStarRate === 0 ||
                      !editingContent.trim()
                        ? '#9CA3AF'
                        : 'linear-gradient(to right, #059669, #10B981)'
                  }}
                  onMouseEnter={(e) => {
                    if (
                      !(
                        isUpdating ||
                        editingStarRate === 0 ||
                        !editingContent.trim()
                      )
                    ) {
                      e.currentTarget.style.background =
                        'linear-gradient(to right, #047857, #059669)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (
                      !(
                        isUpdating ||
                        editingStarRate === 0 ||
                        !editingContent.trim()
                      )
                    ) {
                      e.currentTarget.style.background =
                        'linear-gradient(to right, #059669, #10B981)';
                    }
                  }}
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang cập nhật...
                    </span>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="h-4 w-4" />
                      Cập nhật đánh giá
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
