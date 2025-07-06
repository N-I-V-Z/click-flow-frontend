import React from 'react';
import { ConversationListApiResponse } from '@/types';

interface ChatHeaderProps {
  selectedConversation: ConversationListApiResponse;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedConversation }) => {
  const getTypeColor = (type: string) => {
    return 'advertiser' === type?.toLowerCase()
      ? 'bg-purple-100 text-purple-800'
      : 'bg-emerald-100 text-emerald-800';
  };

  if (!selectedConversation || !selectedConversation.parner) {
    return (
      <div className="flex items-center justify-between border-b border-purple-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Đang tải...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-purple-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={
              selectedConversation.parner.userDetail?.avatarURL ||
              '/default-avatar.png'
            }
            alt={selectedConversation.parner.fullName || 'Unknown User'}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-avatar.png';
            }}
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedConversation.parner.fullName || 'Unknown User'}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(
                selectedConversation.parner.role || 'unknown'
              )}`}
            >
              {selectedConversation.parner.role || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
