import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <div className="border-b bg-gray-50 p-3">
      <div className="relative">
        <Input
          placeholder="Tìm kiếm trong cuộc trò chuyện..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-8 text-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0"
            onClick={onClearSearch}
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};
