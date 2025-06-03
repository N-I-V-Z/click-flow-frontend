// File: src/pages/Advertiser/Forum.tsx

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaComment,
  FaSearch,
  FaTimes,
  FaEllipsisH
} from 'react-icons/fa';
import ForumDetail from './ForumDetail';
import PageHead from '@/components/shared/page-head';
import LikeButton from '@/components/ui/LikeButton';
import ConfirmModal from '@/components/ui/ConfirmModal';
import CreatePostModal from '@/components/ui/CreatePostModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import {
  getTotalCommentCount,
  formatCommentCount,
  formatTimeAgo
} from '@/utils/commentUtils';

// ----------------------------------------------
// Fake data (initialPosts) dùng làm mẫu
// ----------------------------------------------
const initialPosts = [
  {
    id: '1',
    author: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/40?u=admin',
    title: '',
    content:
      '<h2>Chào mừng đến với diễn đàn!</h2><p>Đây là bài viết mẫu để bạn kiểm tra giao diện và tính năng like/comment. Hy vọng bạn sẽ <strong>đóng góp xây dựng cộng đồng</strong> tốt hơn nhé!</p><p>Bạn có thể sử dụng <em>rich text editor</em> để tạo nội dung đẹp với <span style="color: rgb(147, 51, 234);">màu sắc</span> và <u>định dạng</u> khác nhau.</p>',
    likes: 5,
    liked: false,
    comments: [
      {
        id: 'c1',
        author: 'Nguyễn Văn A',
        avatarUrl: 'https://i.pravatar.cc/40?u=nvA',
        content: '<p>Bài viết rất <strong>hữu ích</strong>, cảm ơn bạn! 😊</p>',
        likes: 2,
        liked: false,
        createdAt: Date.now() - 600000,
        replies: [
          {
            id: 'c1-1',
            author: 'Trần Thị B',
            avatarUrl: 'https://i.pravatar.cc/40?u=ttB',
            content: '<p>Mình cũng thấy vậy. <em>Rất tuyệt vời!</em></p>',
            likes: 1,
            liked: false,
            createdAt: Date.now() - 300000
          },
          {
            id: 'c1-2',
            author: 'Bạn',
            avatarUrl: 'https://i.pravatar.cc/40?u=me',
            content: '<p>Ok, thanks!</p>',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 200000
          },
          {
            id: 'c1-3',
            author: 'Khách',
            avatarUrl: 'https://i.pravatar.cc/40?u=guest',
            content: '<p>Cám ơn!</p>',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 100000
          },
          {
            id: 'c1-4',
            author: 'Bạn',
            avatarUrl: 'https://i.pravatar.cc/40?u=me',
            content: '<p>Thử thêm bình luận dài hơn để test hiển thị.</p>',
            likes: 0,
            liked: false,
            createdAt: Date.now() - 50000
          },
          {
            id: 'c1-5',
            author: 'Người khác',
            avatarUrl: 'https://i.pravatar.cc/40?u=other',
            content:
              '<p>Một reply thứ 5 để test <span style="color: rgb(34, 197, 94);">Xem thêm</span>.</p>',
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
        content: '<p>Cần thêm ví dụ cụ thể nữa nhé.</p>',
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
    title: '',
    content:
      "<h3>Mình có thắc mắc về TypeScript</h3><p>Bạn nào giúp mình cách sửa lỗi type trong <code>React hook useState</code>?</p><blockquote>Lỗi: Type 'string' is not assignable to type 'number'</blockquote>",
    likes: 1,
    liked: false,
    comments: [],
    createdAt: Date.now() - 7200000
  }
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

  // State cho edit post
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostText, setEditingPostText] = useState('');

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
  const handleCreatePost = (data: { content: string }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Bạn',
      avatarUrl: 'https://i.pravatar.cc/40?u=me',
      title: '', // Bỏ title, chỉ dùng content
      content: data.content, // Store as HTML
      likes: 0,
      liked: false,
      comments: [],
      createdAt: Date.now()
    };
    setPosts([newPost, ...posts]);
    setFilteredPosts([newPost, ...filteredPosts]);
    setShowCreate(false);
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
  // 5) Edit post (fake)
  // --------------------------------------------
  const handleEditPost = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPostId(postId);
      setEditingPostText(post.content);
      setMenuOpenId(null);
    }
  };

  const saveEditedPost = (postId: string) => {
    const updatedPosts = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          content: editingPostText // Store as HTML, no title needed
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    setFilteredPosts(
      updatedPosts.filter(
        (p) =>
          !searchText.trim() ||
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||
          p.content.toLowerCase().includes(searchText.toLowerCase())
      )
    );

    // Update selectedPost if it's being edited
    if (selectedPost && selectedPost.id === postId) {
      const updatedPost = updatedPosts.find((p) => p.id === postId);
      if (updatedPost) setSelectedPost(updatedPost);
    }

    setEditingPostId(null);
    setEditingPostText('');
  };

  // --------------------------------------------
  // 6) Delete post (fake)
  // --------------------------------------------
  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    setPosts(updatedPosts);
    setFilteredPosts(
      updatedPosts.filter(
        (p) =>
          !searchText.trim() ||
          p.title.toLowerCase().includes(searchText.toLowerCase()) ||
          p.content.toLowerCase().includes(searchText.toLowerCase())
      )
    );

    // If deleted post is currently selected, go back to list
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  // --------------------------------------------
  // Handle delete modal
  // --------------------------------------------
  const handleDeleteClick = (postId: string) => {
    setDeleteModal({ isOpen: true, postId });
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = () => {
    handleDeletePost(deleteModal.postId);
    setDeleteModal({ isOpen: false, postId: '' });
  };

  // --------------------------------------------
  // Giao diện Home (danh sách bài + search + modal)
  // --------------------------------------------
  const renderHome = () => {
    if (loading) {
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
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

        {/* Fixed: Tăng padding-bottom từ pb-32 lên pb-40 để tránh đè lên footer */}
        <div className="relative z-10 space-y-6 px-4 py-6 pb-40">
          <PageHead title={'ClickFlow - Diễn đàn'} />

          {/* Header với Search + nút tạo bài */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Diễn đàn
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-purple-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full rounded-xl border border-purple-200 bg-white/90 py-3 pl-10 pr-4 text-sm placeholder-purple-400 shadow-lg backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <motion.button
                onClick={() => setShowCreate(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
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

          {/* Danh sách bài viết */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-white/50 bg-white/90 py-16 text-center shadow-xl backdrop-blur-sm"
              >
                <div className="mb-4 text-6xl">📝</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-gray-500">
                  Hãy thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới!
                </p>
              </motion.div>
            ) : (
              filteredPosts.map((p, index) => {
                // Truncate HTML content for preview (keep first 300 chars of HTML)
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
                        src={p.avatarUrl}
                        alt={p.author}
                        className="border-3 mr-3 h-12 w-12 rounded-full border-purple-400 object-cover shadow-lg"
                      />
                      <div
                        onClick={() => setSelectedPost(p)}
                        className="flex-1"
                      >
                        <div className="text-base font-bold text-gray-900">
                          {p.author}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTimeAgo(p.createdAt)}
                        </div>
                      </div>

                      {/* Menu cho bài của "Bạn" */}
                      {p.author === 'Bạn' && (
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setMenuOpenId((prev) =>
                                prev === p.id ? null : p.id
                              )
                            }
                            className="rounded-full p-2 transition-colors hover:bg-purple-100/50"
                          >
                            <FaEllipsisH className="text-gray-500" />
                          </motion.button>
                          <AnimatePresence>
                            {menuOpenId === p.id && (
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
                    {editingPostId === p.id ? (
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
                              saveEditedPost(p.id);
                            }}
                            className="transform rounded-lg bg-purple-500 px-3 py-1 text-xs text-white transition hover:scale-105 hover:bg-purple-600"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => setSelectedPost(p)}>
                        <div
                          className="prose prose-purple mb-4 max-w-none leading-relaxed text-gray-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                          dangerouslySetInnerHTML={{ __html: preview }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center space-x-6">
                        <LikeButton
                          liked={p.liked}
                          likes={p.likes}
                          onToggle={() => toggleLikePost(p)}
                          size="md"
                        />

                        <div
                          className="flex cursor-pointer items-center space-x-2 transition-colors hover:text-purple-500"
                          onClick={() => setSelectedPost(p)}
                        >
                          <FaComment className="text-lg" />
                          <span className="font-medium">
                            {formatCommentCount(
                              getTotalCommentCount(p.comments)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

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
