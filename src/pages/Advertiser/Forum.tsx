import React, { useState, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRegHeart,
  FaHeart,
  FaComment,
  FaEye,
  FaPlus,
  FaTimes,
  FaImage,
  FaRegSmile,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHead from '@/components/shared/page-head';

interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  likes: number;
  liked: boolean;
  createdAt: number;
  children?: Comment[];
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

const initialPosts: Post[] = [
  {
    id: '1',
    author: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/40?u=admin',
    title: 'Chào mừng đến với diễn đàn!',
    content:
      'Đây là bài viết mẫu để bạn kiểm tra giao diện và tính năng like/comment.',
    likes: 4,
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
        children: [
          {
            id: 'c1-1',
            author: 'Trần Thị B',
            avatarUrl: 'https://i.pravatar.cc/40?u=ttB',
            content: 'Mình cũng thấy vậy.',
            likes: 1,
            liked: false,
            createdAt: Date.now() - 300000
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
    author: 'User123',
    avatarUrl: 'https://i.pravatar.cc/40?u=user123',
    title: 'Mình có thắc mắc về TypeScript',
    content: 'Bạn nào giúp mình cách sửa lỗi type trong React hook useState?',
    likes: 1,
    liked: false,
    comments: [],
    createdAt: Date.now() - 7200000
  }
];

const sortComments = (list: Comment[], by: 'time' | 'likes') =>
  [...list].sort((a, b) =>
    by === 'likes' ? b.likes - a.likes : a.createdAt - b.createdAt
  );

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'likes'>('time');
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  // Create post
  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const title = titleRef.current!.value.trim();
    const content = contentRef.current!.value.trim();
    if (!title || !content) return toast.error('Nhập tiêu đề và nội dung!');
    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Bạn',
      avatarUrl: 'https://i.pravatar.cc/40?u=me',
      title,
      content,
      likes: 0,
      liked: false,
      comments: [],
      createdAt: Date.now()
    };
    setPosts([newPost, ...posts]);
    setShowCreate(false);
    toast.success('Tạo bài viết thành công!');
  };

  // Like post or comment
  const toggleLikePost = (p: Post) => {
    setPosts(
      posts.map((x) =>
        x.id === p.id
          ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) }
          : x
      )
    );
    if (selectedPost?.id === p.id)
      setSelectedPost({
        ...p,
        liked: !p.liked,
        likes: p.likes + (p.liked ? -1 : 1)
      });
  };
  const toggleLikeComment = (c: Comment) => {
    const update = (list: Comment[]): Comment[] =>
      list.map((item) => {
        if (item.id === c.id)
          return {
            ...item,
            liked: !item.liked,
            likes: item.likes + (item.liked ? -1 : 1)
          };
        if (item.children) return { ...item, children: update(item.children) };
        return item;
      });
    setPosts(
      posts.map((p) =>
        p.id === selectedPost?.id ? { ...p, comments: update(p.comments) } : p
      )
    );
    if (selectedPost)
      setSelectedPost({
        ...selectedPost,
        comments: update(selectedPost.comments)
      });
  };

  // Add comment or reply
  const handleComment = () => {
    if (!commentRef.current) return;
    const txt = commentRef.current.value.trim();
    if (!txt) return toast.error('Nhập nội dung bình luận!');
    const newC: Comment = {
      id: Date.now().toString(),
      author: 'Bạn',
      avatarUrl: 'https://i.pravatar.cc/40?u=me',
      content: txt,
      likes: 0,
      liked: false,
      createdAt: Date.now()
    };
    let updated: Comment[];
    if (replyTo) {
      const attach = (list: Comment[]): Comment[] =>
        list.map((item) => {
          if (item.id === replyTo.id)
            return {
              ...item,
              children: item.children ? [newC, ...item.children] : [newC]
            };
          if (item.children)
            return { ...item, children: attach(item.children) };
          return item;
        });
      updated = attach(selectedPost!.comments);
    } else updated = [newC, ...selectedPost!.comments];
    setPosts(
      posts.map((p) =>
        p.id === selectedPost?.id ? { ...p, comments: updated } : p
      )
    );
    setSelectedPost({ ...selectedPost!, comments: updated });
    setReplyTo(null);
    setNewComment('');
    commentRef.current.value = '';
    toast.success('Đã gửi bình luận!');
  };

  // Render comments
  const renderComments = (list: Comment[], depth = 0) =>
    sortComments(list, sortBy).map((c) => (
      <div
        key={c.id}
        className={`mb-6 flex ${depth > 0 ? 'ml-8 border-l border-gray-300 pl-4' : ''}`}
      >
        <img
          src={c.avatarUrl}
          alt={c.author}
          className="mr-4 h-10 w-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">{c.author}</span>
            <span className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-1 text-gray-700">{c.content}</p>
          <div className="mt-2 flex items-center space-x-4 text-gray-500">
            <button
              onClick={() => toggleLikeComment(c)}
              className="flex items-center space-x-1"
            >
              {c.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}{' '}
              <span>{c.likes}</span>
            </button>
            <button
              onClick={() => setReplyTo(c)}
              className="flex items-center space-x-1"
            >
              <FaComment /> <span>Reply</span>
            </button>
          </div>
          {c.children && renderComments(c.children, depth + 1)}
        </div>
      </div>
    ));

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHead title={'ClickFlow - Diễn đàn'} />

      <ToastContainer />
      {!selectedPost ? (
        <>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Diễn đàn</h1>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
            >
              <FaPlus className="mr-2" /> Tạo bài viết
            </button>
          </div>
          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Tạo bài viết</h2>
                    <FaTimes
                      onClick={() => setShowCreate(false)}
                      className="cursor-pointer"
                    />
                  </div>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <input
                      ref={titleRef}
                      placeholder="Tiêu đề"
                      className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      ref={contentRef}
                      rows={4}
                      placeholder="Nội dung"
                      className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                      >
                        Đăng
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-8">
            {posts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring' }}
                className="cursor-pointer rounded-xl bg-white p-6 shadow-lg hover:shadow-2xl"
                onClick={() => setSelectedPost(p)}
              >
                <div className="mb-4 flex items-center">
                  <img
                    src={p.avatarUrl}
                    alt={p.author}
                    className="mr-4 h-12 w-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {p.author}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                  {p.title}
                </h2>
                <p className="mb-4 line-clamp-2 text-gray-700">{p.content}</p>
                <div className="flex items-center space-x-6 text-gray-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikePost(p);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <FaRegHeart />
                    <span>{p.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <FaComment />
                    <span>{p.comments.length}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <FaEye />
                    <span>Xem</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-4 text-indigo-600 hover:underline"
          >
            &larr; Quay lại
          </button>
          <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center">
              <img
                src={selectedPost.avatarUrl}
                alt={selectedPost.author}
                className="mr-4 h-12 w-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-gray-900">
                  {selectedPost.author}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              {selectedPost.title}
            </h2>
            <p className="mb-4 text-gray-800">{selectedPost.content}</p>
            <div className="mb-4 flex items-center space-x-6 text-gray-600">
              <button
                onClick={() => toggleLikePost(selectedPost)}
                className="flex items-center space-x-1"
              >
                <FaRegHeart />
                <span>{selectedPost.likes}</span>
              </button>
              <div className="flex items-center space-x-1">
                <FaComment />
                <span>{selectedPost.comments.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaEye />
                <span>Xem</span>
              </div>
            </div>
            <div className="mb-6 rounded-xl bg-gray-100 p-4">
              <div className="mb-2 flex items-center">
                <img
                  src="https://i.pravatar.cc/40?u=me"
                  alt="Bạn"
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <textarea
                  ref={commentRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="flex-1 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={
                    replyTo ? `Trả lời ${replyTo.author}` : 'Viết bình luận...'
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-gray-500">
                  <FaImage className="cursor-pointer hover:text-gray-700" />
                  <FaRegSmile className="cursor-pointer hover:text-gray-700" />
                  <FaMapMarkerAlt className="cursor-pointer hover:text-gray-700" />
                </div>
                <button
                  onClick={handleComment}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                >
                  {replyTo ? 'Reply' : 'Comment'}
                </button>
              </div>
            </div>
            <div className="mb-4 flex space-x-4">
              <button
                onClick={() => setSortBy('time')}
                className={`${sortBy === 'time' ? 'bg-indigo-600 text-white' : 'bg-white'} rounded-lg border px-4 py-2`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => setSortBy('likes')}
                className={`${sortBy === 'likes' ? 'bg-indigo-600 text-white' : 'bg-white'} rounded-lg border px-4 py-2`}
              >
                Hot nhất
              </button>
            </div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {' '}
              {renderComments(selectedPost.comments)}{' '}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
