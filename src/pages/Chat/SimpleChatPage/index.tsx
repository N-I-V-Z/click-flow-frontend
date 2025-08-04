import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography, Spin, Input } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Send, Smile, Search } from 'lucide-react';
import {
  useGetMessagesByConversationId,
  useSendMessage
} from '@/queries/message.query';
import { useGetOwnConversations } from '@/queries/conversation.query';
import { MessageType, ConversationListApiResponse } from '@/types';
import __helpers from '@/helpers';
import Pusher from 'pusher-js';
import PageHead from '@/components/shared/page-head';
import EmojiPicker from '../components/EmojiPicker';
import ImageUpload from '../components/ImageUploadComponent';
import { ImageViewer } from '../components/ImageViewer';

const { Text } = Typography;

const SimpleChatPage: React.FC = () => {
  // States
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [adminConversation, setAdminConversation] =
    useState<ConversationListApiResponse | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageViewerState, setImageViewerState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    timestamp?: string | Date;
  }>({
    isOpen: false,
    imageUrl: ''
  });

  // Queries
  const { data: conversations } = useGetOwnConversations();
  const { data: messages, refetch: refetchMessages } =
    useGetMessagesByConversationId(adminConversation?.id);
  const { mutateAsync: sendMessage } = useSendMessage();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pusherRef = useRef<Pusher | null>(null);

  // Tìm conversation với admin (role = 'Admin')
  useEffect(() => {
    if (conversations?.result && conversations.result.length > 0) {
      // Tìm conversation có partner là admin
      const adminConv = conversations.result.find(
        (conv) => conv.parner?.role === 'Admin'
      );

      if (adminConv) {
        setAdminConversation(adminConv);
      } else {
        // Nếu chưa có conversation với admin, có thể tạo mới hoặc hiển thị thông báo
        console.log('Chưa có cuộc trò chuyện với Admin');
      }
    }
  }, [conversations]);

  // Setup Pusher for real-time messaging
  useEffect(() => {
    if (!adminConversation?.id) return;

    const token = __helpers.cookie_get('AT');
    if (!token) return;

    console.log('Setting up Pusher for conversation:', adminConversation.id);

    // Initialize Pusher
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        authEndpoint: `${import.meta.env.VITE_API_URL}/pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      // Log connection events
      pusherRef.current.connection.bind('connected', () => {
        console.log('Pusher connected');
      });

      pusherRef.current.connection.bind('error', (error: unknown) => {
        console.error('Pusher connection error:', error);
      });
    }

    // Subscribe to conversation channel
    const channelName = `private-conversation.${adminConversation.id}`;
    console.log('Subscribing to channel:', channelName);

    const channel = pusherRef.current.subscribe(channelName);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Successfully subscribed to channel:', channelName);
    });

    channel.bind('pusher:subscription_error', (error: unknown) => {
      console.error('Subscription error:', error);
    });

    channel.bind('message.sent', (data: unknown) => {
      console.log('New message received:', data);
      // Refresh messages when new message received
      setTimeout(() => {
        refetchMessages();
      }, 100);
      scrollToBottom();
    });

    return () => {
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(channelName);
        console.log('Unsubscribed from channel:', channelName);
      }
    };
  }, [adminConversation?.id, refetchMessages]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Auto refresh messages every 5 seconds as fallback for real-time
  useEffect(() => {
    if (!adminConversation?.id) return;

    const interval = setInterval(() => {
      refetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [adminConversation?.id, refetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages?.result && messages.result.length > 0) {
      scrollToBottom();
    }
  }, [messages?.result]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim() || !adminConversation?.id || isSending) return;

    setIsSending(true);
    try {
      await sendMessage({
        conversationId: adminConversation.id,
        text: message.trim(),
        type: MessageType.Text
      });
      setMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle send file
  const handleSendFile = async (file: File) => {
    if (!adminConversation?.id) return;

    try {
      await sendMessage({
        conversationId: adminConversation.id,
        file: file,
        type: MessageType.Image
      });
      scrollToBottom();
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Close emoji picker
  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  // Handle image click
  const handleImageClick = (imageUrl: string, timestamp?: string | Date) => {
    setImageViewerState({
      isOpen: true,
      imageUrl,
      timestamp
    });
  };

  // Close image viewer
  const handleCloseImageViewer = () => {
    setImageViewerState({
      isOpen: false,
      imageUrl: ''
    });
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter messages based on search term with context
  const getMessagesWithContext = () => {
    if (!searchTerm || !messages?.result) {
      return messages?.result || [];
    }

    const allMessages = messages.result;
    const matchingIndices: number[] = [];

    // Find all matching message indices
    allMessages.forEach((msg, index) => {
      if (msg.text?.toLowerCase().includes(searchTerm.toLowerCase())) {
        matchingIndices.push(index);
      }
    });

    if (matchingIndices.length === 0) {
      return [];
    }

    // Get context around matching messages (3 messages before and after)
    const contextIndices = new Set<number>();
    matchingIndices.forEach((index) => {
      for (
        let i = Math.max(0, index - 3);
        i <= Math.min(allMessages.length - 1, index + 3);
        i++
      ) {
        contextIndices.add(i);
      }
    });

    // Return messages with context, maintaining original order
    return Array.from(contextIndices)
      .sort((a, b) => a - b)
      .map((index) => ({
        ...allMessages[index],
        isSearchMatch: allMessages[index].text
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      }));
  };

  const displayMessages = getMessagesWithContext();

  // Toggle search
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  // Get current user ID from token
  const getCurrentUserId = (): number => {
    const token = __helpers.cookie_get('AT');
    if (!token) return 0;
    const decoded = __helpers.decodeTokens(token);
    return decoded ? parseInt(decoded.Id) : 0;
  };

  // Format message time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!adminConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <PageHead title="Trò chuyện với Admin" />
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text type="secondary">Đang tải cuộc trò chuyện...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <PageHead title="Trò chuyện với Admin" />

      {/* Header */}
      <div className="border-b border-purple-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                icon={<UserOutlined />}
                className="bg-gradient-to-r from-purple-500 to-indigo-500"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Admin ClickFlow</div>
              <div className="text-sm text-purple-600">
                Hỗ trợ khách hàng • Đang hoạt động
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={toggleSearch}
            className={`rounded-full p-2 transition-colors ${
              showSearch
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-400 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input */}
        {showSearch && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Tìm kiếm tin nhắn..."
              className="w-full rounded-lg border border-purple-200 bg-purple-50/50 px-3 py-2 text-sm transition-all duration-200 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto p-4">
          <div className="space-y-4">
            {displayMessages?.map((msg) => {
              const isSender = msg.senderId === getCurrentUserId();
              const msgWithSearch = msg as typeof msg & {
                isSearchMatch?: boolean;
              };
              const isHighlighted = searchTerm && msgWithSearch.isSearchMatch;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm transition-all lg:max-w-md ${
                      isSender
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : 'border border-purple-100 bg-white text-gray-800'
                    } ${isHighlighted ? 'ring-2 ring-yellow-300' : ''} ${
                      searchTerm && !msgWithSearch.isSearchMatch
                        ? 'opacity-60'
                        : ''
                    }`}
                  >
                    {/* Hiển thị hình ảnh nếu có */}
                    {msg.type === MessageType.Image && msg.fileUrl && (
                      <div className="space-y-2">
                        <img
                          src={msg.fileUrl}
                          alt="Shared image"
                          className="max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                          loading="lazy"
                          title="Click để xem ảnh lớn"
                          onClick={() =>
                            handleImageClick(msg.fileUrl!, msg.sentAt)
                          }
                        />
                      </div>
                    )}

                    {/* Hiển thị text nếu có */}
                    {msg.text && (
                      <div className="break-words">
                        {isHighlighted && searchTerm ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: msg.text.replace(
                                new RegExp(`(${searchTerm})`, 'gi'),
                                '<mark class="bg-yellow-200 text-black">$1</mark>'
                              )
                            }}
                          />
                        ) : (
                          msg.text
                        )}
                      </div>
                    )}

                    <div
                      className={`mt-2 text-xs ${
                        isSender ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.sentAt.toString())}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Emoji Picker */}
      <EmojiPicker
        isVisible={showEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        onClose={closeEmojiPicker}
        className="absolute bottom-20 right-4"
      />

      {/* Message Input */}
      <div className="border-t border-purple-200 bg-white/80 p-4 backdrop-blur-sm">
        <div className="flex items-end space-x-3">
          {/* Image Upload */}
          <div className="relative">
            <ImageUpload onSendFile={handleSendFile} />
          </div>

          {/* Message Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-3 pr-12 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500 focus-visible:shadow-none focus-visible:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={toggleEmojiPicker}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transform transition-colors ${
                showEmojiPicker
                  ? 'text-purple-500'
                  : 'text-purple-400 hover:text-purple-600'
              }`}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-3 text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-indigo-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ImageViewer Modal */}
      <ImageViewer
        isOpen={imageViewerState.isOpen}
        imageUrl={imageViewerState.imageUrl}
        imageAlt="Enlarged view"
        timestamp={imageViewerState.timestamp}
        onClose={handleCloseImageViewer}
      />
    </div>
  );
};

export default SimpleChatPage;
