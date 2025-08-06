import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  MessageCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useChatAI } from '@/queries/chat-ai.query';
import { message } from 'antd';

interface Message {
  id: string;
  text: string;
  fromAI: boolean;
  timestamp: Date;
}

interface AIChatWidgetAdvancedProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'purple' | 'blue' | 'green';
  showNotification?: boolean;
}

const AIChatWidgetAdvanced: React.FC<AIChatWidgetAdvancedProps> = ({
  className,
  position = 'bottom-right',
  theme = 'purple',
  showNotification = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI của ClickFlow. Tôi có thể giúp bạn tìm hiểu về nền tảng và các tính năng của chúng tôi. Bạn cần hỗ trợ gì?',
      fromAI: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatAI = useChatAI();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

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

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // Call AI API
      const response = await chatAI.mutateAsync(question);

      if (response && response.isSuccess && response.result) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.result,
          fromAI: true,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Add notification if chat is closed
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      } else {
        throw new Error(response?.message || 'Có lỗi xảy ra');
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
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-72';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-72';
      default:
        return 'bottom-6 left-72';
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'blue':
        return {
          primary: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
          secondary: 'bg-gradient-to-br from-blue-500 to-blue-600',
          hover: 'hover:from-cyan-600 hover:to-cyan-700'
        };
      case 'green':
        return {
          primary: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
          secondary: 'bg-gradient-to-br from-green-500 to-green-600',
          hover: 'hover:from-emerald-600 hover:to-emerald-700'
        };
      default:
        return {
          primary: 'bg-gradient-to-br from-purple-500 to-purple-600',
          secondary:
            'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600',
          hover: 'hover:from-purple-600 hover:via-pink-600 hover:to-purple-700'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div
      className={`fixed z-[1000] font-sans ${getPositionClass()} ${className || ''}`}
    >
      {isOpen ? (
        <div
          className={`flex w-96 flex-col overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl backdrop-blur-xl duration-300 animate-in slide-in-from-bottom-4 ${isMinimized ? 'h-16' : 'h-[600px]'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-purple-400/30 bg-gradient-to-r from-white/10 to-white/5 px-5 py-4 text-white backdrop-blur-sm">
            <div className="flex items-center gap-2 text-base font-semibold text-white">
              <div
                className={`h-8 w-8 rounded-full ${colors.primary} flex items-center justify-center text-white shadow-lg`}
              >
                <Bot className="h-4 w-4" />
              </div>
              Trợ lý AI - ClickFlow
              <span className="ml-auto flex items-center gap-1 text-xs text-cyan-300 opacity-80">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"></div>
                Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white"
                onClick={toggleMinimize}
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </button>
              <button
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-white/10 text-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white"
                onClick={toggleChat}
                title="Đóng chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages - Hidden when minimized */}
          {!isMinimized && (
            <>
              <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex flex-1 flex-col gap-4 overflow-y-auto bg-transparent p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex w-full ${msg.fromAI ? 'justify-start' : 'justify-end'} duration-300 animate-in slide-in-from-bottom-2`}
                  >
                    <div
                      className={`flex min-w-0 max-w-[85%] ${msg.fromAI ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      {msg.fromAI && (
                        <div
                          className={`h-8 w-8 rounded-full ${colors.primary} mr-2 mt-0.5 flex flex-shrink-0 items-center justify-center text-white`}
                        >
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`min-w-0 max-w-full flex-1 overflow-hidden rounded-2xl px-4 py-3 shadow-sm transition-all ${
                          msg.fromAI
                            ? 'rounded-bl-lg border border-purple-200 bg-white text-gray-800'
                            : `${colors.primary} ml-2 rounded-br-lg text-white`
                        }`}
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        <p className="overflow-wrap-break-word m-0 whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {msg.text}
                        </p>
                        <div
                          className={`mt-1 text-xs ${
                            msg.fromAI
                              ? 'text-left text-gray-400'
                              : 'text-right text-white/70'
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {chatAI.isPending && (
                  <div className="flex w-full justify-start duration-300 animate-in slide-in-from-bottom-2">
                    <div className="flex min-w-0 max-w-[85%]">
                      <div
                        className={`h-8 w-8 rounded-full ${colors.primary} mr-2 mt-0.5 flex flex-shrink-0 items-center justify-center text-white`}
                      >
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 max-w-full flex-1 overflow-hidden rounded-2xl rounded-bl-lg border border-purple-200 bg-white px-4 py-3 text-gray-800 shadow-sm">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        </div>
                        <div className="mt-1 text-left text-xs text-gray-400">
                          Đang trả lời...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="rounded-b-2xl border-t border-purple-400/30 bg-gradient-to-r from-white/10 to-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    className="max-h-20 min-h-[20px] flex-1 resize-none rounded-3xl border border-white/20 bg-white/10 px-4 py-2.5 font-sans text-sm text-white placeholder-slate-300 outline-none backdrop-blur-sm transition-all duration-200 focus:border-purple-400/50 focus:bg-white/15 focus:shadow-lg focus:shadow-purple-500/20"
                    placeholder="Nhập câu hỏi của bạn..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={chatAI.isPending}
                    rows={1}
                    style={{
                      resize: 'none',
                      overflow: 'hidden',
                      minHeight: '20px',
                      maxHeight: '80px'
                    }}
                  />
                  <button
                    className={`${colors.secondary} ${colors.hover} flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 disabled:transform-none disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none`}
                    onClick={handleSend}
                    disabled={!input.trim() || chatAI.isPending}
                    title="Gửi tin nhắn (Enter)"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-center text-xs italic text-slate-300">
                  Nhấn Enter để gửi • Esc để đóng
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          className={`h-14 w-14 rounded-full ${colors.secondary} ${colors.hover} relative flex cursor-pointer items-center justify-center overflow-hidden border-none shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95`}
          onClick={toggleChat}
        >
          <MessageCircle className="h-6 w-6 text-white transition-transform duration-300 hover:scale-110" />
          {showNotification && unreadCount > 0 && (
            <div className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-pink-500 to-red-500 text-xs font-bold text-white shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default AIChatWidgetAdvanced;
