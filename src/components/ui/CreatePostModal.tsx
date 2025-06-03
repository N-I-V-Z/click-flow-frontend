// File: src/components/ui/CreatePostModal.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import RichTextEditor from './RichTextEditor';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content });
      handleClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  // Strip HTML tags for character count
  const getTextContent = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const contentLength = getTextContent(content).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundImage:
              'url(https://24hstore.vn/upload_images/images/hinh-nen-mau-tim/Hinh-nen-mau-tim-dam-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.pravatar.cc/40?u=me"
                  alt="Bạn"
                  className="h-10 w-10 rounded-full border-2 border-purple-400 object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Tạo bài viết
                  </h2>
                  <p className="text-sm text-gray-600">
                    Chia sẻ suy nghĩ của bạn
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full p-2 text-gray-500 transition-all hover:bg-white/80 hover:text-gray-700"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex max-h-[calc(90vh-140px)] flex-col">
              {/* Rich text editor */}
              <div className="flex-1 overflow-hidden px-6 py-6">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <div className="h-full">
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Chia sẻ suy nghĩ, kinh nghiệm hoặc thông tin hữu ích..."
                    height={350}
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{contentLength} ký tự</span>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                  Hủy
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  whileHover={{ scale: !content.trim() ? 1 : 1.02 }}
                  whileTap={{ scale: !content.trim() ? 1 : 0.98 }}
                  className={`rounded-xl px-6 py-2 font-medium transition-all duration-200 ${
                    !content.trim()
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Đang đăng...</span>
                    </div>
                  ) : (
                    'Đăng bài'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
