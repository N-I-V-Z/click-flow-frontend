import React from 'react';
import { Circle } from 'lucide-react';

const EmptyChatState: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-indigo-100">
          <Circle className="h-10 w-10 text-purple-400" />
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900">
          Chọn một cuộc trò chuyện
        </h3>
        <p className="text-gray-500">
          Chọn người dùng từ danh sách bên trái để bắt đầu chat
        </p>
      </div>
    </div>
  );
};

export default EmptyChatState;
