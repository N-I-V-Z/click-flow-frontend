import React from 'react';
import { Search } from 'lucide-react';
import { ChatTab, ConversationListApiResponse, MessageType } from '@/types';

interface ChatSidebarProps {
  conversations: ConversationListApiResponse[] | undefined;
  selectedConversation: ConversationListApiResponse | null;
  onSelectConversation: (conversation: ConversationListApiResponse) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeTab: ChatTab;
  onTabChange: (tab: ChatTab) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange
}) => {
  const getTypeColor = (type: string) => {
    return 'advertiser' === type.toLowerCase()
      ? 'bg-purple-100 text-purple-800'
      : 'bg-emerald-100 text-emerald-800';
  };

  const getTypeLabel = (type: string) => {
    return 'advertiser' === type.toLowerCase() ? 'ADV' : 'PUB';
  };

  const formatDate = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Ngày không xác định';
      }

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
    } catch (error) {
      return 'Ngày không xác định';
    }
  };

  const formatTime = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '--:--';
      }
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
    } catch (error) {
      return '--:--';
    }
  };

  const filterConversations = conversations?.filter((conversation) => {
    if (!conversation || !conversation.parner) return false;

    const matchesSearch =
      conversation.parner.fullName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) || false;
    const matchesTab =
      activeTab === ChatTab.All ||
      activeTab === conversation.parner.role?.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex w-80 flex-col border-r border-purple-200 bg-white/80 shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-purple-100 bg-gradient-to-r from-purple-600 to-indigo-400 p-6 text-white">
        <h1 className="mb-4 text-xl font-bold">Admin Support</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-purple-200" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className="w-full rounded-xl border border-purple-300/30 bg-white/20 py-2.5 pl-10 pr-4 text-white placeholder-purple-200 backdrop-blur-sm focus:border-white/50 focus:ring-2 focus:ring-white/30"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-white/20 p-1 backdrop-blur-sm">
          {[
            { key: ChatTab.All, label: 'Tất cả' },
            { key: ChatTab.Advertiser, label: 'Advertiser' },
            { key: ChatTab.Publisher, label: 'Publisher' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white font-medium text-purple-600 shadow-sm'
                  : 'text-purple-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filterConversations
          ?.map((conversation) => {
            if (
              !conversation ||
              !conversation.parner ||
              !conversation.lastMessage
            ) {
              return null;
            }

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`cursor-pointer border-b border-purple-50 p-4 transition-all duration-200 hover:bg-purple-50/50 ${
                  selectedConversation?.id === conversation.id
                    ? 'border-r-4 border-purple-500 bg-purple-100/60'
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={
                        conversation.parner.userDetail?.avatarURL ||
                        '/default-avatar.png'
                      }
                      alt={conversation.parner.fullName || 'Unknown User'}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/default-avatar.png';
                      }}
                    />
                    {/* Type badge overlay on avatar */}
                    <span
                      className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.5rem] font-bold shadow-lg ring-2 ring-white ${getTypeColor(
                        conversation.parner.role || 'unknown'
                      )}`}
                    >
                      {getTypeLabel(conversation.parner.role || 'unknown')}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Header row with name and time */}
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex min-w-0 flex-1 items-center">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {conversation.parner.fullName || 'Unknown User'}
                        </h3>
                      </div>
                      <div className="ml-3 flex-shrink-0 text-xs text-gray-400">
                        {formatTime(conversation.lastMessage.sentAt)}
                      </div>
                    </div>

                    {/* Message row with content and unread count */}
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 truncate text-sm text-gray-600">
                          {conversation.lastMessage.type === MessageType.Image
                            ? `${conversation.parner.fullName || 'Người dùng'} đã gửi 1 ảnh`
                            : conversation.lastMessage.text ||
                              'Tin nhắn không có nội dung'}
                        </p>
                        <div className="text-xs text-gray-400">
                          {formatDate(conversation.lastMessage.sentAt)}
                        </div>
                      </div>

                      {(conversation.unreadCount || 0) > 0 && (
                        <div className="ml-3 flex-shrink-0">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-medium text-white shadow-lg">
                            {(conversation.unreadCount || 0) > 99
                              ? '99+'
                              : conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          .filter(Boolean)}
      </div>
    </div>
  );
};

export default ChatSidebar;
