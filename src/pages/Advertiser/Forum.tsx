// File: src/pages/Advertiser/Forum.tsx

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaRegHeart,
  FaHeart,
  FaComment,
  FaSearch,
  FaTimes,
  FaEllipsisH
} from 'react-icons/fa';
import ForumDetail from './ForumDetail';

// ----------------------------------------------
// Fake data (initialPosts) dùng làm mẫu
// ----------------------------------------------
const initialPosts = [
  {
    id: '1',
    author: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/40?u=admin',
    title: 'Chào mừng đến với diễn đàn!',
    content:
      'Đây là bài viết mẫu để bạn kiểm tra giao diện và tính năng like/comment. Hy vọng bạn sẽ đóng góp xây dựng cộng đồng tốt hơn nhé!',
    likes: 5,
    liked: false,
    comments: [
      {
        id: 'c1',
        author: 'Nguyễn Văn A',
        avatarUrl: 'https://i.pravatar.cc/40?u=nvA',
        content: 'Bài viết rất hữu ích, cảm ơn bạn!',
        likes: 2,
        liked: false,
        createdAt: Date.now() - 600000,
        replies: [
          {
            id: 'c1-1',
            author: 'Trần Thị B',
            avatarUrl: 'https://i.pravatar.cc/40?u=ttB',
            content: 'Mình cũng thấy vậy.',
            likes: 1,
            liked: false,
            createdAt: Date.now() - 300000
          },
          {
            id: 'c1-2',
            author: 'Bạn',
            avatarUrl: 'https://i.pravatar.cc/40?u=me',
            content: 'Ok',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 200000
          },
          {
            id: 'c1-3',
            author: 'Khách',
            avatarUrl: 'https://i.pravatar.cc/40?u=guest',
            content: 'Cám ơn!',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 100000
          },
          {
            id: 'c1-4',
            author: 'Bạn',
            avatarUrl: 'https://i.pravatar.cc/40?u=me',
            content: 'Thử thêm bình luận dài hơn để test hiển thị.',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 50000
          },
          {
            id: 'c1-5',
            author: 'Người khác',
            avatarUrl: 'https://i.pravatar.cc/40?u=other',
            content: 'Một reply thứ 5 để test Xem thêm.',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 20000
          }
        ]
      },
      {
        id: 'c2',
        author: 'Phạm Thị C',
        avatarUrl: 'https://i.pravatar.cc/40?u=ptC',
        content: 'Cần thêm ví dụ cụ thể nữa nhé.',
        likes: 0,
        liked: false,
        createdAt: Date.now() - 1200000
      }
    ],
    createdAt: Date.now() - 3600000
  },
  {
    id: '2',
    author: 'Bạn',
    avatarUrl: 'https://i.pravatar.cc/40?u=me',
    title: 'Mình có thắc mắc về TypeScript',
    content: 'Bạn nào giúp mình cách sửa lỗi type trong React hook useState?',
    likes: 1,
    liked: false,
    comments: [],
    createdAt: Date.now() - 7200000
  }
  // Thêm nhiều bài “fake” hơn nếu cần
];

// ----------------------------------------------
// Kiểu dữ liệu Comment & Post
// ----------------------------------------------
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

interface Post {
  id: string;
  author: string;
  avatarUrl: string;
  title: string;
  content: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: number;
}

export default function Forum() {
  // --------------------------------------------
  // State & refs
  // --------------------------------------------
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [searchText, setSearchText] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // --------------------------------------------
  // 1) Load dữ liệu fake
  // --------------------------------------------
  useEffect(() => {
    setTimeout(() => {
      setPosts(initialPosts);
      setFilteredPosts(initialPosts);
      setLoading(false);
    }, 300);
  }, []);

  // --------------------------------------------
  // 2) Tìm kiếm (filter)
  // --------------------------------------------
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredPosts(posts);
      return;
    }
    const txt = searchText.trim().toLowerCase();
    const filtered = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(txt) ||
        p.content.toLowerCase().includes(txt)
    );
    setFilteredPosts(filtered);
  }, [searchText, posts]);

  // --------------------------------------------
  // 3) Tạo bài mới (fake)
  // --------------------------------------------
  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    const content = contentRef.current!.value.trim();
    if (!content) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Bạn',
      avatarUrl: 'https://i.pravatar.cc/40?u=me',
      title: content.length > 30 ? content.substring(0, 30) + '...' : content,
      content,
      likes: 0,
      liked: false,
      comments: [],
      createdAt: Date.now()
    };
    setPosts([newPost, ...posts]);
    setFilteredPosts([newPost, ...filteredPosts]);
    setShowCreate(false);
    contentRef.current!.value = '';
  };

  // --------------------------------------------
  // 4) Toggle like cho post (fake)
  // --------------------------------------------
  const toggleLikePost = (p: Post) => {
    const updated = {
      ...p,
      liked: !p.liked,
      likes: p.likes + (p.liked ? -1 : 1)
    };
    setPosts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    setFilteredPosts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    if (selectedPost && selectedPost.id === p.id) {
      setSelectedPost(updated);
    }
  };

  // --------------------------------------------
  // Like button component (kèm animation)
  // --------------------------------------------
  interface LikeButtonProps {
    p: Post;
    onToggleLike: (p: Post) => void;
  }
  function LikeButton({ p, onToggleLike }: LikeButtonProps) {
    const [animating, setAnimating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setAnimating(true);
      onToggleLike(p);
      setTimeout(() => setAnimating(false), 800);
    };

    return (
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.8 }}
        className="relative flex items-center space-x-1"
      >
        <motion.div
          animate={p.liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {p.liked ? (
            <FaHeart className="text-xl text-[#E54646]" />
          ) : (
            <FaRegHeart className="text-xl text-gray-500 transition hover:text-[#E54646]" />
          )}
        </motion.div>
        <span className="text-base font-medium text-gray-700">{p.likes}</span>

        {animating && (
          <div className="absolute -left-2 -top-2 flex space-x-1">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="bg-yellow-400 block h-1 w-1 animate-ping rounded-full"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0.8 }}
              />
            ))}
          </div>
        )}
      </motion.button>
    );
  }

  // --------------------------------------------
  // Giao diện Home (danh sách bài + search + modal)
  // --------------------------------------------
  const renderHome = () => {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-gray-100">
          <span className="text-gray-600">Đang tải bài viết…</span>
        </div>
      );
    }

    return (
      <div className="min-h-screen overflow-x-hidden bg-gray-50 p-6">
        {/* Search + nút tạo bài */}
        <div className="mb-6 flex flex-col px-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Diễn đàn</h1>
          <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 md:mt-0">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex transform items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-transform hover:scale-105 hover:bg-indigo-700"
            >
              <FaPlus className="text-base" />
              <span>Tạo bài</span>
            </button>
          </div>
        </div>

        {/* Modal tạo bài */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Tạo bài viết
                  </h2>
                  <FaTimes
                    onClick={() => setShowCreate(false)}
                    className="cursor-pointer text-gray-500 transition hover:text-gray-700"
                  />
                </div>

                <div className="mb-4 flex items-start space-x-3">
                  <img
                    src="https://i.pravatar.cc/40?u=me"
                    alt="Bạn"
                    className="h-10 w-10 rounded-full border-2 border-indigo-500 object-cover"
                  />
                  <textarea
                    ref={contentRef}
                    rows={4}
                    placeholder="Bạn đang nghĩ gì?"
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="rounded-lg border border-gray-300 px-4 py-1 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="transform rounded-lg bg-indigo-600 px-4 py-1 text-sm text-white transition-transform hover:scale-105 hover:bg-indigo-700"
                  >
                    Đăng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Danh sách bài viết */}
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              Không tìm thấy bài viết.
            </div>
          ) : (
            filteredPosts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="transform cursor-pointer rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-100 hover:shadow-lg"
                onClick={() => setSelectedPost(p)}
              >
                <div className="mb-2 flex items-center">
                  <img
                    src={p.avatarUrl}
                    alt={p.author}
                    className="mr-2 h-8 w-8 rounded-full border-2 border-indigo-500 object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {p.author}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {/* Nếu bài này do “Bạn” tạo, hiển thị 3-chấm để Edit/Xóa*/}
                  {p.author === 'Bạn' && (
                    <div
                      className="relative ml-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaEllipsisH
                        onClick={(e) => {
                          // Vì chưa làm API thật nên hiển alert tạm
                          e.stopPropagation();
                          alert('Tính năng chỉnh sửa/xóa bài (fake)');
                        }}
                        className="cursor-pointer text-xl text-gray-500 hover:text-gray-700"
                      />
                    </div>
                  )}
                </div>
                <h2 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-800">
                  {p.title}
                </h2>
                <p className="mb-3 line-clamp-3 whitespace-pre-wrap text-sm text-gray-700">
                  {p.content}
                </p>
                <div className="flex items-center space-x-6 text-gray-600">
                  <LikeButton p={p} onToggleLike={toggleLikePost} />
                  <div className="flex items-center space-x-1">
                    <FaComment className="hover:text-blue-500 text-base text-gray-500 transition" />
                    <span className="text-sm font-medium text-gray-700">
                      {p.comments.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  // --------------------------------------------
  // Nếu đã chọn 1 post → show ForumDetail, ngược lại render Home
  // --------------------------------------------
  return selectedPost ? (
    <ForumDetail
      post={selectedPost}
      onBack={() => setSelectedPost(null)}
      toggleLikePost={toggleLikePost}
      updatePost={(updated: Post) => {
        setPosts((prev) =>
          prev.map((x) => (x.id === updated.id ? updated : x))
        );
        setFilteredPosts((prev) =>
          prev.map((x) => (x.id === updated.id ? updated : x))
        );
        setSelectedPost(updated);
      }}
    />
  ) : (
    renderHome()
  );
}
