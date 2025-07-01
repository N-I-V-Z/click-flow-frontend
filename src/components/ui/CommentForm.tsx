// File: src/components/ui/CommentForm.tsx

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaImage,
  FaRegSmile,
  FaMapMarkerAlt,
  FaTimes,
  FaPaperPlane
} from 'react-icons/fa';

interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
  replyTo?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  showActions?: boolean;
  avatarUrl?: string; // thêm prop avatarUrl
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
  avatarUrl // nhận prop avatarUrl
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      // Scroll to textarea
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
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
          className="from-blue-50 border-blue-100 mb-3 flex items-center justify-between rounded-lg border bg-gradient-to-r to-indigo-50 px-3 py-2"
        >
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 h-1 w-1 animate-pulse rounded-full" />
            <span className="text-blue-700 text-xs font-medium">
              Đang trả lời <span className="font-semibold">{replyTo}</span>
            </span>
          </div>
          {onCancel && (
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-blue-500 hover:text-blue-700 transition-colors"
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
          className={`${avatarSizes[size]} border-gradient-to-r from-blue-400 rounded-full border-2 to-purple-500 object-cover shadow-md`}
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
            className={`w-full resize-none rounded-xl border border-gray-200 px-4 py-3 ${textSizes[size]} focus:border-blue-400 focus:ring-blue-100 text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 focus:outline-none focus:ring-2`}
            whileFocus={{ scale: 1.01 }}
          />

          {/* Actions */}
          {showActions && (
            <div className="mt-3 flex items-center justify-between">
              {/* Action icons */}
              <div className="flex space-x-4">
                {[
                  {
                    icon: FaImage,
                    color: 'text-green-500 hover:text-green-600'
                  },
                  {
                    icon: FaRegSmile,
                    color: 'text-yellow-500 hover:text-yellow-600'
                  },
                  {
                    icon: FaMapMarkerAlt,
                    color: 'text-red-500 hover:text-red-600'
                  }
                ].map(({ icon: Icon, color }, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`transform cursor-pointer transition-all duration-200 ${color}`}
                  >
                    <Icon className="text-lg" />
                  </motion.button>
                ))}
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
                  disabled={!value.trim()}
                  whileHover={{ scale: value.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: value.trim() ? 0.95 : 1 }}
                  style={{
                    background: value.trim()
                      ? 'linear-gradient(90deg,#7e57c2,#ab47bc)'
                      : '#e0e0e0',
                    color: value.trim() ? '#fff' : '#bdbdbd',
                    border: 'none',
                    boxShadow: value.trim() ? '0 2px 8px #b39ddb80' : 'none',
                    cursor: value.trim() ? 'pointer' : 'not-allowed',
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
          >
            Nhấn Ctrl + Enter để gửi nhanh
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentForm;
