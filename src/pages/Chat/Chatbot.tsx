import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Send,
  Bot,
  User,
  History,
  Minimize2,
  Clock,
  Paperclip,
  Smile,
  Copy,
  ThumbsUp,
  Search
} from 'lucide-react';

export interface Message {
  id: string;
  sender: 'admin' | 'advertiser';
  content: string;
  timestamp: string;
  type?: 'text' | 'image' | 'file';
  reactions?: string[];
  isTyping?: boolean;
}

interface ChatUIProps {
  conversationId: string;
  messages: Message[];
  onSend: (text: string) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const ChatUI: React.FC<ChatUIProps> = ({
  messages,
  onSend,
  isOpen = true,
  onToggle
}) => {
  const [input, setInput] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [quickReplies] = useState([
    'Cảm ơn bạn!',
    'Tôi cần hỗ trợ thêm',
    'Có thể giải thích rõ hơn không?',
    'Hoàn hảo!'
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '👍', '❤️', '😂', '😮', '😢', '🔥', '💯', '🎉', '👏'];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && !isHistoryOpen && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isHistoryOpen, isOpen]);

  // Simulate typing indicator
  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === 'advertiser'
    ) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;
    onSend(messageText);
    setInput('');
    inputRef.current?.focus();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload
      onSend(`📎 Đã gửi file: ${file.name}`);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Handle message reactions (would update in parent component)
    console.log(`Reaction ${emoji} to message ${messageId}`);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show toast notification
  };

  const filteredMessages =
    isSearchMode && searchQuery
      ? messages.filter((msg) =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : messages;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const TypingIndicator = () => (
    <div className="mb-4 flex items-center justify-start gap-2">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
        <Bot size={16} className="text-white" />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3">
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

  const MessageBubble = ({ msg }: { msg: Message }) => (
    <div
      className={`group flex items-end gap-2 ${msg.sender === 'advertiser' ? 'justify-end' : 'justify-start'}`}
    >
      {msg.sender === 'admin' && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`relative max-w-[75%] ${msg.sender === 'advertiser' ? 'order-first' : ''}`}
      >
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md
          ${
            msg.sender === 'advertiser'
              ? 'rounded-br-md bg-gradient-to-br from-blue to-blue text-white'
              : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'
          } $`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

          {/* Message reactions */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {msg.reactions.map((reaction, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}

          {/* Message actions - only show on hover */}
          <div
            className={`absolute top-0 ${msg.sender === 'advertiser' ? '-left-8' : '-right-8'} flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100`}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 bg-gray-400 p-0 shadow-sm hover:bg-gray-50"
              onClick={() => handleReaction(msg.id, '👍')}
            >
              <ThumbsUp size={12} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 bg-gray-400 p-0 shadow-sm hover:bg-gray-50"
              onClick={() => copyMessage(msg.content)}
            >
              <Copy size={12} />
            </Button>
          </div>
        </div>

        <div
          className={`mt-1 flex items-center gap-1 px-2 opacity-0 transition-opacity group-hover:opacity-100
          ${msg.sender === 'advertiser' ? 'justify-end' : 'justify-start'}`}
        >
          <Clock size={12} className="text-gray-400" />
          <span className="text-xs text-gray-400">
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </div>

      {msg.sender === 'advertiser' && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-indigo-500">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );

  if (!isOpen) {
    return (
      <Button
        onClick={() => onToggle?.(true)}
        className="fixed bottom-6 right-6 h-16 w-16 transform rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg transition-all duration-300 hover:scale-110 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 hover:shadow-2xl"
        aria-label="Open chat"
      >
        <Bot size={28} className="text-white" />
        <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-400"></div>
      </Button>
    );
  }

  return (
    <Card className=" text-white' flex h-full flex-col overflow-hidden border-0 bg-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-2xl">
      {/* Header */}
      <CardHeader
        className="
            flex flex-row items-center
        justify-between space-y-0 bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white "
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold ">Admin Support</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchMode(!isSearchMode)}
            className="text-white hover:bg-white/20"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="text-white hover:bg-white/20"
          >
            <History size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle?.(false)}
            className="text-white hover:bg-white/20"
          >
            <Minimize2 size={18} />
          </Button>
        </div>
      </CardHeader>

      {/* Search Bar */}
      {isSearchMode && (
        <div className="border-b bg-gray-50 p-3">
          <Input
            placeholder="Tìm kiếm trong cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
      )}

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white p-0">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="space-y-4 p-4">
            {/* History Section */}
            {isHistoryOpen && historyMessages.length > 0 && (
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    Tin nhắn cũ
                  </div>
                </div>
                {historyMessages.map((msg, index) => (
                  <div key={msg.id} className="mb-4 opacity-75">
                    {index === 0 && (
                      <div className="mb-3 text-center">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <MessageBubble msg={msg} />
                  </div>
                ))}
                <div className="my-4 flex items-center justify-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                    Tin nhắn mới
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {filteredMessages.length === 0 && !isHistoryOpen && (
              <div className="py-8 text-center">
                <div
                  className=" to-pink-100' mx-auto mb-4 flex h-16 
                  w-16 items-center justify-center
                 rounded-full bg-gradient-to-br from-purple-100 "
                >
                  <Bot size={32} className="text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Chào mừng bạn!
                </h3>
                <p className="text-sm text-gray-600">
                  Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn
                </p>

                {/* Quick Replies */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {quickReplies.map((reply, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSend(reply)}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Messages */}
            {filteredMessages.map((msg, index) => (
              <div key={msg.id}>
                {index === 0 && !isHistoryOpen && (
                  <div className="mb-4 text-center">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                )}
                <MessageBubble msg={msg} />
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input Area */}
      <CardFooter className="border-t border-gray-100 bg-white p-4">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 grid grid-cols-5 gap-2 rounded-lg border bg-white p-3 shadow-lg">
            {emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleEmojiClick(emoji)}
                className="rounded p-1 text-xl transition-colors hover:bg-gray-100"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex w-full items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <Paperclip size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Smile size={18} />
          </Button>

          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Nhập tin nhắn của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && handleSend()
              }
              className="rounded-xl border-gray-200 pr-12 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 transition-all duration-200 hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </CardFooter>
    </Card>
  );
};
