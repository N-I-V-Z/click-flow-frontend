import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="mb-4 flex items-end justify-start gap-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
        <Bot size={16} className="text-white" />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};
