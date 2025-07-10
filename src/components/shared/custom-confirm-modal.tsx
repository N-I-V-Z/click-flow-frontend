import React from 'react';

interface CustomConfirmModalProps {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  title,
  content,
  okText = 'Đồng ý',
  cancelText = 'Hủy',
  onOk,
  onCancel,
  loading = false
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm duration-200 animate-in fade-in">
      <div className="relative mx-4 w-full max-w-md rounded-xl border-2 border-purple-200 bg-white shadow-2xl duration-300 animate-in zoom-in-95 slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-full p-1 transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50"
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
        <div className="flex justify-end space-x-3 border-t border-gray-200 p-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onOk}
            disabled={loading}
            className="flex min-w-[80px] items-center justify-center rounded-lg bg-purple-600 px-4 py-2 font-medium text-white shadow-lg transition-colors duration-200 hover:bg-purple-700 hover:shadow-purple-200 disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading ? 'Đang xử lý...' : okText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;
