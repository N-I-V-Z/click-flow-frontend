import React from 'react';
import { MessageApiResponse, MessageType } from '@/types';

interface MessageGroupProps {
  messages: MessageApiResponse[];
  currentUserId: number | undefined;
}

const MessageGroup: React.FC<MessageGroupProps> = ({
  messages,
  currentUserId
}) => {
  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
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

  // Logic nhóm tin nhắn theo ngày
  const groupMessagesByDate = (messages: MessageApiResponse[]) => {
    if (!messages) return [];

    const grouped: { [key: string]: MessageApiResponse[] } = {};

    messages.forEach((msg) => {
      const dateKey = new Date(msg.sentAt).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(msg);
    });

    return Object.entries(grouped).map(([dateKey, msgs]) => ({
      date: dateKey,
      messages: msgs
    }));
  };

  const groupedMessages = groupMessagesByDate(messages || []);

  return (
    <div className="space-y-6">
      {groupedMessages.map((group) => (
        <div key={group.date} className="mb-6">
          {/* Header ngày */}
          <div className="mb-4 text-center">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              {formatDateHeader(group.date)}
            </span>
          </div>

          {/* Tin nhắn trong ngày */}
          <div className="space-y-4">
            {group.messages.map((msg) => {
              const isSender =
                currentUserId !== undefined && msg?.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm lg:max-w-md ${
                      isSender
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : 'border border-gray-200 bg-white text-gray-900'
                    }`}
                  >
                    {msg?.type === MessageType.Image && (
                      <div className="space-y-2">
                        <img
                          src={msg.fileUrl}
                          alt="Shared image"
                          className="max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                          loading="lazy"
                          title="Click để xem ảnh lớn"
                        />
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg?.text}</p>
                    <p
                      className={`mt-2 text-xs ${
                        isSender ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg?.sentAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageGroup;
