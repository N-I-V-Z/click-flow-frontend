import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mic, Smile } from 'lucide-react';
import ImageUpload from './ImageUploadComponent';
import { EmojiPicker } from './EmojiPicker';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text?: string) => void;
  onSendFile: (file: File) => void;
  isSending: boolean;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  onSendFile,
  isSending,
  showEmojiPicker,
  onToggleEmojiPicker
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    '😊',
    '👍',
    '❤️',
    '😂',
    '😮',
    '😢',
    '🔥',
    '💯',
    '🎉',
    '👏',
    '🤔',
    '😍',
    '💪',
    '🙏',
    '✨',
    '🎯'
  ];

  // Auto-resize textarea function
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onSendFile) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
        return;
      }
      onSendFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onInputChange(input + emoji);
    onToggleEmojiPicker();
    textareaRef.current?.focus();
  };

  return (
    <div className="relative border-t border-gray-100 bg-white p-4">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPicker emojis={emojis} onEmojiClick={handleEmojiClick} />
      )}

      <div className="flex w-full items-end gap-2">
        {/* File Upload Button */}
        <ImageUpload onSendFile={onSendFile} disabled={isSending} />

        {/* Voice Button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-gray-600 hover:bg-gray-100"
          onClick={() => alert('Tính năng ghi âm sẽ được cập nhật sớm')}
          disabled={isSending}
        >
          <Mic size={18} />
        </Button>

        {/* Emoji Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleEmojiPicker}
          className="flex-shrink-0 text-gray-600 hover:bg-gray-100"
          disabled={isSending}
        >
          <Smile size={18} />
        </Button>

        {/* Textarea Input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            placeholder="Nhập..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            className="max-h-[120px] min-h-[44px] w-full resize-none overflow-hidden rounded-xl border border-gray-200 px-4 py-3 leading-5 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
            disabled={isSending}
            style={{ height: '44px' }}
            rows={1}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={() => onSend()}
          disabled={!input.trim() || isSending}
          className="h-11 flex-shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 transition-all duration-200 hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple={false}
      />
    </div>
  );
};
