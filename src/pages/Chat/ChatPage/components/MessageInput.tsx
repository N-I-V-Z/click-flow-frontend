import React from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from '../../components/EmojiPicker';
import ImageUpload from '../../components/ImageUploadComponent';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onSendFile: (file: File) => Promise<void>;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  onEmojiPickerClose: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onSendFile,
  showEmojiPicker,
  onToggleEmojiPicker,
  onEmojiSelect,
  onEmojiPickerClose
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <>
      {/* Emoji Picker Component */}
      <EmojiPicker
        isVisible={showEmojiPicker}
        onEmojiSelect={onEmojiSelect}
        onClose={onEmojiPickerClose}
        className="absolute bottom-20 right-4"
      />

      {/* Message Input */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-purple-200 bg-white/80 p-4 backdrop-blur-sm">
        <div className="flex items-end space-x-3">
          {/* Image Send */}
          <div className="relative">
            <ImageUpload onSendFile={onSendFile} />
          </div>

          {/* Message Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500 focus-visible:shadow-none focus-visible:outline-none"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={onToggleEmojiPicker}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transform transition-colors ${
                showEmojiPicker
                  ? 'text-purple-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={onSendMessage}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-3 text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-indigo-600 hover:shadow-xl"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
