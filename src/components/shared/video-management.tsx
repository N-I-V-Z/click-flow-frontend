import React, { useState } from 'react';
import { Modal, Form, Input, message, Tooltip } from 'antd';
import {
  VideoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  LinkOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import {
  useGetVideoCourses,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo
} from '@/queries/video.query';
import { CreateVideoPayload, UpdateVideoPayload } from '@/types';

interface VideoManagementProps {
  courseId: number;
  courseName: string;
  onClose: () => void;
}

interface VideoItem {
  id: number;
  title: string;
  link: string;
  createdAt?: string;
}

const VideoManagement: React.FC<VideoManagementProps> = ({
  courseId,
  courseName,
  onClose
}) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // API hooks
  const {
    data: videosResponse,
    isLoading,
    refetch
  } = useGetVideoCourses(courseId);
  const createVideoMutation = useCreateVideo();
  const updateVideoMutation = useUpdateVideo();
  const deleteVideoMutation = useDeleteVideo();

  const videos = Array.isArray(videosResponse?.result)
    ? videosResponse.result
    : [];

  // Handlers for Add Video
  const handleAddVideo = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const handleAddVideoSubmit = async (
    values: Omit<CreateVideoPayload, 'courseId'>
  ) => {
    try {
      await createVideoMutation.mutateAsync({
        ...values,
        courseId
      });
      message.success('Thêm video thành công!');
      setIsAddModalVisible(false);
      addForm.resetFields();
      refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm video!');
      console.error('Add video error:', error);
    }
  };

  // Handlers for Edit Video
  const handleEditVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      title: video.title,
      link: video.link
    });
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedVideo(null);
    editForm.resetFields();
  };

  const handleEditVideoSubmit = async (values: UpdateVideoPayload) => {
    if (!selectedVideo) return;

    try {
      await updateVideoMutation.mutateAsync({
        videoId: selectedVideo.id,
        ...values
      });
      message.success('Cập nhật video thành công!');
      setIsEditModalVisible(false);
      setSelectedVideo(null);
      editForm.resetFields();
      refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật video!');
      console.error('Update video error:', error);
    }
  };

  // Handlers for Delete Video
  const handleDeleteVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedVideo(null);
  };

  const handleDeleteVideoConfirm = async () => {
    if (!selectedVideo) return;

    try {
      await deleteVideoMutation.mutateAsync(selectedVideo.id);
      message.success('Xóa video thành công!');
      setIsDeleteModalVisible(false);
      setSelectedVideo(null);
      refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa video!');
      console.error('Delete video error:', error);
    }
  };

  // Format YouTube link for preview
  const getVideoId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = getVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      : null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-8 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
          >
            ×
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <VideoCameraOutlined className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quản lý Video</h2>
              <p className="text-purple-100">
                {courseName} • {videos.length} video
              </p>
            </div>
          </div>

          <button
            onClick={handleAddVideo}
            className="absolute right-20 top-6 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
          >
            <PlusOutlined />
            <span>Thêm video</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <VideoCameraOutlined className="animate-pulse text-2xl text-purple-400" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Đang tải video...
                </h3>
                <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="max-w-md text-center">
                <div className="relative mb-8">
                  <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200">
                      <VideoCameraOutlined className="text-4xl text-purple-600" />
                    </div>
                  </div>
                  {/* Floating animation elements */}
                  <div className="absolute left-1/2 top-4 -translate-x-1/2 transform animate-bounce">
                    <div className="h-3 w-3 rounded-full bg-purple-300 opacity-60"></div>
                  </div>
                  <div className="absolute right-8 top-8 animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 opacity-40"></div>
                  </div>
                  <div className="absolute bottom-8 left-8 animate-pulse delay-300">
                    <div className="h-2 w-2 rounded-full bg-blue-400 opacity-40"></div>
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Chưa có video nào
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Hãy bắt đầu xây dựng khóa học của bạn bằng cách thêm video đầu
                  tiên. Video sẽ giúp học viên hiểu rõ hơn về nội dung bài học.
                </p>
                <button
                  onClick={handleAddVideo}
                  className="inline-flex items-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
                >
                  <PlusOutlined className="mr-3 text-lg" />
                  Thêm video đầu tiên
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video: VideoItem, index: number) => {
                const thumbnailUrl = getThumbnailUrl(video.link);
                return (
                  <div
                    key={video.id}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 p-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="h-full w-full rounded-3xl bg-white"></div>
                    </div>

                    <div className="relative">
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-200">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100">
                            <div className="text-center">
                              <PlayCircleOutlined className="mb-2 text-5xl text-purple-400" />
                              <p className="text-sm font-medium text-purple-600">
                                Video Preview
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Enhanced Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <button
                            onClick={() => window.open(video.link, '_blank')}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
                          >
                            <PlayCircleOutlined className="text-2xl" />
                          </button>
                        </div>

                        {/* Video number badge */}
                        <div className="absolute left-4 top-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white backdrop-blur-sm">
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Video Info */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3
                            className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-purple-600"
                            title={video.title}
                          >
                            {video.title}
                          </h3>

                          {video.createdAt && (
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200">
                                <ClockCircleOutlined className="text-xs" />
                              </div>
                              <span className="font-medium">
                                {new Date(video.createdAt).toLocaleDateString(
                                  'vi-VN',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Enhanced Action Section */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                          <a
                            href={video.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 transition-all duration-200 hover:bg-purple-100 hover:text-purple-800"
                          >
                            <LinkOutlined className="mr-1.5 text-xs" />
                            Xem video
                          </a>

                          <div className="flex gap-2">
                            <Tooltip title="Chỉnh sửa video" placement="top">
                              <button
                                onClick={() => handleEditVideo(video)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-amber-100 hover:shadow-md"
                              >
                                <EditOutlined className="text-sm" />
                              </button>
                            </Tooltip>

                            <Tooltip title="Xóa video" placement="top">
                              <button
                                onClick={() => handleDeleteVideo(video)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-100 hover:shadow-md"
                              >
                                <DeleteOutlined className="text-sm" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      <Modal
        title={null}
        open={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={null}
        width={700}
        centered
        className="add-video-modal"
        styles={{
          content: { padding: 0, borderRadius: 24 },
          body: { padding: 0 }
        }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-white">
          {/* Beautiful Header with Gradient */}
          <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-8 py-6 text-white">
            <button
              onClick={handleAddModalCancel}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
            >
              ×
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <PlusOutlined className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Thêm Video Mới</h2>
                <p className="mt-1 text-purple-100">{courseName}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Thông tin video
              </h3>
              <p className="text-sm text-gray-600">
                Thêm video mới vào khóa học của bạn
              </p>
            </div>

            <Form
              form={addForm}
              layout="vertical"
              onFinish={handleAddVideoSubmit}
              className="space-y-6"
            >
              <Form.Item
                name="title"
                label={
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Tiêu đề Video
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập tiêu đề video!' }
                ]}
              >
                <Input
                  placeholder="Nhập tiêu đề video"
                  className="h-12 rounded-lg border-gray-300 text-lg shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </Form.Item>

              <Form.Item
                name="link"
                label={
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Link Video
                  </span>
                }
                rules={[
                  { required: true, message: 'Vui lòng nhập link video!' },
                  { type: 'url', message: 'Link không hợp lệ!' }
                ]}
                extra={
                  <div className="mt-2 text-xs text-gray-500">
                    Hỗ trợ: YouTube, Vimeo, hoặc link video trực tiếp
                  </div>
                }
              >
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
              </Form.Item>

              {/* Tips Section */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="h-3 w-3 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-blue-900">
                      Mẹo nhỏ
                    </h4>
                    <p className="text-xs text-blue-700">
                      Để có trải nghiệm tốt nhất, hãy sử dụng video chất lượng
                      HD và đảm bảo link video có thể truy cập công khai.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleAddModalCancel}
                  className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createVideoMutation.isPending}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  {createVideoMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <PlusOutlined className="mr-2" />
                      Thêm video
                    </>
                  )}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

      {/* Edit Video Modal */}
      <Modal
        title={null}
        open={isEditModalVisible}
        onCancel={handleEditModalCancel}
        footer={null}
        width={900}
        centered
        className="edit-video-modal"
        styles={{
          content: { padding: 0, borderRadius: 24 },
          body: { padding: 0 }
        }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-white">
          {/* Beautiful Header with Gradient */}
          <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 px-8 py-6 text-white">
            <button
              onClick={handleEditModalCancel}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
            >
              ×
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <EditOutlined className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Chỉnh sửa Video</h2>
                <p className="mt-1 max-w-md truncate text-amber-100">
                  {selectedVideo?.title}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column - Form */}
              <div>
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Thông tin video
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cập nhật thông tin chi tiết cho video của bạn
                  </p>
                </div>

                <Form
                  form={editForm}
                  layout="vertical"
                  onFinish={handleEditVideoSubmit}
                  className="space-y-6"
                >
                  <Form.Item
                    name="title"
                    label={
                      <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Tiêu đề Video
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tiêu đề video!'
                      }
                    ]}
                  >
                    <Input
                      placeholder="Nhập tiêu đề video"
                      className="h-12 rounded-lg border-gray-300 text-lg shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    />
                  </Form.Item>

                  <Form.Item
                    name="link"
                    label={
                      <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Link Video
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Vui lòng nhập link video!' },
                      { type: 'url', message: 'Link không hợp lệ!' }
                    ]}
                    extra={
                      <div className="mt-2 text-xs text-gray-500">
                        Hỗ trợ: YouTube, Vimeo, hoặc link video trực tiếp
                      </div>
                    }
                  >
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="h-12 rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                      prefix={<LinkOutlined className="text-gray-400" />}
                    />
                  </Form.Item>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleEditModalCancel}
                      className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={updateVideoMutation.isPending}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      {updateVideoMutation.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <EditOutlined className="mr-2" />
                          Cập nhật video
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              </div>

              {/* Right Column - Video Preview */}
              <div>
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Xem trước
                  </h3>
                  <p className="text-sm text-gray-600">
                    Preview video hiện tại
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 p-4">
                  {selectedVideo &&
                    (() => {
                      const thumbnailUrl = getThumbnailUrl(selectedVideo.link);
                      return (
                        <div className="relative">
                          <div className="aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300">
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={selectedVideo.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                  <PlayCircleOutlined className="mb-2 text-4xl text-gray-400" />
                                  <p className="text-sm text-gray-500">
                                    Không thể tải preview
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100">
                              <button
                                onClick={() =>
                                  window.open(selectedVideo.link, '_blank')
                                }
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition-transform duration-200 hover:scale-110"
                              >
                                <PlayCircleOutlined className="text-2xl" />
                              </button>
                            </div>
                          </div>

                          {/* Video Info */}
                          <div className="mt-4 space-y-3">
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Tiêu đề hiện tại
                              </div>
                              <div className="truncate text-sm font-semibold text-gray-900">
                                {selectedVideo.title}
                              </div>
                            </div>

                            <div className="rounded-lg bg-white p-3 shadow-sm">
                              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Link hiện tại
                              </div>
                              <div className="truncate text-xs text-blue-600">
                                {selectedVideo.link}
                              </div>
                            </div>

                            {selectedVideo.createdAt && (
                              <div className="rounded-lg bg-white p-3 shadow-sm">
                                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                  Ngày tạo
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                  <ClockCircleOutlined className="mr-1" />
                                  {new Date(
                                    selectedVideo.createdAt
                                  ).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Video Confirmation Modal */}
      <Modal
        title={null}
        open={isDeleteModalVisible}
        onCancel={handleDeleteModalCancel}
        footer={null}
        width={600}
        centered
        className="delete-video-modal"
        styles={{
          content: { padding: 0, borderRadius: 24 },
          body: { padding: 0 }
        }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-white">
          {/* Beautiful Header with Gradient */}
          <div className="relative bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 px-8 py-6 text-white">
            <button
              onClick={handleDeleteModalCancel}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
            >
              ×
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <DeleteOutlined className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Xác nhận xóa video</h2>
                <p className="mt-1 text-red-100">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-8">
            <div className="mb-6 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-pink-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-red-900">
                    Cảnh báo quan trọng
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-red-800">
                    Bạn có chắc chắn muốn xóa video{' '}
                    <span className="font-bold text-red-900">
                      "{selectedVideo?.title}"
                    </span>{' '}
                    không?
                  </p>
                  <p className="text-xs text-red-700">
                    Video sẽ bị xóa vĩnh viễn khỏi khóa học và không thể khôi
                    phục. Điều này có thể ảnh hưởng đến trải nghiệm học tập của
                    học viên.
                  </p>
                </div>
              </div>
            </div>

            {/* Video info preview */}
            {selectedVideo && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-24 overflow-hidden rounded-lg bg-gray-200">
                      {(() => {
                        const thumbnailUrl = getThumbnailUrl(
                          selectedVideo.link
                        );
                        return thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={selectedVideo.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <PlayCircleOutlined className="text-gray-400" />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gray-900">
                      {selectedVideo.title}
                    </h4>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {selectedVideo.link}
                    </p>
                    {selectedVideo.createdAt && (
                      <p className="mt-1 text-xs text-gray-400">
                        Tạo:{' '}
                        {new Date(selectedVideo.createdAt).toLocaleDateString(
                          'vi-VN'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleDeleteModalCancel}
                disabled={deleteVideoMutation.isPending}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteVideoConfirm}
                disabled={deleteVideoMutation.isPending}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-600 hover:to-pink-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {deleteVideoMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <DeleteOutlined className="mr-2" />
                    Xóa video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoManagement;
