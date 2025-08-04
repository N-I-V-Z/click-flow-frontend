import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import ChatAI from './chat-ai';

interface ChatAIFloatingProps {
  className?: string;
}

const ChatAIFloating: React.FC<ChatAIFloatingProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 h-[500px] w-96 rounded-lg border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold text-slate-900">Chat AI</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(500px-60px)]">
            <ChatAI className="h-full border-0" />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default ChatAIFloating;
