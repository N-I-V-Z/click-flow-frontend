import React, { useState } from 'react';
import {
  useGetFeedbacksByCampaign,
  useCreateFeedback,
  useUpdateFeedback
} from '@/queries/feedback.query';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiMoreVertical } from 'react-icons/fi'; // Icon ba chấm
import { IFeedback } from '@/types/index';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';
const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
// PublisherId lấy từ token (hoặc từ context, store,...)
const PUBLISHER_ID =
  decodedToken?.Id !== undefined ? parseInt(decodedToken?.Id) : 0;
/** Tính phân bố sao (trả về [count1, count2, count3, count4, count5]) */
function computeStarDistribution(feedbacks: IFeedback[]) {
  const distribution = [0, 0, 0, 0, 0];
  feedbacks.forEach((fb) => {
    if (fb.starRate >= 1 && fb.starRate <= 5) {
      distribution[fb.starRate - 1]++;
    }
  });

  return distribution;
}

const Feedback: React.FC<{ campaignId: number }> = ({ campaignId }) => {
  // Lấy danh sách feedback
  const {
    data: feedbackData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetFeedbacksByCampaign(campaignId, 1, 50);

  // Tạo mới feedback
  const { mutateAsync: createFeedback, isLoading: isCreating } =
    useCreateFeedback();

  // Cập nhật feedback
  const { mutateAsync: updateFeedback, isLoading: isUpdating } =
    useUpdateFeedback();

  // State Modal tạo mới feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newContent, setNewContent] = useState<string>('');

  // State Modal sửa feedback
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<number | null>(
    null
  );
  const [editingStarRate, setEditingStarRate] = useState<number>(0);
  const [editingContent, setEditingContent] = useState<string>('');

  // Bộ lọc
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [starFilter, setStarFilter] = useState<number>(0);

  // Phân trang cục bộ
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-center text-gray-500">
        <AiOutlineLoading3Quarters className="mr-2 animate-spin" />
        Đang tải feedback...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-red-500 p-4 text-center">
        Lỗi khi tải feedback: {(error as Error).message}
      </div>
    );
  }

  // Danh sách feedback sau khi load
  const feedbacks = feedbackData || [];
  const totalFeedback = feedbacks.length;
  const avgRating = totalFeedback
    ? feedbacks.reduce((sum, fb) => sum + fb.starRate, 0) / totalFeedback
    : 0;

  const distribution = computeStarDistribution(feedbacks);
  const starPercentages = distribution.map((count) =>
    totalFeedback > 0 ? Math.round((count / totalFeedback) * 100) : 0
  );

  // Lọc theo sao
  let displayedFeedbacks = [...feedbacks];
  if (starFilter > 0) {
    displayedFeedbacks = displayedFeedbacks.filter(
      (fb) => fb.starRate === starFilter
    );
  }

  // Sắp xếp theo newest/oldest
  displayedFeedbacks.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Phân trang
  const totalPages = Math.ceil(displayedFeedbacks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = displayedFeedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  /** Render các ngôi sao */
  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const fillColor = starValue <= rating ? '#fbbf24' : 'none';
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill={fillColor}
            viewBox="0 0 24 24"
            stroke="#fbbf24"
            className="mr-1 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={starValue <= rating ? 2 : 1}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 
                0l1.286 3.966a1 1 0 00.95.69h4.184c.969 
                0 1.371 1.24.588 1.81l-3.39 
                2.463a1 1 0 00-.363 1.118l1.296 
                3.993c.285.877-.722 1.601-1.487 
                1.073l-3.365-2.452a1 1 0 
                00-1.176 0l-3.365 2.452c-.765.528-1.772-.196-1.487-1.073l1.296-3.993a1 
                1 0 00-.363-1.118L2.78 9.393c-.783-.57-.38-1.81.588-1.81h4.184a1 
                1 0 00.95-.69l1.286-3.966z"
            />
          </svg>
        );
      })}
    </div>
  );

  /** Mở modal tạo feedback */
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewRating(0);
    setNewContent('');
  };

  /** Submit tạo feedback */
  const handleSubmitReview = async () => {
    if (newRating === 0 || !newContent.trim()) {
      alert('Vui lòng chọn số sao và nhập nội dung đánh giá!');
      return;
    }
    try {
      await createFeedback({
        campaignId,
        starRate: newRating,
        description: newContent
      });
      await refetch();
      closeModal();
    } catch (err: any) {
      alert(`Tạo feedback thất bại: ${err.message}`);
    }
  };

  /** Mở modal sửa feedback */
  const openEditModal = (fb: IFeedback) => {
    setEditingFeedbackId(fb.id);
    setEditingStarRate(fb.starRate);
    setEditingContent(fb.description);
    setEditModalOpen(true);
  };

  /** Đóng modal sửa feedback */
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingFeedbackId(null);
    setEditingStarRate(0);
    setEditingContent('');
  };

  /** Submit cập nhật feedback */
  const handleEditSubmit = async () => {
    if (editingStarRate === 0 || !editingContent.trim()) {
      alert('Vui lòng chọn số sao và nhập nội dung đánh giá!');
      return;
    }
    try {
      await updateFeedback({
        id: editingFeedbackId!,
        description: editingContent,
        starRate: editingStarRate
      });
      await refetch();
      closeEditModal();
    } catch (err: any) {
      alert(`Cập nhật feedback thất bại: ${err.message}`);
    }
  };

  /** Chuyển trang */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* 2 cột: Thống kê & Danh sách feedback */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Cột trái: Thống kê */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Đánh giá của Publisher</h2>
          {totalFeedback > 0 ? (
            <div className="mb-2 flex items-center">
              <span className="mr-3 text-4xl font-bold text-gray-700">
                {avgRating.toFixed(1)}
              </span>
              <div className="flex flex-col">
                <div className="text-sm text-purple-600">
                  {totalFeedback} đánh giá
                </div>
                <div className="flex">{renderStars(Math.round(avgRating))}</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Chưa có đánh giá.</p>
          )}

          {/* Biểu đồ cột: 5 -> 1 sao */}
          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const index = star - 1; // 0..4
              const percent = starPercentages[index];
              return (
                <div key={star} className="flex items-center">
                  <span className="w-6 text-sm font-medium text-gray-700">
                    {star}
                  </span>
                  <div className="mx-2 h-2 flex-1 rounded bg-gray-200">
                    <div
                      className="h-2 rounded bg-purple-600"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{percent}%</span>
                </div>
              );
            })}
          </div>

          {/* Nút "Đánh giá ngay" */}
          <div className="mt-6">
            <button
              onClick={openModal}
              className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Đánh giá ngay
            </button>
          </div>
        </div>

        {/* Cột phải: Danh sách feedback */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Các đánh giá</h2>

          {/* Bộ lọc (sort + star) */}
          <div className="mb-4 flex items-center space-x-4">
            {/* Sắp xếp */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Sắp xếp:
              </label>
              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(e.target.value as 'newest' | 'oldest')
                }
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
            {/* Lọc sao */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Lọc sao:
              </label>
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(Number(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value={0}>Tất cả</option>
                <option value={5}>5 sao</option>
                <option value={4}>4 sao</option>
                <option value={3}>3 sao</option>
                <option value={2}>2 sao</option>
                <option value={1}>1 sao</option>
              </select>
            </div>
          </div>

          {currentFeedbacks.length === 0 ? (
            <p className="text-gray-500">Không có feedback nào phù hợp.</p>
          ) : (
            <div className="space-y-6">
              {currentFeedbacks.map((fb) => {
                const authorName =
                  fb.feedbacker?.applicationUser?.fullName || 'Unknown';
                const dateStr = new Date(fb.timestamp).toLocaleString();
                return (
                  <div key={fb.id} className="border-b border-gray-200 pb-4">
                    <div className="mb-1">{renderStars(fb.starRate)}</div>
                    <p className="mb-2 text-gray-700">{fb.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {authorName} • {dateStr}
                      </span>
                      {/* Nếu userId = 3 thì cho chỉnh sửa */}
                      {fb.feedbacker?.userId === PUBLISHER_ID && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(fb);
                          }}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <FiMoreVertical size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Phân trang cục bộ */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`rounded border px-3 py-1 ${
                    currentPage === idx + 1 ? 'bg-purple-600 text-white' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tạo feedback */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay mờ */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={closeModal}
          />
          {/* Nội dung modal */}
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">Đánh giá chiến dịch</h3>
            {/* Chọn số sao */}
            <div className="mb-4 flex items-center">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setNewRating(starValue)}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={starValue <= newRating ? '#fbbf24' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="#fbbf24"
                      className="mr-1 h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={starValue <= newRating ? 2 : 1}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 
                            0l1.286 3.966a1 1 0 00.95.69h4.184c.969 
                            0 1.371 1.24.588 1.81l-3.39 
                            2.463a1 1 0 00-.363 1.118l1.296 
                            3.993c.285.877-.722 1.601-1.487 
                            1.073l-3.365-2.452a1 1 0 
                            00-1.176 0l-3.365 2.452c-.765.528-1.772-.196-1.487-1.073l1.296-3.993a1 
                            1 0 00-.363-1.118L2.78 9.393c-.783-.57-.38-1.81.588-1.81h4.184a1 
                            1 0 00.95-.69l1.286-3.966z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
            {/* Nội dung đánh giá */}
            <textarea
              className="mb-4 h-24 w-full rounded border border-gray-300 p-2"
              placeholder="Bạn cảm thấy thế nào về chiến dịch này..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            {/* Nút hành động */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Từ chối
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isCreating}
                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {isCreating ? 'Đang gửi...' : 'Đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sửa feedback */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay mờ */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={closeEditModal}
          />
          {/* Nội dung modal */}
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">Chỉnh sửa đánh giá</h3>
            {/* Chọn số sao */}
            <div className="mb-4 flex items-center">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setEditingStarRate(starValue)}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={starValue <= editingStarRate ? '#fbbf24' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="#fbbf24"
                      className="mr-1 h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={starValue <= editingStarRate ? 2 : 1}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 
                            0l1.286 3.966a1 1 0 00.95.69h4.184c.969 
                            0 1.371 1.24.588 1.81l-3.39 
                            2.463a1 1 0 00-.363 1.118l1.296 
                            3.993c.285.877-.722 1.601-1.487 
                            1.073l-3.365-2.452a1 1 0 
                            00-1.176 0l-3.365 2.452c-.765.528-1.772-.196-1.487-1.073l1.296-3.993a1 
                            1 0 00-.363-1.118L2.78 9.393c-.783-.57-.38-1.81.588-1.81h4.184a1 
                            1 0 00.95-.69l1.286-3.966z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
            {/* Nội dung đánh giá */}
            <textarea
              className="mb-4 h-24 w-full rounded border border-gray-300 p-2"
              placeholder="Nội dung đánh giá..."
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
            />
            {/* Nút hành động */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isUpdating}
                className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
