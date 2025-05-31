import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomProps {
  unreadCount: number;
  onScrollToBottom: () => void;
}

export const ScrollToBottom: React.FC<ScrollToBottomProps> = ({
  unreadCount,
  onScrollToBottom
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button
        onClick={onScrollToBottom}
        size="sm"
        className="relative h-10 w-10 rounded-full border border-gray-200 bg-white p-0 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl"
        variant="outline"
      >
        <ChevronDown size={16} className="text-gray-600" />
        {unreadCount > 0 && (
          <div className="bg-red-500 absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </Button>
    </div>
  );
};
