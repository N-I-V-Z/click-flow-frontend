// File: src/components/ui/CommentForm.tsx

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegSmile, FaTimes, FaPaperPlane } from 'react-icons/fa';
import GifPickerComponent from './GifPickerComponent';
import EmojiPickerComponent from './EmojiPickerComponent';

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (data: { text: string; gifUrl: string | null }) => void;
  onCancel?: () => void;
  placeholder?: string;
  replyTo?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  showActions?: boolean;
  avatarUrl?: string;
  gifUrl?: string | null; // thêm prop gifUrl cho edit mode
  onGifChange?: (url: string | null) => void; // callback khi chọn/xóa GIF
}

const CommentForm: React.FC<CommentFormProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = 'Viết bình luận...',
  replyTo,
  size = 'md',
  autoFocus = false,
  showActions = true,
  avatarUrl,
  gifUrl, // nhận prop gifUrl
  onGifChange // nhận prop onGifChange
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  // Nếu có gifUrl prop (edit mode), ưu tiên dùng, nếu không thì dùng state nội bộ (tạo mới)
  const [gifPreview, setGifPreview] = useState<string | null>(null);
  const effectiveGif = gifUrl !== undefined ? gifUrl : gifPreview;

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (value.trim() || effectiveGif) {
      onSubmit({ text: value.trim(), gifUrl: effectiveGif });
      setShowEmojiPicker(false);
      setShowGifPicker(false);
      if (!gifUrl && !onGifChange) setGifPreview(null); // chỉ reset nếu là form tạo mới
      onChange('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Chèn text (emoji) vào vị trí con trỏ
  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + text + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length);
      textarea.focus();
    }, 0);
  };

  // Chèn GIF dạng [GIF]url[/GIF] (chỉ preview, không chèn vào value)
  const handleGifSelect = (gif: string) => {
    if (onGifChange) onGifChange(gif);
    else setGifPreview(gif);
    setShowGifPicker(false);
  };

  // Chèn emoji
  const handleEmojiSelect = (emoji: string) => {
    insertAtCursor(emoji);
    // setShowEmojiPicker(false); // Để mở picker sau mỗi lần chọn emoji
  };

  const avatarSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const buttonSizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-gray-100 bg-white p-4 shadow-lg"
    >
      {/* Reply indicator */}
      {replyTo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-3 flex items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2"
        >
          <div className="flex items-center space-x-2">
            <div className="h-1 w-1 animate-pulse rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-blue-700">
              Đang trả lời <span className="font-semibold">{replyTo}</span>
            </span>
          </div>
          {onCancel && (
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-blue-500 transition-colors hover:text-blue-700"
            >
              <FaTimes className="h-3 w-3" />
            </motion.button>
          )}
        </motion.div>
      )}

      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          src={avatarUrl || 'https://i.pravatar.cc/40?u=me'}
          alt="Bạn"
          className={`${avatarSizes[size]} border-gradient-to-r rounded-full border-2 from-blue-400 to-purple-500 object-cover shadow-md`}
        />

        <div className="flex-1">
          {/* Textarea */}
          <motion.textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={size === 'lg' ? 3 : 2}
            placeholder={placeholder}
            className={`w-full resize-none rounded-xl border border-gray-200 px-4 py-3 ${textSizes[size]} text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100`}
            whileFocus={{ scale: 1.01 }}
          />

          {/* GIF Preview */}
          {effectiveGif && (
            <div className="relative my-2 inline-block">
              <img
                src={effectiveGif}
                alt="GIF preview"
                style={{ maxHeight: 80, borderRadius: 8 }}
              />
              <button
                type="button"
                onClick={() =>
                  onGifChange ? onGifChange(null) : setGifPreview(null)
                }
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 bg-opacity-70 text-white transition-colors hover:bg-red-500"
                style={{ padding: 0, fontSize: 16, lineHeight: 1 }}
                aria-label="Xóa GIF"
              >
                ×
              </button>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="mt-3 flex items-center justify-between">
              {/* Action icons mới */}
              <div className="relative flex space-x-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="transform cursor-pointer font-bold text-purple-500 transition-all duration-200 hover:text-purple-700"
                  onClick={() => {
                    setShowGifPicker((v) => !v);
                    setShowEmojiPicker(false);
                  }}
                >
                  <span
                    className="inline-block rounded border border-purple-200 bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 shadow-sm"
                    style={{ letterSpacing: 1 }}
                  >
                    GIF
                  </span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="transform cursor-pointer text-yellow-500 transition-all duration-200 hover:text-yellow-600"
                  onClick={() => {
                    setShowEmojiPicker((v) => !v);
                    setShowGifPicker(false);
                  }}
                >
                  <FaRegSmile className="text-lg" />
                </motion.button>
                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                  <div className="absolute left-0 top-10 z-50">
                    <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
                {/* GIF Picker Popup */}
                {showGifPicker && (
                  <div className="absolute left-0 top-10 z-50">
                    <GifPickerComponent onGifSelect={handleGifSelect} />
                  </div>
                )}
              </div>

              {/* Submit/Cancel buttons */}
              <div className="flex space-x-2">
                {onCancel && (
                  <motion.button
                    onClick={onCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-lg border border-gray-300 text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 ${buttonSizes[size]}`}
                  >
                    Hủy
                  </motion.button>
                )}

                <motion.button
                  onClick={handleSubmit}
                  disabled={!(value.trim() || gifPreview)}
                  whileHover={{ scale: value.trim() || gifPreview ? 1.05 : 1 }}
                  whileTap={{ scale: value.trim() || gifPreview ? 0.95 : 1 }}
                  style={{
                    background:
                      value.trim() || gifPreview
                        ? 'linear-gradient(90deg,#7e57c2,#ab47bc)'
                        : '#e0e0e0',
                    color: value.trim() || gifPreview ? '#fff' : '#bdbdbd',
                    border: 'none',
                    boxShadow:
                      value.trim() || gifPreview
                        ? '0 2px 8px #b39ddb80'
                        : 'none',
                    cursor:
                      value.trim() || gifPreview ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                  className={`flex items-center space-x-2 rounded-lg transition-all duration-200 ${buttonSizes[size]}`}
                >
                  <FaPaperPlane
                    className={size === 'sm' ? 'text-xs' : 'text-sm'}
                  />
                  <span>{replyTo ? 'Trả lời' : 'Gửi'}</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-xs text-gray-400"
          ></motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentForm;
