import React from 'react';
import BasePages from '@/components/shared/base-pages';
import ChatAI from '@/components/shared/chat-ai';

const ChatAIPage: React.FC = () => {
  return (
    <BasePages pageHead="ClickFlow - Chat AI">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#EEF2FF] to-[#E0E7FF] p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              Chat với AI Assistant
            </h1>
            <p className="text-slate-600">
              Hỏi bất kỳ câu hỏi nào về ClickFlow và các tính năng của chúng tôi
            </p>
          </div>

          <ChatAI className="w-full" />
        </div>
      </div>
    </BasePages>
  );
};

export default ChatAIPage;
