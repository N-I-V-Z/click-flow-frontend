import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  TagIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { newsData, NewsItem, getTagLabel, getTagColor } from './DataNews';

const NewsSection: React.FC = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem>(newsData[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedNewsId, setSelectedNewsId] = useState<number>(newsData[0].id);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [animateKey, setAnimateKey] = useState<number>(0);
  const itemsPerPage = 4;

  // Get paginated news (excluding featured news)
  const otherNews = newsData.filter((news) => news.id !== featuredNews.id);
  const totalPages = Math.ceil(otherNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = otherNews.slice(startIndex, startIndex + itemsPerPage);

  // Fill empty slots if not enough news for the page
  const filledPaginatedNews = [...paginatedNews];
  while (filledPaginatedNews.length < itemsPerPage && totalPages > 1) {
    filledPaginatedNews.push(null);
  }

  const handleNewsClick = (news: NewsItem) => {
    if (news.id === featuredNews.id) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setFeaturedNews(news);
      setSelectedNewsId(news.id);
      setCurrentPage(1);
      setAnimateKey((prev) => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setAnimateKey((prev) => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <div className="relative min-h-screen">
      {/* New Modern Background */}
      <div className="absolute inset-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Simple Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-purple-600/10"></div>
          </div>
        </div>
        {/* Animated Orbs */}
        <div className="absolute left-20 top-20 h-64 w-64 animate-pulse rounded-full bg-purple-500/30 blur-3xl filter"></div>
        <div
          className="absolute bottom-20 right-20 h-48 w-48 animate-pulse rounded-full bg-pink-500/20 blur-3xl filter"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-blue blur-2xl filter"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="relative z-10 p-4">
        {/* Compact Header */}
        <div className="relative mt-12">
          <div className="text-center">
            <div className="mb-3 flex items-center justify-center">
              <SparklesIcon className="animate-spin-slow mr-2 h-12 w-12 text-yellow" />
              <div className="relative mb-8 text-center">
                <div className="relative">
                  <div className="mb-3 flex items-center justify-center">
                    <h1 className="relative bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-3xl font-black text-transparent drop-shadow-lg">
                      Tin Tức Affiliate Network
                      <div className="absolute -bottom-1 left-1/2 h-0.5 w-24 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    </h1>
                  </div>
                </div>
              </div>
              <SparklesIcon className="animate-spin-slow ml-2 h-12 w-12 text-yellow" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Compact Featured News (F) */}
          <div className="lg:col-span-3">
            <div
              key={`featured-${animateKey}`}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                isTransitioning
                  ? 'scale-95 transform opacity-0'
                  : 'scale-100 transform opacity-100'
              }`}
            >
              {/* Subtle Glowing Border */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue opacity-60 blur-sm transition duration-300 group-hover:opacity-100"></div>

              <div className="relative overflow-hidden rounded-2xl bg-white/95 shadow-xl backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Simplified Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Clean Tag */}
                  <div className="absolute left-4 top-4">
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold text-white ${getTagColor(featuredNews.tag)} shadow-lg backdrop-blur-sm`}
                    >
                      <TagIcon className="mr-1 h-3 w-3" />
                      {getTagLabel(featuredNews.tag)}
                    </span>
                  </div>

                  {/* Simple Hot Badge */}
                  <div className="absolute right-4 top-4">
                    <div className="rounded-lg bg-gradient-to-r from-orange to-red px-2 py-1 text-xs font-bold text-white shadow-lg">
                      🔥 HOT
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-gray mb-3 flex items-center text-xs">
                    <CalendarDaysIcon className="text-purple mr-1 h-4 w-4" />
                    <span className="font-medium">
                      {formatDate(featuredNews.publishedAt)}
                    </span>
                  </div>

                  <h2 className="mb-3 text-xl font-bold leading-tight text-gray-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent">
                    <a
                      href={featuredNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {featuredNews.title}
                    </a>
                  </h2>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {featuredNews.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <a
                      href={featuredNews.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex transform items-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
                    >
                      <span className="relative">Đọc tiếp</span>
                      <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </a>

                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="flex items-center">
                        <span className="text-sm">👁️</span>
                        <span className="ml-1 text-xs font-medium">
                          {Math.floor(Math.random() * 1000) + 100}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">❤️</span>
                        <span className="ml-1 text-xs font-medium">
                          {Math.floor(Math.random() * 50) + 10}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Improved News List */}
          <div className="space-y-4 lg:col-span-2">
            <div className="relative">
              <h3 className="mb-4 flex items-center text-xl font-bold text-white">
                <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Tin tức khác
                </span>
                <div className="ml-2 rounded-full border border-white/20 bg-gradient-to-r from-purple-500/80 to-pink-500/80 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                  {otherNews.length}
                </div>
              </h3>
            </div>

            {/* Compact News Items */}
            <div
              key={`list-${animateKey}`}
              className={`space-y-2 transition-all duration-500 ${
                isTransitioning
                  ? 'translate-x-8 transform opacity-0'
                  : 'translate-x-0 transform opacity-100'
              }`}
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {filledPaginatedNews.map((news, index) => (
                <div
                  key={news?.id || `empty-${index}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slide-in-right"
                >
                  {news ? (
                    <div
                      onClick={() => handleNewsClick(news)}
                      className={`group relative transform cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${
                        selectedNewsId === news.id
                          ? '-translate-y-0.5 scale-[1.01]'
                          : ''
                      }`}
                    >
                      {/* Subtle glow for selected */}
                      {selectedNewsId === news.id && (
                        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500/50 to-pink-500/50 opacity-60 blur"></div>
                      )}

                      <div
                        className={`relative overflow-hidden rounded-xl border bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                          selectedNewsId === news.id
                            ? 'border-purple-400/60 shadow-purple-500/20'
                            : 'border-white/30 hover:border-purple-300/50 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex p-3">
                          <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="h-16 w-16 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>

                          <div className="ml-3 min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <span
                                className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold text-white ${getTagColor(news.tag)} shadow-sm`}
                              >
                                {getTagLabel(news.tag)}
                              </span>
                              <span className="rounded-full bg-gray-100/80 px-2 py-0.5 text-xs font-medium text-gray-500">
                                {formatDate(news.publishedAt)}
                              </span>
                            </div>

                            <h4 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-purple-600">
                              {truncateText(news.title, 70)}
                            </h4>

                            <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                              {truncateText(news.content, 90)}
                            </p>
                          </div>

                          {/* Hover indicator */}
                          <div className="self-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <ChevronRightIcon className="h-4 w-4 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Compact Empty placeholder */
                    <div className="animate-pulse overflow-hidden rounded-xl border border-white/20 bg-white/40 shadow-sm backdrop-blur-sm">
                      <div className="flex p-3">
                        <div className="flex-shrink-0">
                          <div className="animate-shimmer h-16 w-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="animate-shimmer h-3 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                              <div className="animate-shimmer h-2 w-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                            </div>
                            <div className="animate-shimmer h-3 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                            <div className="animate-shimmer h-3 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                            <div className="animate-shimmer h-2 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Compact Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isTransitioning}
                  className="group rounded-lg border border-white/30 bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-purple-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-600 transition-colors duration-300 group-hover:text-purple-600" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isTransitioning}
                        className={`transform rounded-lg px-3 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 ${
                          currentPage === page
                            ? 'scale-105 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'border border-white/30 bg-white/80 text-gray-700 shadow-md backdrop-blur-sm hover:bg-purple-50 hover:shadow-lg'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || isTransitioning}
                  className="group rounded-lg border border-white/30 bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-purple-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRightIcon className="h-4 w-4 text-gray-600 transition-colors duration-300 group-hover:text-purple-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimized CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Custom scrollbar for news list */
        div[style*='overflowY']::-webkit-scrollbar {
          width: 4px;
        }
        div[style*='overflowY']::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        div[style*='overflowY']::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 2px;
        }
        div[style*='overflowY']::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
      <br></br>
    </div>
  );
};

export default NewsSection;
