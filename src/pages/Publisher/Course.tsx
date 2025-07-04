import { useState } from 'react';
import BasePages from '@/components/shared/base-pages';
import PageHead from '@/components/shared/page-head';
import { useGetAllCourses, useGetAllCoursesJoin } from '@/queries/course.query';
import { useJoinCourse } from '@/queries/course.query'; // Import the new hook
import PaginationSection from '@/components/shared/pagination-section';
import {
  Grid,
  List,
  Star,
  Clock,
  ShoppingCart,
  Search,
  Sparkles,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Play
} from 'lucide-react';
import Loading from '@/components/ui/loading';
import { CourseResponse } from '@/types';
import VideoCoursePage from './VideoCourse';

// Toast notification component
const Toast = ({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
  <div
    className={`fixed right-4 top-4 z-[100] flex items-center space-x-3 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-sm duration-300 animate-in slide-in-from-top-2 ${
      type === 'success'
        ? 'bg-emerald-500/90 text-white'
        : 'bg-red-500/90 text-white'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle className="h-5 w-5" />
    ) : (
      <AlertCircle className="h-5 w-5" />
    )}
    <span className="font-medium">{message}</span>
    <button
      onClick={onClose}
      className="ml-2 text-white/80 transition-colors hover:text-white"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= Math.floor(rating) || star - 0.5 <= rating
            ? 'fill-amber-400 text-amber-400'
            : 'text-gray-300'
        }`}
      />
    ))}
    <span className="ml-2 text-sm font-semibold text-amber-500">
      {(rating || 0).toFixed(1)}
    </span>
  </div>
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

type CourseDetailProps = {
  course: CourseResponse;
  onClose: () => void;
  onJoinCourse?: (courseId: number) => void;
  onStartLearning?: (courseId: number) => void; // Added this prop
  isJoining?: boolean;
  isJoined?: boolean;
};

const CourseDetail = ({
  course,
  onClose,
  onJoinCourse,
  onStartLearning, // Added this prop
  isJoining = false,
  isJoined = false
}: CourseDetailProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm duration-300 animate-in fade-in">
    <PageHead title="ClickFlow – Chi tiết khóa học" />

    <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-300 animate-in slide-in-from-bottom-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-gray-900"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* HEADER: không cuộn */}
      <div className="relative flex-none bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-8 pb-8 pt-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative">
          <div className="mb-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">ID: {course.id}</span>
            </div>
            {isJoined && (
              <div className="flex items-center space-x-1 rounded-full bg-emerald-500/90 px-3 py-1 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Đã đăng ký</span>
              </div>
            )}
          </div>
          <h2 className="mb-4 text-4xl font-bold leading-tight">
            {course.title}
          </h2>
          <div className="mb-6 flex items-center space-x-6">
            <StarRating rating={course.avgRate} />
            <div className="flex items-center space-x-2 text-white/90">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Tạo: {formatDate(course.createAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold">
              {course.price.toLocaleString()}₫
            </span>
          </div>
        </div>
      </div>

      {/* BODY: chỉ phần này cuộn */}
      <div className="flex-1 overflow-y-auto bg-white p-8">
        {/* Action buttons */}
        {!isJoined && onJoinCourse && (
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => onJoinCourse(course.id)}
              disabled={isJoining}
              className="flex transform items-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isJoining ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              <span>{isJoining ? 'Đang xử lý...' : 'Mua khóa học ngay'}</span>
            </button>
          </div>
        )}

        {isJoined && onStartLearning && (
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              className="flex transform items-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
              onClick={() => {
                onStartLearning(course.id);
                onClose(); // Close modal when starting to learn
              }}
            >
              <Play className="h-5 w-5" />
              <span>Bắt đầu học</span>
            </button>
          </div>
        )}

        {/* Content sections */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8">
              <h3 className="mb-4 flex items-center text-2xl font-bold text-gray-900">
                <div className="mr-4 h-8 w-1 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500" />
                Mô tả khóa học
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {course.description}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8">
              <h3 className="mb-4 flex items-center text-2xl font-bold text-gray-900">
                <div className="mr-4 h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                Nội dung giáo trình
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {course.content}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8">
              <h3 className="mb-4 flex items-center text-2xl font-bold text-gray-900">
                <div className="mr-4 h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                Bài học đã học được
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {course.lessonLearned}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6">
              <h4 className="mb-4 font-bold text-gray-900">
                Thông tin khóa học:
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Mã khóa học:</span>
                  <span className="font-semibold text-gray-900">
                    #{course.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đánh giá:</span>
                  <span className="font-semibold text-gray-900">
                    {course.avgRate}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tạo bởi ID:</span>
                  <span className="font-semibold text-gray-900">
                    {course.createById}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cập nhật:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(course.updateAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Kết thúc BODY */}
    </div>
  </div>
);

const UdemyBody = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'available' | 'joined'>(
    'available'
  );
  const [selectedCourseForVideo, setSelectedCourseForVideo] = useState<
    number | null
  >(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Separate queries for available and joined courses
  const {
    data: availableCoursesResponse,
    isLoading: isLoadingAvailable,
    isError: isErrorAvailable
  } = useGetAllCourses(currentPage);

  const {
    data: joinedCoursesResponse,
    isLoading: isLoadingJoined,
    isError: isErrorJoined
  } = useGetAllCoursesJoin(currentPage);

  const { mutateAsync: joinCourse, isPending } = useJoinCourse();

  // Get current data based on active tab
  const currentApiResponse =
    activeTab === 'available'
      ? availableCoursesResponse
      : joinedCoursesResponse;
  const isLoading =
    activeTab === 'available' ? isLoadingAvailable : isLoadingJoined;
  const isError = activeTab === 'available' ? isErrorAvailable : isErrorJoined;

  const courses = currentApiResponse?.result?.datas || [];
  const totalItems = currentApiResponse?.result?.totalItems || 0;
  const postsPerPage = 10;

  const filteredCourses = courses.filter((course: CourseResponse) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCourse = async (courseId: number) => {
    try {
      await joinCourse(courseId);
      setToast({
        message: 'Đăng ký khóa học thành công! Chúc bạn học tập hiệu quả.',
        type: 'success'
      });
      // Close modal after successful purchase
      setSelectedCourse(null);
    } catch (error) {
      setToast({
        message: 'Có lỗi xảy ra khi đăng ký khóa học. Vui lòng thử lại.',
        type: 'error'
      });
    }
  };

  const handleQuickJoin = async (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    await handleJoinCourse(courseId);
  };

  // Updated handleStartLearning function
  const handleStartLearning = (courseId: number) => {
    setSelectedCourseForVideo(courseId);
    setSelectedCourse(null); // Close course detail modal if open
  };

  const handleBackToCourses = () => {
    setSelectedCourseForVideo(null);
  };

  // Reset to page 1 when switching tabs
  const handleTabChange = (tab: 'available' | 'joined') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const renderCourseCard = (
    course: CourseResponse,
    isJoined: boolean = false
  ) => (
    <div
      key={course.id}
      className="group relative flex transform cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl"
      onClick={() => setSelectedCourse(course)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedCourse(course);
        }
      }}
    >
      {/* Course Image Placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute right-4 top-4 flex space-x-2">
          <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-purple-700 backdrop-blur-sm">
            #{course.id}
          </div>
          {isJoined && (
            <div className="rounded-full bg-emerald-500/90 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center text-sm text-white/90">
            <Clock className="mr-1 h-4 w-4" />
            <span>{formatDate(course.createAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 h-12 text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-700">
          {course.title}
        </h3>

        <div className="mb-3 flex items-center">
          <StarRating rating={course.avgRate} />
        </div>

        <p className="mb-4 line-clamp-2 h-10 text-sm text-gray-600">
          {course.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="ml-1 text-lg font-bold text-purple-600">
            {course.price.toLocaleString()}₫
          </span>
          {isJoined ? (
            <button
              className="flex transform items-center space-x-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
              onClick={(e) => {
                e.stopPropagation();
                handleStartLearning(course.id);
              }}
            >
              <Play className="h-4 w-4" />
              <span>Học ngay</span>
            </button>
          ) : (
            <button
              className="flex transform items-center space-x-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-indigo-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              onClick={(e) => handleQuickJoin(e, course.id)}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Mua ngay</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderCourseList = (
    course: CourseResponse,
    isJoined: boolean = false
  ) => (
    <div
      key={course.id}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-lg"
      onClick={() => setSelectedCourse(course)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setSelectedCourse(course);
        }
      }}
    >
      <div className="flex flex-col p-6 md:flex-row">
        {/* Course Image */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 md:w-80">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute left-4 top-4 flex space-x-2">
            <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-purple-700 backdrop-blur-sm">
              ID: {course.id}
            </div>
            {isJoined && (
              <div className="rounded-full bg-emerald-500/90 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                <CheckCircle className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="text-sm text-white/90">
              Tạo bởi: #{course.createById}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 line-clamp-2 h-10 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-700">
            {course.title}
          </h3>

          <div className="mb-3 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>Tạo: {formatDate(course.createAt)}</span>
            </div>
            <div className="flex items-center">
              <span>Cập nhật: {formatDate(course.updateAt)}</span>
            </div>
          </div>

          <div className="mb-3 flex items-center">
            <StarRating rating={course.avgRate} />
          </div>

          <p className="mb-4 line-clamp-2 h-10 text-gray-600">
            {course.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-bold text-purple-600">
              {course.price.toLocaleString()}₫
            </span>
            {isJoined ? (
              <button
                className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartLearning(course.id);
                }}
              >
                <Play className="h-5 w-5" />
                <span>Học ngay</span>
              </button>
            ) : (
              <button
                className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-purple-700 hover:to-indigo-700 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={(e) => handleQuickJoin(e, course.id)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                <span>{isPending ? 'Đang xử lý...' : 'Mua khóa học'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BasePages pageHead="ClickFlow - Khóa học">
      {/* Show VideoCoursePage if a course is selected for learning */}
      {selectedCourseForVideo ? (
        <VideoCoursePage
          courseId={selectedCourseForVideo}
          onBack={handleBackToCourses}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          {isLoading && <Loading />}

          {/* Toast notification */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          {isError && (
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">😕</div>
                <span className="text-lg text-gray-600">
                  Đã xảy ra lỗi khi tải danh sách khóa học.
                </span>
              </div>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {/* Hero Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
                <div className="bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22 %3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] absolute inset-0 opacity-20" />

                <div className="relative px-6 py-24 sm:py-24">
                  <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 backdrop-blur-sm">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                        <span className="font-semibold text-white">
                          Học tập không giới hạn
                        </span>
                      </div>
                    </div>
                    <h1 className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl">
                      Nâng cao
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        {' '}
                        kỹ năng{' '}
                      </span>
                      của bạn
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-purple-100">
                      Khám phá các khóa học chất lượng cao từ các chuyên gia.
                      Học mọi lúc, mọi nơi với nội dung được cập nhật liên tục.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <button className="transform rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-yellow-500 hover:to-orange-500 hover:shadow-xl">
                        Bắt đầu học ngay
                      </button>
                      <button className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20">
                        Tìm hiểu thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="sticky top-0 z-40 border-b border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-6">
                  <div className="flex items-center justify-between py-4">
                    {/* Tabs */}
                    <div className="flex space-x-1 rounded-2xl bg-gray-100 p-1">
                      <button
                        onClick={() => handleTabChange('available')}
                        className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-all duration-200 ${
                          activeTab === 'available'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="font-medium">Khóa học có sẵn</span>
                      </button>
                      <button
                        onClick={() => handleTabChange('joined')}
                        className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-all duration-200 ${
                          activeTab === 'joined'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span className="font-medium">Khóa học của tôi</span>
                      </button>
                    </div>

                    {/* View Mode Switcher */}
                    <div className="flex rounded-2xl bg-gray-100 p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="pb-4">
                    <div className="relative max-w-2xl">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Tìm kiếm khóa học theo tên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Section */}
              <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {activeTab === 'available'
                        ? 'Khóa học dành cho bạn'
                        : 'Khóa học của tôi'}
                    </h2>
                    <p className="mt-2 text-gray-600">
                      {filteredCourses.length} khóa học được tìm thấy
                    </p>
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 text-6xl">
                        {activeTab === 'available' ? '📚' : '🎓'}
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        {activeTab === 'available'
                          ? 'Không tìm thấy khóa học nào'
                          : 'Bạn chưa đăng ký khóa học nào'}
                      </h3>
                      <p className="text-gray-600">
                        {activeTab === 'available'
                          ? 'Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại kết nối mạng.'
                          : 'Hãy khám phá và đăng ký các khóa học thú vị để bắt đầu hành trình học tập của bạn!'}
                      </p>
                      {activeTab === 'joined' && (
                        <button
                          onClick={() => handleTabChange('available')}
                          className="mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-purple-700 hover:to-indigo-700"
                        >
                          Khám phá khóa học
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCourses.map((course: CourseResponse) =>
                          renderCourseCard(course, activeTab === 'joined')
                        )}
                      </div>
                    ) : (
                      <div className="mb-10 space-y-6">
                        {filteredCourses.map((course: CourseResponse) =>
                          renderCourseList(course, activeTab === 'joined')
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Pagination */}
                {totalItems > postsPerPage && filteredCourses.length > 0 && (
                  <div className="mt-12 flex justify-center">
                    <PaginationSection
                      totalPosts={totalItems}
                      postsPerPage={postsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </div>

              {/* Course Detail Modal */}
              {selectedCourse && (
                <CourseDetail
                  course={selectedCourse}
                  onClose={() => setSelectedCourse(null)}
                  onJoinCourse={
                    activeTab === 'available' ? handleJoinCourse : undefined
                  }
                  onStartLearning={
                    activeTab === 'joined' ? handleStartLearning : undefined
                  }
                  isJoining={isPending}
                  isJoined={activeTab === 'joined'}
                />
              )}
            </>
          )}
        </div>
      )}
    </BasePages>
  );
};

export default UdemyBody;
