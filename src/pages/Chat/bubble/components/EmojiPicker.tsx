import React from 'react';

interface EmojiPickerProps {
  emojis: string[];
  onEmojiClick: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  emojis,
  onEmojiClick
}) => {
  return (
    <div className="absolute bottom-20 left-4 right-4 z-10 grid grid-cols-8 gap-2 rounded-lg border bg-white p-3 shadow-lg">
      {emojis.map((emoji, idx) => (
        <button
          key={idx}
          onClick={() => onEmojiClick(emoji)}
          className="rounded p-2 text-center text-xl transition-colors hover:bg-gray-100"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
