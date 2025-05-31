import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-0 bg-gray-900 bg-gradient-to-br from-gray-50 to-white shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Bot size={20} className="animate-spin text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold">Đang kết nối...</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Đang khởi tạo cuộc trò chuyện...</p>
        </div>
      </CardContent>
    </Card>
  );
};
