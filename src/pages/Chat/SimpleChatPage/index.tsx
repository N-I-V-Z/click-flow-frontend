import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Typography, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Send, Smile, Search } from 'lucide-react';
import {
  useGetMessagesByConversationId,
  useSendMessage
} from '@/queries/message.query';
import {
  useGetOwnConversations,
  useCreateConversation
} from '@/queries/conversation.query';
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
  const [isConversationLoaded, setIsConversationLoaded] = useState(false);
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
  const { data: conversations, refetch: refetchConversations } =
    useGetOwnConversations();
  const { data: messages, refetch: refetchMessages } =
    useGetMessagesByConversationId(adminConversation?.id);
  const { mutateAsync: sendMessage } = useSendMessage();
  const { mutateAsync: createConversation } = useCreateConversation();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pusherRef = useRef<Pusher | null>(null);

  // Tìm conversation với admin (role = 'Admin')
  useEffect(() => {
    if (conversations?.result) {
      // Tìm conversation có partner là admin
      const adminConv = conversations.result.find(
        (conv) => conv.parner?.role === 'Admin'
      );

      setAdminConversation(adminConv || null);
      setIsConversationLoaded(true);
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
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      let conversationId = adminConversation?.id;

      // Nếu chưa có conversation với admin, tạo mới
      if (!conversationId) {
        const adminId = 1; // ID của admin (có thể lấy từ config hoặc API khác)
        const response = await createConversation({ targetUserId: adminId });

        if (response.isSuccess && response.result) {
          conversationId = response.result.id;
          // Refresh conversations để cập nhật state
          await refetchConversations();
        } else {
          throw new Error('Không thể tạo cuộc trò chuyện với Admin');
        }
      }

      // Gửi tin nhắn
      await sendMessage({
        conversationId: conversationId!,
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

  // Format message time - Convert UTC to Vietnam time (+7 hours)
  const formatTime = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '--:--';
      }

      // Add 7 hours to convert UTC to Vietnam time
      const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

      return vietnamTime.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '--:--';
    }
  };

  if (!isConversationLoaded) {
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

  if (!adminConversation) {
    return (
      <div className="flex h-[calc(100vh-120px)] flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <PageHead title="Trò chuyện với Admin" />

        {/* Header */}
        <div className="border-b border-purple-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                icon={<UserOutlined />}
                className="bg-gradient-to-r from-purple-500 to-indigo-500"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-gray-400"></div>
            </div>
            <div>
              <div className="font-semibold text-gray-800">Admin ClickFlow</div>
              <div className="text-sm text-gray-500">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100">
                <svg
                  className="h-12 w-12 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="mb-3 text-xl font-semibold text-gray-800">
              Chưa có cuộc trò chuyện
            </h3>

            <p className="mb-6 leading-relaxed text-gray-600">
              Bạn chưa có cuộc trò chuyện nào với Admin. Hãy gửi tin nhắn đầu
              tiên để bắt đầu nhận hỗ trợ từ đội ngũ ClickFlow.
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-purple-100 bg-white/70 p-4 backdrop-blur-sm">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                placeholder="Nhập tin nhắn đầu tiên của bạn..."
                className="w-full resize-none rounded-2xl border border-purple-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-500 shadow-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={toggleEmojiPicker}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-all duration-200 hover:scale-105 hover:bg-purple-200"
              >
                <Smile className="h-5 w-5" />
              </button>

              <ImageUpload onSendFile={handleSendFile} />

              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-indigo-600 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={closeEmojiPicker}
              ></div>
              <div className="absolute bottom-20 right-4 z-20">
                <EmojiPicker
                  isVisible={showEmojiPicker}
                  onEmojiSelect={handleEmojiSelect}
                  onClose={closeEmojiPicker}
                />
              </div>
            </>
          )}
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
