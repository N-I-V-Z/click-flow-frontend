import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { Bot, Search, Minimize2 } from 'lucide-react';

interface ChatHeaderProps {
  isSearchMode: boolean;
  onToggleSearch: () => void;
  onToggle?: (isOpen: boolean) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleSearch,
  onToggle
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold">Admin Support</p>
          <p className="text-sm text-white/80">Luôn sẵn sàng hỗ trợ bạn</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSearch}
          className="text-white hover:bg-white/20"
        >
          <Search size={18} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle?.(false)}
          className="text-white hover:bg-white/20"
        >
          <Minimize2 size={18} />
        </Button>
      </div>
    </CardHeader>
  );
};
