// File: src/components/ui/ConfirmModal.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  type = 'danger'
}) => {
  const typeConfig = {
    danger: {
      icon: FaTrash,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
      confirmBg: 'bg-red-500 hover:bg-red-600',
      accentColor: 'border-red-200'
    },
    warning: {
      icon: FaExclamationTriangle,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100',
      confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
      accentColor: 'border-yellow-200'
    },
    info: {
      icon: FaExclamationTriangle,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
      accentColor: 'border-blue-200'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ${config.accentColor} border-2`}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
            >
              <FaTimes className="text-sm" />
            </motion.button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.iconBg}`}
            >
              <IconComponent className={`text-2xl ${config.iconColor}`} />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
              <p className="mb-6 leading-relaxed text-gray-600">{message}</p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-3"
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                {cancelText}
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 rounded-xl px-4 py-3 font-medium text-white transition-all ${config.confirmBg}`}
              >
                {confirmText}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
