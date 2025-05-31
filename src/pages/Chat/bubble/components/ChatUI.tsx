// components/chat/ChatUI.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageApiResponse, TokenDecoded } from '@/types';
import __helpers from '@/helpers';

// Import các components con
import { ChatHeader } from './ChatHeader';
import { SearchBar } from './SearchBar';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { ScrollToBottom } from './ScrollToBottom';
import { ChatInput } from './ChatInput';
import { LoadingState } from './LoadingState';

interface ChatUIProps {
  conversationId: string;
  messages: MessageApiResponse[] | undefined;
  onSend: (text: string) => void;
  onSendFile: (file: File) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  isLoading?: boolean;
}

export const ChatUI: React.FC<ChatUIProps> = ({
  messages,
  onSend,
  onSendFile,
  isOpen = true,
  onToggle,
  isLoading = false
}) => {
  // States
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  // Scroll states
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Quick replies
  const [quickReplies] = useState([
    'Tôi có thể xem thống kê ở đâu?',
    'Hệ thống thanh toán hoạt động ra sao?',
    'Tôi muốn biết thêm về hoa hồng'
  ]);

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef<number>(0);
  const isUserScrolling = useRef<boolean>(false);
  const previousMessagesLength = useRef<number>(0);

  // Token
  const decodedToken: TokenDecoded | null = __helpers.decodeTokens(
    __helpers.cookie_get('AT')
  );

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    }
  }, []);

  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement;
        const threshold = 100;
        const nearBottom = scrollHeight - scrollTop - clientHeight < threshold;

        setIsNearBottom(nearBottom);
        setShowScrollToBottom(!nearBottom && scrollHeight > clientHeight);

        return nearBottom;
      }
    }
    return true;
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const nearBottom = checkIfNearBottom();

    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollElement) {
        const currentScrollTop = scrollElement.scrollTop;

        if (Math.abs(currentScrollTop - lastScrollTop.current) > 5) {
          isUserScrolling.current = true;
          setTimeout(() => {
            isUserScrolling.current = false;
          }, 150);
        }

        lastScrollTop.current = currentScrollTop;

        if (nearBottom && unreadCount > 0) {
          setUnreadCount(0);
        }
      }
    }
  }, [checkIfNearBottom, unreadCount]);

  // Auto-scroll logic with improved conditions
  useEffect(() => {
    if (!messages || !isOpen) return;

    const hasNewMessages = messages.length > previousMessagesLength.current;
    const lastMessage = messages[messages.length - 1];
    const isOwnMessage =
      decodedToken?.Id !== undefined &&
      lastMessage?.senderId === Number(decodedToken.Id);

    previousMessagesLength.current = messages.length;

    if (hasNewMessages) {
      if (isOwnMessage) {
        setTimeout(() => scrollToBottom(true), 100);
      } else if (isNearBottom) {
        setTimeout(() => scrollToBottom(true), 100);
      } else {
        setUnreadCount((prev) => prev + 1);
      }
    } else if (messages.length > 0 && previousMessagesLength.current === 0) {
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [messages, isOpen, isNearBottom, decodedToken?.Id, scrollToBottom]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen && messages && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [isOpen, messages, scrollToBottom]);

  // Handle typing indicator
  useEffect(() => {
    if (
      messages?.length &&
      messages[messages.length - 1]?.sender.role === 'admin'
    ) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Auto-scroll when typing indicator appears/disappears
  useEffect(() => {
    if (isNearBottom) {
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [isTyping, isNearBottom, scrollToBottom]);

  // Set up scroll listener
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      setTimeout(() => checkIfNearBottom(), 100);

      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, handleScroll, checkIfNearBottom]);

  // Handlers
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isSending) return;

    setIsSending(true);
    try {
      await onSend(messageText);
      setInput('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const copyMessage = async (content: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleScrollToBottom = () => {
    scrollToBottom(true);
    setUnreadCount(0);
  };

  const filteredMessages = React.useMemo(() => {
    if (!messages) return [];
    if (isSearchMode && searchQuery) {
      return messages.filter((msg) =>
        msg?.text?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return messages;
  }, [messages, isSearchMode, searchQuery]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="cart flex h-full flex-col overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-white shadow-2xl">
      {/* Header */}
      <ChatHeader
        isSearchMode={isSearchMode}
        onToggleSearch={() => setIsSearchMode(!isSearchMode)}
        onToggle={onToggle}
      />

      {/* Search Bar */}
      {isSearchMode && (
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      )}

      {/* Messages Area */}
      <CardContent className="relative flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-1 p-4">
            {filteredMessages.length === 0 && !isSearchMode ? (
              <EmptyState quickReplies={quickReplies} onSend={handleSend} />
            ) : (
              <>
                {filteredMessages?.map((msg, index) => {
                  const prevMsg = filteredMessages[index - 1];
                  const showDate =
                    !prevMsg ||
                    new Date(msg.sentAt).toDateString() !==
                      new Date(prevMsg.sentAt).toDateString();

                  return (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      showDate={showDate}
                      decodedToken={decodedToken}
                      onCopy={copyMessage}
                      copiedMessageId={copiedMessageId}
                    />
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && <TypingIndicator />}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Scroll to Bottom Button */}
        {showScrollToBottom && !isNearBottom && (
          <ScrollToBottom
            unreadCount={unreadCount}
            onScrollToBottom={handleScrollToBottom}
          />
        )}
      </CardContent>

      {/* Input Area */}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onSendFile={onSendFile}
        isSending={isSending}
        showEmojiPicker={showEmojiPicker}
        onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
      />
    </Card>
  );
};
