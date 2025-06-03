import React, { useState, useEffect, useRef } from 'react';
import { useGetOwnConversations } from '@/queries/conversation.query';
import {
  ChatTab,
  ConversationListApiResponse,
  MessageType,
  TokenDecoded
} from '@/types';
import {
  useGetMessagesByConversationId,
  useMaskAsRead,
  useSendMessage
} from '@/queries/message.query';
import __helpers from '@/helpers';
import Pusher from 'pusher-js';
import ChatSidebar from './components/ChatSidebar';
import ChatArea from './components/ChatArea';
import PageHead from '@/components/shared/page-head';

const ChatPage: React.FC = () => {
  // States
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationListApiResponse | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ChatTab>(ChatTab.All);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Queries
  const { data: conversations, refetch: refetchConversations } =
    useGetOwnConversations();
  const { mutateAsync: maskAsRead } = useMaskAsRead();
  const { data: messages, refetch: refetchMessages } =
    useGetMessagesByConversationId(selectedConversation?.id);
  const { mutateAsync: sendMessage } = useSendMessage();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageCountRef = useRef(0);
  const pusherRef = useRef<Pusher | null>(null);
  const subscribedChannelsRef = useRef<Set<string>>(new Set());

  // Helper functions
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const isAtBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    return (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + threshold
    );
  };

  const decodedToken: TokenDecoded | null = __helpers.decodeTokens(
    __helpers.cookie_get('AT')
  );

  // Effects
  useEffect(() => {
    const handleMaskAsRead = async () => {
      if (selectedConversation?.id !== undefined) {
        await maskAsRead({
          conversationId: selectedConversation?.id
        });
        refetchConversations();
      }
    };
    handleMaskAsRead();
  }, [selectedConversation, maskAsRead, refetchConversations]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom = isAtBottom();
      setShowScrollButton(!atBottom);

      if (atBottom && hasNewMessages) {
        setHasNewMessages(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNewMessages]);

  useEffect(() => {
    if (selectedConversation) {
      setShowScrollButton(false);
      setHasNewMessages(false);
      lastMessageCountRef.current = 0;

      setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
    }
  }, [selectedConversation?.id, selectedConversation]);

  useEffect(() => {
    if (!messages?.result) return;

    const currentMessageCount = messages.result.length;
    const wasAtBottom = isAtBottom();

    if (
      currentMessageCount > lastMessageCountRef.current &&
      lastMessageCountRef.current > 0
    ) {
      if (wasAtBottom) {
        setTimeout(() => scrollToBottom('smooth'), 100);
      } else {
        setHasNewMessages(true);
        setShowScrollButton(true);
      }
    } else if (lastMessageCountRef.current === 0) {
      setTimeout(() => scrollToBottom('auto'), 100);
    }

    lastMessageCountRef.current = currentMessageCount;
  }, [messages?.result]);

  // Global Pusher setup - lắng nghe tất cả conversations
  useEffect(() => {
    if (!conversations?.result || conversations.result.length === 0) return;

    // Initialize Pusher instance nếu chưa có
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY || '', {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        authEndpoint: `${import.meta.env.VITE_API_URL}/api/Pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${__helpers.cookie_get('AT')}`
          }
        }
      });
    }

    const pusher = pusherRef.current;

    // Subscribe to all conversations
    conversations.result.forEach((conversation) => {
      const channelName = `private-conversation-${conversation.id}`;

      // Chỉ subscribe nếu chưa subscribe channel này
      if (!subscribedChannelsRef.current.has(channelName)) {
        const channel = pusher.subscribe(channelName);

        channel.bind('new-message', (data: any) => {
          // Nếu tin nhắn mới từ conversation đang active
          if (conversation.id === selectedConversation?.id) {
            refetchMessages();
          }

          // Luôn refetch conversations để cập nhật unread count và last message
          refetchConversations();
        });

        channel.bind('messages-read', () => {
          // Cập nhật conversation list khi có tin nhắn được đánh dấu là đã đọc
          refetchConversations();

          // Nếu là conversation hiện tại thì cũng refetch messages
          if (conversation.id === selectedConversation?.id) {
            refetchMessages();
          }
        });

        subscribedChannelsRef.current.add(channelName);
      }
    });

    // Cleanup function
    return () => {
      if (pusherRef.current) {
        // Unsubscribe from all channels when component unmounts
        subscribedChannelsRef.current.forEach((channelName) => {
          const channel = pusherRef.current?.channel(channelName);
          if (channel) {
            channel.unbind_all();
            pusherRef.current?.unsubscribe(channelName);
          }
        });

        pusherRef.current.disconnect();
        pusherRef.current = null;
        subscribedChannelsRef.current.clear();
      }
    };
  }, [
    conversations?.result,
    selectedConversation?.id,
    refetchConversations,
    refetchMessages
  ]);

  // Handlers
  const handleSendMessage = async () => {
    if (!selectedConversation || !message.trim()) return;

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        text: message,
        type: MessageType.Text,
        file: undefined
      });

      setMessage('');
      setShowEmojiPicker(false);

      setTimeout(() => scrollToBottom('smooth'), 100);
      await refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = async (file: File) => {
    if (!selectedConversation) return;

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        type: file.type.startsWith('image/')
          ? MessageType.Image
          : MessageType.Voice,
        file: file
      });

      setTimeout(() => scrollToBottom('smooth'), 100);
      await refetchMessages();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleScrollButtonClick = () => {
    scrollToBottom('smooth');
    setHasNewMessages(false);
    setShowScrollButton(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const handleEmojiPickerClose = () => {
    setShowEmojiPicker(false);
  };

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="flex h-[95%] bg-gradient-to-br from-purple-50 to-indigo-50">
      <PageHead title={'ClickFlow - Hỗ trợ'} />

      <ChatSidebar
        conversations={conversations?.result}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ChatArea
        selectedConversation={selectedConversation}
        messages={messages?.result}
        currentUserId={decodedToken?.Id ? Number(decodedToken.Id) : undefined}
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        showScrollButton={showScrollButton}
        hasNewMessages={hasNewMessages}
        onScrollToBottom={handleScrollButtonClick}
        showEmojiPicker={showEmojiPicker}
        onToggleEmojiPicker={handleToggleEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        onEmojiPickerClose={handleEmojiPickerClose}
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

export default ChatPage;
