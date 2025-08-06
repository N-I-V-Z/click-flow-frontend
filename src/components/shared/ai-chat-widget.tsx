import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { useChatAI } from '@/queries/chat-ai.query';
import { message } from 'antd';

interface Message {
  id: string;
  text: string;
  fromAI: boolean;
  timestamp: Date;
}

interface AIChatWidgetProps {
  className?: string;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI của ClickFlow. Tôi có thể giúp bạn tìm hiểu về nền tảng và các tính năng của chúng tôi. Bạn cần hỗ trợ gì?',
      fromAI: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatAI = useChatAI();

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatAI.isPending]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      fromAI: false,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      // Call AI API
      const response = await chatAI.mutateAsync(question);

      if (response.isSuccess && response.result) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.result,
          fromAI: true,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      message.error(
        'Không thể kết nối với AI assistant. Vui lòng thử lại sau.'
      );

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ support team.',
        fromAI: true,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[1000] font-sans ${className || ''}`}
    >
      {isOpen ? (
        <div className="flex h-[480px] w-80 flex-col overflow-hidden rounded-2xl border border-purple-300 bg-gradient-to-br from-purple-100 via-blue-50 to-white shadow-2xl backdrop-blur-xl duration-300 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-purple-300 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-white backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Bot className="h-3 w-3" />
              </div>
              Trợ lý AI - ClickFlow
            </div>
            <button
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-white/20 text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:text-white"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent flex flex-1 flex-col gap-3 overflow-y-auto bg-white/5 p-3 backdrop-blur-sm">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex w-full ${msg.fromAI ? 'justify-start' : 'justify-end'} duration-300 animate-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`flex min-w-0 max-w-[85%] ${msg.fromAI ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {msg.fromAI && (
                      <div className="mr-2 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                        <Bot className="h-3 w-3" />
                      </div>
                    )}
                    <div
                      className={`min-w-0 max-w-full flex-1 overflow-hidden rounded-2xl px-3 py-2 text-sm shadow-lg backdrop-blur-sm transition-all ${
                        msg.fromAI
                          ? 'rounded-bl-lg border border-purple-200 bg-gradient-to-br from-white/90 to-purple-50 text-gray-800'
                          : 'ml-2 rounded-br-lg bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 text-white shadow-purple-400/40'
                      }`}
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    >
                      <p className="overflow-wrap-break-word m-0 whitespace-pre-wrap break-words leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-1 text-xs ${
                    msg.fromAI
                      ? 'ml-8 text-left text-gray-500'
                      : 'mr-2 text-right text-gray-500'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {chatAI.isPending && (
              <div>
                <div className="flex w-full justify-start duration-300 animate-in slide-in-from-bottom-2">
                  <div className="flex min-w-0 max-w-[85%]">
                    <div className="mr-2 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="min-w-0 max-w-full flex-1 overflow-hidden rounded-2xl rounded-bl-lg border border-purple-200 bg-gradient-to-br from-white/90 to-purple-50 px-3 py-2 text-gray-800 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]"></div>
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]"></div>
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-8 mt-1 text-left text-xs text-gray-500">
                  Đang trả lời...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="rounded-b-2xl border-t border-white/20 bg-gradient-to-r from-purple-200/30 via-pink-200/20 to-blue-200/30 p-3 backdrop-blur-xl">
            <div className="flex items-end gap-2">
              <textarea
                className="max-h-16 min-h-[20px] flex-1 resize-none rounded-2xl border-2 border-purple-300/50 bg-white/40 px-3 py-2 font-sans text-sm text-gray-700 placeholder-gray-500 outline-none backdrop-blur-xl transition-all duration-200 focus:border-purple-400/70 focus:bg-white/50 focus:shadow-lg focus:shadow-purple-400/20"
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={chatAI.isPending}
                rows={1}
                style={{
                  resize: 'none',
                  overflow: 'hidden',
                  minHeight: '20px',
                  maxHeight: '64px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />

              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-400/50 disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                onClick={handleSend}
                disabled={!input.trim() || chatAI.isPending}
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-2 text-center text-xs italic text-gray-600">
              Nhấn Enter để gửi tin nhắn
            </div>
          </div>
        </div>
      ) : (
        <button
          className="relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-none bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 hover:shadow-2xl hover:shadow-purple-400/60 active:scale-95"
          onClick={toggleChat}
        >
          <Bot className="h-5 w-5 text-white transition-transform duration-300 hover:scale-110" />
        </button>
      )}
    </div>
  );
};

export default AIChatWidget;
