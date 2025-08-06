import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaEdit,
  FaQuestionCircle,
  FaLightbulb,
  FaEllipsisH,
  FaChevronDown
} from 'react-icons/fa';
import RichTextEditor from './RichTextEditor';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; topic: string }) => void;
}

type TopicType = 'QA' | 'Tips' | 'Other';

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<TopicType>('Other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  // Simple notification state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const topics = [
    {
      id: 'QA' as TopicType,
      label: 'Q&A',
      icon: FaQuestionCircle,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#EFF6FF]',
      description: 'Câu hỏi & Trả lời'
    },
    {
      id: 'Tips' as TopicType,
      label: 'Tips',
      icon: FaLightbulb,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#FFFBEB]',
      description: 'Mẹo & Thủ thuật'
    },
    {
      id: 'Other' as TopicType,
      label: 'Other',
      icon: FaEllipsisH,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#F5F3FF]',
      description: 'Chủ đề khác'
    }
  ];

  // Show notification
  const showNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const selectedTopicData = topics.find((topic) => topic.id === selectedTopic);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showNotification('Vui lòng nhập đầy đủ tiêu đề và nội dung', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        topic: selectedTopic
      });

      // Reset form
      setTitle('');
      setContent('');
      setSelectedTopic('Other');
      setIsTopicDropdownOpen(false);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setContent('');
      setSelectedTopic('Other');
      setIsTopicDropdownOpen(false);
      onClose();
    }
  };

  const handleTopicSelect = (topicId: TopicType) => {
    setSelectedTopic(topicId);
    setIsTopicDropdownOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Simple Notification Popup */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -50, x: '-50%' }}
                className="fixed left-1/2 top-8 z-[10000] transform"
              >
                <div
                  className={`flex items-center space-x-3 rounded-xl border px-6 py-3 shadow-lg backdrop-blur-sm ${
                    notification.type === 'success'
                      ? 'border-green-200 bg-green-50/90 text-green-800'
                      : 'border-red-200 bg-red-50/90 text-red-800'
                  }`}
                >
                  <div
                    className={`rounded-full p-1 ${
                      notification.type === 'success'
                        ? 'bg-green-200'
                        : 'bg-red-200'
                    }`}
                  >
                    {notification.type === 'success' ? (
                      <FaEdit className="text-xs text-green-600" />
                    ) : (
                      <FaTimes className="text-xs text-red-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {notification.message}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-white/20 p-2">
                  <FaEdit className="text-lg text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Tạo bài viết mới
                  </h2>
                  <p className="text-sm text-[#F3E8FF]">
                    Chia sẻ kiến thức và kinh nghiệm của bạn
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleClose}
                disabled={isSubmitting}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 disabled:opacity-50"
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(80vh-140px)] overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Compact Topic Selection */}
                <div className="flex items-center space-x-4">
                  <label className="whitespace-nowrap text-base font-semibold text-[#1F2937]">
                    Chủ đề:
                  </label>

                  <div className="relative max-w-xs flex-1">
                    <motion.button
                      onClick={() =>
                        setIsTopicDropdownOpen(!isTopicDropdownOpen)
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-2.5 transition-all ${
                        selectedTopicData
                          ? `${selectedTopicData.bgColor} ${selectedTopicData.color} border-current`
                          : 'border-[#D1D5DB] bg-[#F9FAFB] text-[#6B7280]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {selectedTopicData && (
                          <>
                            <selectedTopicData.icon className="text-lg" />
                            <span className="font-medium">
                              {selectedTopicData.label}
                            </span>
                          </>
                        )}
                      </div>
                      <FaChevronDown
                        className={`text-sm transition-transform ${
                          isTopicDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {isTopicDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-xl"
                        >
                          {topics.map((topic) => {
                            const Icon = topic.icon;
                            const isSelected = selectedTopic === topic.id;

                            return (
                              <motion.button
                                key={topic.id}
                                onClick={() => handleTopicSelect(topic.id)}
                                whileHover={{
                                  backgroundColor: 'rgba(139, 92, 246, 0.05)'
                                }}
                                className={`flex w-full items-center space-x-3 border-b border-[#F3F4F6] px-4 py-3 text-left transition-colors last:border-b-0 ${
                                  isSelected
                                    ? 'bg-[#F5F3FF]'
                                    : 'hover:bg-[#F9FAFB]'
                                }`}
                              >
                                <div
                                  className={`rounded-lg p-1.5 ${topic.bgColor}`}
                                >
                                  <Icon
                                    className={`text-base ${topic.color}`}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-[#1F2937]">
                                    {topic.label}
                                  </div>
                                  <div className="text-xs text-[#6B7280]">
                                    {topic.description}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="ml-auto h-2 w-2 rounded-full bg-[#8B5CF6]"></div>
                                )}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="mb-2 block text-base font-semibold text-[#1F2937]">
                    Tiêu đề bài viết
                    <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề cho bài viết của bạn..."
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-2.5 text-[#1F2937] placeholder-[#6B7280] transition-all focus:border-[#8B5CF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E9D5FF] disabled:opacity-50"
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="mb-2 block text-base font-semibold text-[#1F2937]">
                    Nội dung bài viết
                    <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="min-h-[200px]">
                    <RichTextEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Viết nội dung bài viết của bạn..."
                      height={200}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4">
              <div className="text-sm text-[#6B7280]">
                <span className="text-[#EF4444]">*</span> Các trường bắt buộc
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl border border-[#D1D5DB] bg-white px-5 py-2.5 font-medium text-[#374151] transition-all hover:border-[#9CA3AF] hover:bg-[#F9FAFB] disabled:opacity-50"
                >
                  Hủy
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:from-[#7C3AED] hover:to-[#E11D48] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Đang đăng...</span>
                    </>
                  ) : (
                    <>
                      <FaEdit className="text-sm" />
                      <span>Đăng bài viết</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
