import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
  show: boolean;
  hasNewMessages: boolean;
  onClick: () => void;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  show,
  hasNewMessages,
  onClick
}) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl"
      title="Cuộn xuống cuối"
    >
      <div className="relative">
        <ChevronDown className="h-5 w-5 text-gray-600" />
        {hasNewMessages && (
          <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
        )}
      </div>
    </button>
  );
};

export default ScrollToBottomButton;
