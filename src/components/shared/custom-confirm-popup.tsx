import React from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

interface CustomConfirmPopupProps {
  isVisible: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const CustomConfirmPopup: React.FC<CustomConfirmPopupProps> = ({
  isVisible,
  title,
  message,
  type = 'confirm',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmLoading = false,
  onConfirm,
  onCancel,
  onClose
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <ExclamationCircleOutlined className="text-4xl text-orange-500" />
        );
      case 'info':
        return <ExclamationCircleOutlined className="text-4xl text-blue-500" />;
      default:
        return (
          <ExclamationCircleOutlined className="text-4xl text-purple-500" />
        );
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-orange-400/30 hover:shadow-orange-500/50';
      case 'info':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-blue-400/30 hover:shadow-blue-500/50';
      default:
        return 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 shadow-purple-400/30 hover:shadow-purple-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative z-10 mx-4 w-full max-w-md duration-300 animate-in fade-in-0 zoom-in-95">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-400/30 opacity-75 blur-xl" />

        {/* Main container */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-100/50 to-pink-100/50 blur-2xl" />
          <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-50/50 to-pink-50/50 blur-xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-gray-700"
          >
            <CloseOutlined className="text-sm" />
          </button>

          {/* Content */}
          <div className="relative p-8">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                {getIcon()}
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-4 text-center text-xl font-bold text-gray-800">
              {title}
            </h3>

            {/* Message */}
            <p className="mb-8 text-center leading-relaxed text-gray-600">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              {/* Cancel button */}
              <button
                onClick={onCancel}
                disabled={confirmLoading}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelText}
              </button>

              {/* Confirm button */}
              <button
                onClick={onConfirm}
                disabled={confirmLoading}
                className={`flex-1 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${getConfirmButtonClass()}`}
              >
                {confirmLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckOutlined />
                    {confirmText}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmPopup;
