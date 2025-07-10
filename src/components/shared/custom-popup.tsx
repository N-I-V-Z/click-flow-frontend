import React from 'react';

interface CustomPopupProps {
  title: string;
  content: string;
  onClose: () => void;
  type?: 'warning' | 'info' | 'error' | 'success';
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  title,
  content,
  onClose,
  type = 'warning'
}) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg
            className="h-6 w-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'success':
        return (
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm duration-200 animate-in fade-in">
      <div
        className={`
        relative mx-4 w-full max-w-md rounded-xl border-2 bg-white shadow-2xl
        duration-300 animate-in zoom-in-95 slide-in-from-bottom-4
        ${getTypeClasses()}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors duration-200 hover:bg-gray-100"
          >
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="leading-relaxed text-gray-700">{content}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white shadow-lg transition-colors duration-200 hover:bg-purple-700 hover:shadow-purple-200"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
