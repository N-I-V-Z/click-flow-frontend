import React from 'react';
import { ConversationListApiResponse, MessageApiResponse } from '@/types';
import ChatHeader from './ChatHeader';
import MessageGroup from './MessageGroup';
import ScrollToBottomButton from './ScrollToBottomButton';
import MessageInput from './MessageInput';
import EmptyChatState from './EmptyChatState';

interface ChatAreaProps {
  selectedConversation: ConversationListApiResponse | null;
  messages: MessageApiResponse[] | undefined;
  currentUserId: number | undefined;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onSendFile: (file: File) => Promise<void>;
  showScrollButton: boolean;
  hasNewMessages: boolean;
  onScrollToBottom: () => void;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  onEmojiPickerClose: () => void;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedConversation,
  messages,
  currentUserId,
  message,
  onMessageChange,
  onSendMessage,
  onSendFile,
  showScrollButton,
  hasNewMessages,
  onScrollToBottom,
  showEmojiPicker,
  onToggleEmojiPicker,
  onEmojiSelect,
  onEmojiPickerClose,
  messagesContainerRef,
  messagesEndRef
}) => {
  if (!selectedConversation) {
    return (
      <div className="relative flex flex-1 flex-col shadow-lg">
        <EmptyChatState />
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col shadow-lg">
      {/* Chat Header */}
      <ChatHeader selectedConversation={selectedConversation} />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 pb-28"
      >
        <MessageGroup
          messages={Array.isArray(messages) ? messages : []}
          currentUserId={currentUserId}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <ScrollToBottomButton
        show={showScrollButton}
        hasNewMessages={hasNewMessages}
        onClick={onScrollToBottom}
      />

      {/* Message Input */}
      <MessageInput
        message={message}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onSendFile={onSendFile}
        showEmojiPicker={showEmojiPicker}
        onToggleEmojiPicker={onToggleEmojiPicker}
        onEmojiSelect={onEmojiSelect}
        onEmojiPickerClose={onEmojiPickerClose}
      />
    </div>
  );
};

export default ChatArea;
