import { useState, useEffect } from 'react';
import { useGetVideoCourses } from '@/queries/video.query';
import { ArrowLeft, Play, PlayCircle, BookOpen } from 'lucide-react';
import Loading from '@/components/ui/loading';

export interface VideoCourseResponse {
  id: number;
  link: string;
  title: string;
  courseId: number;
}

interface VideoCoursePageProps {
  courseId: number;
  onBack: () => void;
}

const VideoCoursePage: React.FC<VideoCoursePageProps> = ({
  courseId,
  onBack
}) => {
  const [selectedVideo, setSelectedVideo] =
    useState<VideoCourseResponse | null>(null);

  const {
    data: apiResponse,
    isLoading,
    isError
  } = useGetVideoCourses(courseId);

  // Fix: Ensure videos is always an array of VideoCourseResponse
  const videos: VideoCourseResponse[] = Array.isArray(apiResponse?.result)
    ? apiResponse.result
    : [];

  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  const currentVideoIndex = selectedVideo
    ? videos.findIndex((v) => v.id === selectedVideo.id)
    : -1;

  if (isLoading) {
    return <Loading />;
  }

  if (isError || videos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Không thể tải video
          </h2>
          <button
            onClick={onBack}
            className="hover:bg-blue-700 rounded-lg bg-blue px-6 py-3 font-medium text-white transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-600 transition-colors duration-200 hover:text-slate-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Quay lại</span>
              </button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <BookOpen className="text-blue-600 h-5 w-5" />
                <span className="font-semibold text-slate-900">
                  Khóa học #{courseId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Video Player */}
          <div className="mb-10 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {selectedVideo?.link ? (
                <>
                  <div className="aspect-video bg-slate-900">
                    <iframe
                      src={selectedVideo.link}
                      className="h-full w-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="mb-2 text-xl font-bold text-slate-900">
                          {selectedVideo.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>
                            Video {currentVideoIndex + 1} / {videos.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                      <PlayCircle className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      Chọn video để bắt đầu
                    </h3>
                    <p className="text-slate-600">
                      Chọn một video từ danh sách bên cạnh
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Playlist */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Playlist Header */}
              <div className="border-b border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  Nội dung khóa học
                </h3>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{videos.length} video</span>
                </div>
              </div>

              {/* Video List */}
              <div className="max-h-96 overflow-y-auto">
                {videos.map((video, index) => {
                  const isSelected = selectedVideo?.id === video.id;

                  return (
                    <div
                      key={video.id}
                      className={`cursor-pointer border-b border-slate-100 p-4 transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-l-blue'
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Video Number */}
                        <div className="mt-1 flex-shrink-0">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected
                                ? 'bg-blue text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="min-w-0 flex-1">
                          <h4
                            className={`mb-1 text-sm font-semibold leading-tight ${
                              isSelected ? 'text-blue-600' : 'text-slate-900'
                            }`}
                          >
                            {video.title}
                          </h4>
                        </div>

                        {/* Play Icon */}
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                              isSelected
                                ? 'bg-blue text-white'
                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                            }`}
                          >
                            <Play className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCoursePage;
