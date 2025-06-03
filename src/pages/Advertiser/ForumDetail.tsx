// File: src/pages/Advertiser/ForumDetail.tsx

import React, { useState, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaChevronDown, FaEllipsisH } from 'react-icons/fa';
import LikeButton from '@/components/ui/LikeButton';
import CommentForm from '@/components/ui/CommentForm';
import ConfirmModal from '@/components/ui/ConfirmModal';
import RichTextEditor from '@/components/ui/RichTextEditor';
import {
  getTotalCommentCount,
  formatCommentCount,
  formatTimeAgo
} from '@/utils/commentUtils';

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
  const [replyToAuthor, setReplyToAuthor] = useState<string>('');

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

  // Modal xác nhận xóa
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'post' | 'comment';
    id: string;
    title?: string;
  }>({
    isOpen: false,
    type: 'comment',
    id: ''
  });

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
    const txt = commentText.trim();
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

      // Tự động mở rộng replies cho comment được reply
      setExpandedReplies((prev) => ({
        ...prev,
        [replyToId]: Math.max(prev[replyToId] || 0, 1)
      }));
    } else {
      // Comment mới ở top-level
      updatedComments = [newC, ...post.comments];
    }
    const updatedPost: Post = { ...post, comments: updatedComments };
    updatePost(updatedPost);

    setCommentText('');
    setReplyToId(null);
    setReplyToAuthor('');
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
  // Xóa post
  // --------------------------------------------
  const deletePost = () => {
    updatePost({ ...post, comments: [] });
    onBack();
  };

  // --------------------------------------------
  // Xử lý modal xóa
  // --------------------------------------------
  const handleDeleteClick = (
    type: 'post' | 'comment',
    id: string,
    title?: string
  ) => {
    setDeleteModal({ isOpen: true, type, id, title });
    setMenuOpenId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.type === 'post') {
      deletePost();
    } else {
      deleteComment(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, type: 'comment', id: '' });
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
  // Handle Reply - Set reply target
  // --------------------------------------------
  const handleReply = (commentId: string, authorName: string) => {
    setReplyToId(commentId);
    setReplyToAuthor(authorName);
  };

  const handleCancelReply = () => {
    setReplyToId(null);
    setReplyToAuthor('');
    setCommentText('');
  };

  // --------------------------------------------
  // Render comment con (reply) với thụt lề
  // --------------------------------------------
  const renderReply = (
    reply: Comment,
    parentAuthor: string,
    level: number = 1
  ): JSX.Element => {
    const maxLevel = 3;
    const currentLevel = Math.min(level, maxLevel);

    return (
      <motion.div
        key={reply.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: level * 0.05 }}
        className={`mb-4 ${currentLevel === 1 ? 'ml-8' : currentLevel === 2 ? 'ml-12' : 'ml-16'}`}
      >
        <div className="rounded-2xl border border-white/50 bg-white/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          {/* Avatar + header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={reply.avatarUrl}
                alt={reply.author}
                className="h-8 w-8 rounded-full border-2 border-purple-400 object-cover shadow-md"
              />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-800">
                  {reply.author}
                </span>
                <span className="text-xs text-purple-400">→</span>
                <span className="text-sm font-medium text-purple-600">
                  {parentAuthor}
                </span>
                {reply.author === post.author && (
                  <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-600">
                    TÁC GIẢ
                  </span>
                )}
              </div>
            </div>

            {/* 3-chấm cho reply của "Bạn" */}
            {reply.author === 'Bạn' && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setMenuOpenId((prev) =>
                      prev === reply.id ? null : reply.id
                    )
                  }
                  className="rounded-full p-2 transition-colors hover:bg-purple-100/50"
                >
                  <FaEllipsisH className="text-gray-500" />
                </motion.button>
                <AnimatePresence>
                  {menuOpenId === reply.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setEditingId(reply.id);
                            setEditingText(reply.content);
                            setMenuOpenId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick('comment', reply.id)}
                          className="text-red-600 hover:bg-red-50 w-full px-4 py-2 text-left text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Nội dung reply */}
          {editingId === reply.id ? (
            <div className="mb-3">
              <RichTextEditor
                value={editingText}
                onChange={setEditingText}
                placeholder="Chỉnh sửa phản hồi..."
                height={120}
                className="mb-2"
              />
              <div className="flex justify-end space-x-2">
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
                  onClick={() => saveEditedComment(reply.id)}
                  className="rounded-lg bg-purple-500 px-3 py-1 text-xs text-white transition hover:bg-purple-600"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm mb-3 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: reply.content }}
            />
          )}

          {/* Thời gian */}
          <div className="mb-3 text-xs text-gray-400">
            {formatTimeAgo(reply.createdAt)}
          </div>

          {/* Actions: Like + Reply */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LikeButton
                liked={reply.liked}
                likes={reply.likes}
                onToggle={() => toggleLikeComment(reply)}
                size="sm"
              />

              <motion.button
                onClick={() => handleReply(reply.id, reply.author)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 text-sm text-gray-500 transition-colors hover:text-purple-500"
              >
                <FaComment className="text-xs" />
                <span>Reply</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Form reply cho reply này */}
        {replyToId === reply.id && (
          <div className="mt-3">
            <CommentForm
              value={commentText}
              onChange={setCommentText}
              onSubmit={handlePostComment}
              onCancel={handleCancelReply}
              placeholder={`Trả lời ${reply.author}...`}
              replyTo={reply.author}
              size="sm"
              autoFocus={true}
            />
          </div>
        )}

        {/* Render nested replies */}
        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-3">
            {reply.replies.map((nestedReply) =>
              renderReply(nestedReply, reply.author, level + 1)
            )}
          </div>
        )}
      </motion.div>
    );
  };

  // --------------------------------------------
  // Render comment chính + replies
  // --------------------------------------------
  const renderComments = (list: Comment[]): JSX.Element[] =>
    sortedComments(list).map((c) => {
      const replies = c.replies || [];
      const totalReplies = replies.length;
      const shownCount = expandedReplies[c.id] || 0;
      const nextCount = Math.min(totalReplies, shownCount + 4);
      const numHiddenNow = totalReplies - shownCount;

      return (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 rounded-3xl border border-white/50 bg-white/95 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
        >
          {/* Avatar + header của comment chính */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={c.avatarUrl}
                alt={c.author}
                className="h-14 w-14 rounded-full border-4 border-purple-400 object-cover shadow-lg"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-800">
                    {c.author}
                  </span>
                  {c.author === post.author && (
                    <span className="rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-bold text-purple-600">
                      TÁC GIẢ
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatTimeAgo(c.createdAt)}
                </div>
              </div>
            </div>

            {/* Menu cho comment của "Bạn" */}
            {c.author === 'Bạn' && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setMenuOpenId((prev) => (prev === c.id ? null : c.id))
                  }
                  className="rounded-full p-3 transition-colors hover:bg-purple-100/50"
                >
                  <FaEllipsisH className="text-gray-500" />
                </motion.button>
                <AnimatePresence>
                  {menuOpenId === c.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 z-20 mt-2 w-36 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditingText(c.content);
                            setMenuOpenId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick('comment', c.id)}
                          className="text-red-600 hover:bg-red-50 w-full px-4 py-2 text-left text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Nội dung comment */}
          {editingId === c.id ? (
            <div className="mb-4">
              <RichTextEditor
                value={editingText}
                onChange={setEditingText}
                placeholder="Chỉnh sửa bình luận..."
                height={150}
                className="mb-3"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingText('');
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={() => saveEditedComment(c.id)}
                  className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white transition hover:bg-purple-600"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm mb-4 max-w-none whitespace-pre-wrap leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: c.content }}
            />
          )}

          {/* Actions: Like + Reply */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <LikeButton
                liked={c.liked}
                likes={c.likes}
                onToggle={() => toggleLikeComment(c)}
                size="md"
              />

              <motion.button
                onClick={() => handleReply(c.id, c.author)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-500 transition-colors hover:text-purple-500"
              >
                <FaComment className="text-lg" />
                <span className="font-medium">Reply</span>
              </motion.button>
            </div>
          </div>

          {/* Form reply cho comment này */}
          {replyToId === c.id && (
            <div className="mb-4">
              <CommentForm
                value={commentText}
                onChange={setCommentText}
                onSubmit={handlePostComment}
                onCancel={handleCancelReply}
                placeholder={`Trả lời ${c.author}...`}
                replyTo={c.author}
                size="md"
                autoFocus={true}
              />
            </div>
          )}

          {/* Hiển thị replies */}
          {shownCount > 0 && (
            <div className="mt-4">
              {replies
                .slice(0, shownCount)
                .map((r) => renderReply(r, c.author))}

              {/* Nút "Xem thêm" hoặc "Ẩn" */}
              {totalReplies > shownCount && (
                <div className="ml-8 mt-3">
                  <motion.button
                    onClick={() => {
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [c.id]: nextCount
                      }));
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm font-medium text-purple-500 hover:text-purple-600"
                  >
                    Xem thêm {numHiddenNow} bình luận
                  </motion.button>
                </div>
              )}
              {shownCount === totalReplies && totalReplies > 4 && (
                <div className="ml-8 mt-3">
                  <motion.button
                    onClick={() => {
                      setExpandedReplies((prev) => ({
                        ...prev,
                        [c.id]: 0
                      }));
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm font-medium text-purple-500 hover:text-purple-600"
                  >
                    Ẩn bình luận
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Hiển thị nút xem replies nếu có nhưng chưa expand */}
          {totalReplies > 0 && shownCount === 0 && (
            <div className="ml-8 mt-3">
              <motion.button
                onClick={() => {
                  setExpandedReplies((prev) => ({
                    ...prev,
                    [c.id]: Math.min(4, totalReplies)
                  }));
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-sm font-medium text-purple-500 hover:text-purple-600"
              >
                Xem {totalReplies} bình luận
              </motion.button>
            </div>
          )}
        </motion.div>
      );
    });

  // --------------------------------------------
  // Giao diện Detail
  // --------------------------------------------
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
      {/* Overlay để làm mờ background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      <div className="relative z-10">
        {/* Header với nút quay lại */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 border-b border-white/30 bg-white/80 shadow-lg backdrop-blur-lg"
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 rounded-lg bg-white/90 px-4 py-2 font-semibold text-purple-600 shadow-md backdrop-blur-sm transition-all hover:text-purple-700 hover:shadow-lg"
            >
              <span>← Quay lại</span>
            </motion.button>

            <div className="flex items-center space-x-2 rounded-lg bg-white/90 px-3 py-2 text-sm text-gray-600 shadow-md backdrop-blur-sm">
              <FaComment />
              <span className="font-medium">
                {formatCommentCount(getTotalCommentCount(post.comments))} bình
                luận
              </span>
            </div>
          </div>
        </motion.div>

        {/* Container chính */}
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 pb-32">
          {/* Post chính */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/50 bg-white/95 p-8 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={post.avatarUrl}
                  alt={post.author}
                  className="h-16 w-16 rounded-full border-4 border-purple-400 object-cover shadow-xl"
                />
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {post.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Menu cho post của "Bạn" */}
              {post.author === 'Bạn' && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setMenuOpenId((prev) =>
                        prev === post.id ? null : post.id
                      )
                    }
                    className="rounded-full p-3 transition-colors hover:bg-purple-100/50"
                  >
                    <FaEllipsisH className="text-gray-500" />
                  </motion.button>
                  <AnimatePresence>
                    {menuOpenId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute right-0 z-20 mt-2 w-36 origin-top-right rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setEditingId(post.id);
                              setEditingText(post.content);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick('post', post.id, post.title)
                            }
                            className="text-red-600 hover:bg-red-50 w-full px-4 py-2 text-left text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Nội dung post */}
            {editingId === post.id ? (
              <div className="mb-6">
                <RichTextEditor
                  value={editingText}
                  onChange={setEditingText}
                  placeholder="Chỉnh sửa nội dung..."
                  height={300}
                  className="mb-3"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingText('');
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      const updatedPost: Post = {
                        ...post,
                        content: editingText
                      };
                      updatePost(updatedPost);
                      setEditingId(null);
                      setEditingText('');
                    }}
                    className="rounded-lg bg-purple-500 px-4 py-2 text-sm text-white transition hover:bg-purple-600"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="prose prose-purple mb-6 max-w-none text-lg leading-relaxed text-gray-700 [&>*:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Actions cho post */}
            <div className="flex items-center justify-between border-t border-purple-200/50 pt-6">
              <div className="flex items-center space-x-8">
                <LikeButton
                  liked={post.liked}
                  likes={post.likes}
                  onToggle={() => toggleLikePost(post)}
                  size="lg"
                />

                <div className="flex items-center space-x-2 text-gray-500">
                  <FaComment className="text-xl" />
                  <span className="text-lg font-medium">
                    {formatCommentCount(getTotalCommentCount(post.comments))}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Khung nhập comment chính */}
          {!replyToId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CommentForm
                value={commentText}
                onChange={setCommentText}
                onSubmit={handlePostComment}
                placeholder="Chia sẻ suy nghĩ của bạn..."
                size="lg"
              />
            </motion.div>
          )}

          {/* Dropdown lọc comment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative inline-block"
          >
            <motion.button
              onClick={() => setFilterOpen(!filterOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 rounded-xl border border-purple-200 bg-white/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
            >
              <span>
                {sortBy === 'newest'
                  ? 'Mới nhất'
                  : sortBy === 'oldest'
                    ? 'Cũ nhất'
                    : 'Liên quan'}
              </span>
              <motion.div
                animate={{ rotate: filterOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-purple-500" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute z-10 mt-2 w-40 origin-top-left rounded-xl border border-purple-200 bg-white/95 shadow-xl backdrop-blur-sm"
                >
                  <div className="py-2">
                    {[
                      { value: 'newest', label: 'Mới nhất' },
                      { value: 'oldest', label: 'Cũ nhất' },
                      { value: 'likes', label: 'Liên quan' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortBy(value as any);
                          setFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          sortBy === value
                            ? 'bg-purple-50 font-medium text-purple-600'
                            : 'text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Danh sách comment */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {renderComments(post.comments)}
          </motion.div>

          {/* Empty state */}
          {post.comments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-white/50 bg-white/90 py-16 text-center shadow-xl backdrop-blur-sm"
            >
              <div className="mb-4 text-6xl">💬</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                Chưa có bình luận nào
              </h3>
              <p className="text-gray-500">
                Hãy là người đầu tiên chia sẻ suy nghĩ về bài viết này!
              </p>
            </motion.div>
          )}
        </div>

        {/* Modal xác nhận xóa */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={handleDeleteConfirm}
          title={deleteModal.type === 'post' ? 'Xóa bài viết' : 'Xóa bình luận'}
          message={
            deleteModal.type === 'post'
              ? 'Bạn có chắc chắn muốn xóa bài viết này? Tất cả bình luận cũng sẽ bị xóa.'
              : 'Bạn có chắc chắn muốn xóa bình luận này?'
          }
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
        />
      </div>
    </div>
  );
};

export default ForumDetail;
