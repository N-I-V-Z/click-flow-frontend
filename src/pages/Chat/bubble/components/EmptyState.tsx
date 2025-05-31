import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface EmptyStateProps {
  quickReplies: string[];
  onSend: (text: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  quickReplies,
  onSend
}) => {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
        <Bot size={32} className="text-purple-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">
        Chào mừng bạn!
      </h3>
      <p className="mb-6 text-sm text-gray-600">
        Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn hoặc chọn một câu hỏi
        nhanh bên dưới
      </p>

      {/* Quick Replies */}
      <div className="flex flex-wrap justify-center gap-2">
        {quickReplies.map((reply, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onSend(reply)}
            className="text-xs hover:border-purple-300 hover:bg-purple-50"
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
};
