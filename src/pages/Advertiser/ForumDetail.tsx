// File: src/pages/Advertiser/ForumDetail.tsx

import React, { useState, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRegHeart,
  FaHeart,
  FaComment,
  FaImage,
  FaRegSmile,
  FaMapMarkerAlt,
  FaChevronDown,
  FaEllipsisH
} from 'react-icons/fa';

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

// ----------------------------------------------
// Props cho ForumDetail
// ----------------------------------------------
interface ForumDetailProps {
  post: Post;
  onBack: () => void;
  toggleLikePost: (p: Post) => void;
  updatePost: (p: Post) => void;
}

const ForumDetail: FC<ForumDetailProps> = ({
  post,
  onBack,
  toggleLikePost,
  updatePost
}) => {
  // --------------------------------------------
  // State local
  // --------------------------------------------
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes'>('newest');

  // Track ID comment nào đang được edit, đồng thời store text mới
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Track ID của comment/post nào đang mở menu 3-chấm
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Track số replies đã show cho mỗi comment
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, number>
  >({});

  // --------------------------------------------
  // Sắp xếp comment dựa vào sortBy
  // --------------------------------------------
  const sortedComments = (coms: Comment[]): Comment[] => {
    const arr = [...coms];
    if (sortBy === 'likes') {
      arr.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'newest') {
      arr.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      arr.sort((a, b) => a.createdAt - b.createdAt);
    }
    return arr;
  };

  // --------------------------------------------
  // Toggle like cho post (fake)
  // --------------------------------------------
  const handleToggleLikePost = () => {
    const updated: Post = {
      ...post,
      liked: !post.liked,
      likes: post.likes + (post.liked ? -1 : 1)
    };
    updatePost(updated);
  };

  // --------------------------------------------
  // Toggle like cho Comment (fake)
  // --------------------------------------------
  const toggleLikeComment = (c: Comment) => {
    const updateList = (list: Comment[]): Comment[] =>
      list.map((item) => {
        if (item.id === c.id) {
          const newLiked = !item.liked;
          return {
            ...item,
            liked: newLiked,
            likes: newLiked ? item.likes + 1 : item.likes - 1
          };
        }
        if (item.replies) {
          return { ...item, replies: updateList(item.replies) };
        }
        return item;
      });
    const updatedComments = updateList(post.comments);
    const updatedPost: Post = { ...post, comments: updatedComments };
    updatePost(updatedPost);
  };

  // --------------------------------------------
  // Thêm comment hoặc reply (fake)
  // --------------------------------------------
  const handlePostComment = () => {
    if (!commentRef.current) return;
    const txt = commentRef.current.value.trim();
    if (!txt) return;

    const newC: Comment = {
      id: Date.now().toString(),
      author: 'Bạn',
      avatarUrl: 'https://i.pravatar.cc/40?u=me',
      content: txt,
      likes: 0,
      liked: false,
      createdAt: Date.now()
    };

    let updatedComments: Comment[] = [];
    if (replyToId) {
      // Nếu đang reply vào comment nào đó
      const attach = (list: Comment[]): Comment[] =>
        list.map((item) => {
          if (item.id === replyToId) {
            return {
              ...item,
              replies: item.replies ? [newC, ...item.replies] : [newC]
            };
          }
          if (item.replies) {
            return { ...item, replies: attach(item.replies) };
          }
          return item;
        });
      updatedComments = attach(post.comments);
    } else {
      // Comment mới ở top-level
      updatedComments = [newC, ...post.comments];
    }
    const updatedPost: Post = { ...post, comments: updatedComments };
    updatePost(updatedPost);

    setCommentText('');
    setReplyToId(null);
    commentRef.current.value = '';
  };

  // --------------------------------------------
  // Xóa comment (fake)
  // --------------------------------------------
  const deleteComment = (targetId: string) => {
    const removeRecursively = (list: Comment[]): Comment[] =>
      list
        .filter((item) => item.id !== targetId)
        .map((item) => ({
          ...item,
          replies: item.replies ? removeRecursively(item.replies) : undefined
        }));
    const updatedComments = removeRecursively(post.comments);
    const updatedPost: Post = { ...post, comments: updatedComments };
    updatePost(updatedPost);
  };

  // --------------------------------------------
  // Lưu chỉnh sửa comment (fake)
  // --------------------------------------------
  const saveEditedComment = (id: string) => {
    const updateTextRecursively = (list: Comment[]): Comment[] =>
      list.map((item) => {
        if (item.id === id) {
          return { ...item, content: editingText };
        }
        if (item.replies) {
          return {
            ...item,
            replies: updateTextRecursively(item.replies)
          };
        }
        return item;
      });
    const updatedComments = updateTextRecursively(post.comments);
    const updatedPost: Post = { ...post, comments: updatedComments };
    updatePost(updatedPost);
    setEditingId(null);
    setEditingText('');
  };

  // --------------------------------------------
  // Render comment + replies (đệ quy)
  // --------------------------------------------
  const renderComments = (list: Comment[]): JSX.Element[] =>
    sortedComments(list).map((c) => {
      const replies = c.replies || [];
      const totalReplies = replies.length;

      // Số replies đang hiển: nếu chưa expand (undefined hoặc 0), show 0 (ẩn hết)
      const shownCount = expandedReplies[c.id] || 0;
      // Số replies cần hiển trong lần tiếp theo: 4, hoặc nếu còn ít hơn 4, hiển hết
      const nextCount = Math.min(totalReplies, shownCount + 4);

      const numHiddenNow = totalReplies - shownCount; // số ẩn còn lại

      return (
        <div
          key={c.id}
          className="mb-8 w-full rounded-lg bg-white p-4 shadow-sm"
        >
          {/* Avatar + header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={c.avatarUrl}
                alt={c.author}
                className="h-9 w-9 rounded-full border-2 border-[#3B82F6] object-cover"
              />
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-800">
                  {c.author}
                </span>
                {c.author === post.author && (
                  <span className="text-xs font-semibold text-[#3B82F6]">
                    TÁC GIẢ
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* 3-chấm ⋯ (chỉ show nếu comment của “Bạn”) */}
              {c.author === 'Bạn' && (
                <div className="relative">
                  <FaEllipsisH
                    onClick={() =>
                      setMenuOpenId((prev) => (prev === c.id ? null : c.id))
                    }
                    className="cursor-pointer text-xl text-gray-500 hover:text-gray-700"
                  />
                  <AnimatePresence>
                    {menuOpenId === c.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-0 z-10 mt-1 w-28 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          <div
                            onClick={() => {
                              setEditingId(c.id);
                              setEditingText(c.content);
                              setMenuOpenId(null);
                            }}
                            className="cursor-pointer px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            Chỉnh sửa
                          </div>
                          <div
                            onClick={() => {
                              setMenuOpenId(null);
                              if (
                                window.confirm(
                                  'Bạn có chắc chắn muốn xóa bình luận này?'
                                )
                              ) {
                                deleteComment(c.id);
                              }
                            }}
                            className="text-red-600 cursor-pointer px-3 py-2 text-xs hover:bg-gray-100"
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
          </div>

          {/* Nội dung comment hoặc textarea nếu đang edit */}
          {editingId === c.id ? (
            <div className="mt-3">
              <textarea
                rows={2}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingText('');
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={() => saveEditedComment(c.id)}
                  className="hover:bg-blue-700 transform rounded-lg bg-[#3B82F6] px-3 py-1 text-xs text-white transition-transform hover:scale-105"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
              {c.content}
            </p>
          )}

          {/* Thời gian comment (nằm ngay dưới content, căn bên trái) */}
          <div className="mb-3 mt-1 text-xs text-gray-400">
            {new Date(c.createdAt).toLocaleTimeString()}
          </div>

          {/* Actions: Like + Reply */}
          <div className="mb-3 flex items-center space-x-6 text-gray-500">
            <motion.button
              onClick={() => toggleLikeComment(c)}
              whileTap={{ scale: 0.8 }}
              className="relative flex transform items-center space-x-1 text-sm transition-transform hover:scale-110 hover:text-[#E54646]"
            >
              {c.liked ? (
                <FaHeart className="text-lg text-[#E54646]" />
              ) : (
                <FaRegHeart className="text-lg text-gray-500 transition hover:text-[#E54646]" />
              )}
              <span className="text-sm font-medium">{c.likes}</span>
              {c.liked && (
                <div className="absolute -left-1 -top-2 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="bg-yellow-400 block h-1 w-1 animate-ping rounded-full"
                      style={{ animationDelay: `${i * 80}ms`, opacity: 0.8 }}
                    />
                  ))}
                </div>
              )}
            </motion.button>

            <motion.button
              onClick={() => setReplyToId(c.id)}
              whileTap={{ scale: 0.8 }}
              className="hover:text-blue-500 flex transform items-center space-x-1 text-sm transition-transform hover:scale-110"
            >
              <FaComment className="text-lg" />
              <span>Reply</span>
            </motion.button>
          </div>

          {/* Nếu đang reply vào comment này, show textarea ngay dưới */}
          {replyToId === c.id && (
            <div className="mt-3">
              <div className="flex items-start space-x-3">
                <img
                  src="https://i.pravatar.cc/40?u=me"
                  alt="Bạn"
                  className="h-8 w-8 rounded-full border-2 border-[#3B82F6] object-cover"
                />
                <div className="flex-1">
                  <textarea
                    ref={commentRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    placeholder={`Trả lời ${c.author}`}
                  />
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setReplyToId(null);
                        setCommentText('');
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handlePostComment}
                      className="hover:bg-blue-700 transform rounded-lg bg-[#3B82F6] px-3 py-1 text-xs text-white transition-transform hover:scale-105"
                    >
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render replies (nằm ngang, background trắng) */}
          {shownCount > 0 && (
            <div className="mt-4 space-y-4">
              {replies.slice(0, shownCount).map((r) => (
                <div
                  key={r.id}
                  className="flex w-full items-start rounded-lg bg-white p-3 shadow-sm"
                >
                  <img
                    src={r.avatarUrl}
                    alt={r.author}
                    className="mr-3 h-8 w-8 flex-shrink-0 rounded-full border-2 border-[#3B82F6] object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-800">
                        {r.author}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm font-medium text-gray-800">
                        {c.author}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                      {r.content}
                    </p>
                    <div className="mb-2 mt-1 text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center space-x-6 text-gray-500">
                      <motion.button
                        onClick={() => toggleLikeComment(r)}
                        whileTap={{ scale: 0.8 }}
                        className="relative flex transform items-center space-x-1 text-sm transition-transform hover:scale-110 hover:text-[#E54646]"
                      >
                        {r.liked ? (
                          <FaHeart className="text-lg text-[#E54646]" />
                        ) : (
                          <FaRegHeart className="text-lg text-gray-500 transition hover:text-[#E54646]" />
                        )}
                        <span className="text-sm font-medium">{r.likes}</span>
                        {r.liked && (
                          <div className="absolute -left-1 -top-2 flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className="bg-yellow-400 block h-1 w-1 animate-ping rounded-full"
                                style={{
                                  animationDelay: `${i * 80}ms`,
                                  opacity: 0.8
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => setReplyToId(r.id)}
                        whileTap={{ scale: 0.8 }}
                        className="hover:text-blue-500 flex transform items-center space-x-1 text-sm transition-transform hover:scale-110"
                      >
                        <FaComment className="text-lg" /> <span>Reply</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dòng “Xem thêm …” hoặc “Ẩn” */}
              {totalReplies > shownCount && (
                <div>
                  <div
                    onClick={() => {
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [c.id]: nextCount
                      }));
                    }}
                    className="cursor-pointer pl-11 text-xs text-[#3B82F6] hover:underline"
                  >
                    Xem thêm {numHiddenNow} bình luận
                  </div>
                </div>
              )}
              {shownCount === totalReplies && totalReplies > 4 && (
                <div>
                  <div
                    onClick={() => {
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [c.id]: 0
                      }));
                    }}
                    className="cursor-pointer pl-11 text-xs text-[#3B82F6] hover:underline"
                  >
                    Ẩn
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });

  // --------------------------------------------
  // Giao diện Detail (single scroll, container rộng hơn)
  // --------------------------------------------
  return (
    <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
      {/* Nút “Quay lại” (sticky) */}
      <div className="sticky top-0 z-10 flex items-center border-b border-gray-200 bg-gray-50 p-4">
        <span
          onClick={onBack}
          className="cursor-pointer text-base font-medium text-indigo-600 hover:underline"
        >
          ← Quay lại
        </span>
      </div>

      {/* Container chính */}
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {/* Post chính */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.avatarUrl}
                alt={post.author}
                className="h-8 w-8 rounded-full border-2 border-[#3B82F6] object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {post.author}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            {/* 3-chấm ⋯ (chỉ show nếu bài này của “Bạn”) */}
            {post.author === 'Bạn' && (
              <div className="relative">
                <FaEllipsisH
                  onClick={() =>
                    setMenuOpenId((prev) => (prev === post.id ? null : post.id))
                  }
                  className="cursor-pointer text-xl text-gray-500 hover:text-gray-700"
                />
                <AnimatePresence>
                  {menuOpenId === post.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 z-10 mt-1 w-28 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        <div
                          onClick={() => {
                            setEditingId(post.id);
                            setEditingText(post.content);
                            setMenuOpenId(null);
                          }}
                          className="cursor-pointer px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        >
                          Chỉnh sửa
                        </div>
                        <div
                          onClick={() => {
                            setMenuOpenId(null);
                            if (
                              window.confirm(
                                'Bạn có chắc chắn muốn xóa bài viết?'
                              )
                            ) {
                              updatePost({ ...post, comments: [] });
                              onBack();
                            }
                          }}
                          className="text-red-600 cursor-pointer px-3 py-2 text-xs hover:bg-gray-100"
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

          {/* Tiêu đề hoặc textarea nếu edit */}
          {editingId === post.id ? (
            <div className="mb-4">
              <textarea
                rows={2}
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingText('');
                  }}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    const updatedPost: Post = {
                      ...post,
                      content: editingText,
                      title:
                        editingText.length > 30
                          ? editingText.substring(0, 30) + '...'
                          : editingText
                    };
                    updatePost(updatedPost);
                    setEditingId(null);
                    setEditingText('');
                  }}
                  className="hover:bg-blue-700 transform rounded-lg bg-[#3B82F6] px-3 py-1 text-xs text-white transition-transform hover:scale-105"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                {post.title}
              </h2>
              <p className="mb-4 whitespace-pre-wrap text-sm text-gray-800">
                {post.content}
              </p>
            </>
          )}

          <div className="flex items-center space-x-6 text-gray-600">
            <motion.button
              onClick={handleToggleLikePost}
              whileTap={{ scale: 0.8 }}
              className="relative flex transform items-center space-x-1 text-sm transition-transform hover:scale-110 hover:text-[#E54646]"
            >
              {post.liked ? (
                <FaHeart className="text-lg text-[#E54646]" />
              ) : (
                <FaRegHeart className="text-lg text-gray-500 transition hover:text-[#E54646]" />
              )}
              <span className="text-sm font-medium">{post.likes}</span>
              {post.liked && (
                <div className="absolute -left-1 -top-2 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="bg-yellow-400 block h-1 w-1 animate-ping rounded-full"
                      style={{ animationDelay: `${i * 80}ms`, opacity: 0.8 }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <FaComment className="text-lg" />
              <span>{post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* Khung nhập comment gốc */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center space-x-3">
            <img
              src="https://i.pravatar.cc/40?u=me"
              alt="Bạn"
              className="h-8 w-8 rounded-full border-2 border-[#3B82F6] object-cover"
            />
            <textarea
              ref={commentRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder={replyToId ? `Trả lời…` : 'Viết bình luận…'}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-3 text-gray-500">
              <FaImage className="transform cursor-pointer text-sm transition-transform hover:scale-110 hover:text-gray-700" />
              <FaRegSmile className="transform cursor-pointer text-sm transition-transform hover:scale-110 hover:text-gray-700" />
              <FaMapMarkerAlt className="transform cursor-pointer text-sm transition-transform hover:scale-110 hover:text-gray-700" />
            </div>
            <button
              onClick={handlePostComment}
              className="hover:bg-blue-700 transform rounded-lg bg-[#3B82F6] px-3 py-1 text-sm text-white transition-transform hover:scale-105"
            >
              {replyToId ? 'Trả lời' : 'Comment'}
            </button>
          </div>
        </div>

        {/* Dropdown lọc comment */}
        <div className="relative mb-4 inline-block text-left">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex transform items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm transition-transform hover:scale-105 hover:bg-gray-100"
          >
            <span>
              {sortBy === 'newest'
                ? 'Mới nhất'
                : sortBy === 'oldest'
                  ? 'Cũ nhất'
                  : 'Liên quan'}
            </span>
            <FaChevronDown className="text-sm text-gray-500" />
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-1 w-40 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className="py-1">
                  <div
                    onClick={() => {
                      setSortBy('newest');
                      setFilterOpen(false);
                    }}
                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mới nhất
                  </div>
                  <div
                    onClick={() => {
                      setSortBy('oldest');
                      setFilterOpen(false);
                    }}
                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cũ nhất
                  </div>
                  <div
                    onClick={() => {
                      setSortBy('likes');
                      setFilterOpen(false);
                    }}
                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Liên quan
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Danh sách comment */}
        <div className="space-y-6">{renderComments(post.comments)}</div>
      </div>
    </div>
  );
};

export default ForumDetail;
