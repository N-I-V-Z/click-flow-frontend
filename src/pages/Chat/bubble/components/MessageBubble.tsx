import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User, Clock, Copy, Check, CheckCheck } from 'lucide-react';
import { MessageApiResponse, MessageType, TokenDecoded } from '@/types';
import { ImageViewer } from '../../components/ImageViewer';

interface MessageBubbleProps {
  msg: MessageApiResponse;
  showDate?: boolean;
  decodedToken: TokenDecoded | null;
  onCopy: (content: string, messageId: number) => void;
  copiedMessageId: number | null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  showDate,
  decodedToken,
  onCopy,
  copiedMessageId
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const isSender =
    decodedToken?.Id !== undefined && msg?.senderId === Number(decodedToken.Id);

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

  const formatDate = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Không xác định';
      }
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua';
      } else {
        return date.toLocaleDateString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh'
        });
      }
    } catch (error) {
      return 'Không xác định';
    }
  };

  const handleImageClick = () => {
    if (msg?.type === MessageType.Image && msg?.fileUrl) {
      setIsImageViewerOpen(true);
    }
  };

  const handleCloseViewer = () => {
    setIsImageViewerOpen(false);
  };

  return (
    <>
      <div className="break-anywhere">
        {showDate && (
          <div className="mb-4 text-center">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
              {formatDate(msg?.sentAt)}
            </span>
          </div>
        )}
        <div
          className={`group mb-4 flex items-center gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
        >
          {!isSender && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Bot size={16} className="text-white" />
            </div>
          )}

          <div
            className={`relative max-w-[75%] ${isSender ? 'order-first' : ''}`}
          >
            <div
              className={`relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                isSender
                  ? 'rounded-br-md bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                  : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'
              }`}
            >
              {msg?.type === MessageType.Image && msg?.fileUrl ? (
                <div className="space-y-2">
                  <img
                    src={msg.fileUrl}
                    alt="Shared image"
                    className="max-w-full cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                    loading="lazy"
                    onClick={handleImageClick}
                    title="Click để xem ảnh lớn"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg?.text}
                </p>
              )}

              {/* Message actions */}
              <div
                className={`absolute top-0 ${isSender ? '-left-12' : '-right-12'} flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100`}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 border bg-white/90 p-0 shadow-sm hover:bg-gray-50"
                  onClick={() => onCopy(msg?.text, msg.id)}
                >
                  {copiedMessageId === msg.id ? (
                    <Check size={12} className="text-green-600" />
                  ) : (
                    <Copy size={12} className="text-gray-600" />
                  )}
                </Button>
              </div>
            </div>

            <div
              className={`mt-1 flex items-center gap-1 px-2 text-xs text-gray-400 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <Clock size={10} />
              <span>{formatTime(msg?.sentAt)}</span>
              {isSender && (
                <span className="ml-1">
                  {msg.isRead ? (
                    <CheckCheck size={12} className="text-purple-500" />
                  ) : (
                    <Check size={12} className="text-gray-400" />
                  )}
                </span>
              )}
            </div>
          </div>

          {isSender && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
              <User size={16} className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Sử dụng ImageViewer component */}
      <ImageViewer
        isOpen={
          isImageViewerOpen && msg?.type === MessageType.Image && !!msg?.fileUrl
        }
        imageUrl={msg?.fileUrl || ''}
        imageAlt="Enlarged view"
        timestamp={msg?.sentAt}
        onClose={handleCloseViewer}
      />
    </>
  );
};
