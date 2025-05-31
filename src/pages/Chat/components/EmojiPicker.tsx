import { emojiData } from '@/constants/data';
import React, { useState, useRef, useEffect } from 'react';

interface EmojiPickerProps {
  isVisible: boolean;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isVisible,
  onEmojiSelect,
  onClose,
  className = ''
}) => {
  const [selectedEmojiCategory, setSelectedEmojiCategory] =
    useState('Mặt cười');
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    // Không đóng emoji picker để người dùng có thể chọn nhiều emoji
  };

  if (!isVisible) return null;

  return (
    <div
      ref={emojiPickerRef}
      className={`z-20 w-80 rounded-lg border border-gray-200 bg-white shadow-xl ${className}`}
    >
      {/* Emoji Categories */}
      <div className="border-b border-gray-100 p-3">
        <div className="flex space-x-1 overflow-x-auto">
          {Object.keys(emojiData).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedEmojiCategory(category)}
              className={`flex-shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEmojiCategory === category
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Emoji Grid */}
      <div className="max-h-64 overflow-y-auto p-3">
        <div className="grid grid-cols-8 gap-2">
          {emojiData[selectedEmojiCategory as keyof typeof emojiData]?.map(
            (emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-gray-100"
                title={emoji}
              >
                {emoji}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
