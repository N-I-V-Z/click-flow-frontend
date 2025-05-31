import React, { useState, useRef } from 'react';
import {
  Send,
  Search,
  MoreVertical,
  Circle,
  Phone,
  Video,
  Info,
  Paperclip,
  Mic,
  Image,
  File,
  Smile
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  type: 'advertiser' | 'publisher';
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  type?: 'text' | 'image' | 'file';
  fileName?: string;
  fileSize?: string;
}

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'advertiser' | 'publisher'
  >('all');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const users: User[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      type: 'advertiser',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Tôi muốn tăng budget cho campaign này',
      timestamp: '2 phút',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      type: 'publisher',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b332c265?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Khi nào payment được xử lý?',
      timestamp: '15 phút',
      unread: 1,
      online: true
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      type: 'advertiser',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Campaign performance rất tốt!',
      timestamp: '1 giờ',
      unread: 0,
      online: false
    },
    {
      id: '4',
      name: 'Phạm Thu Dung',
      type: 'publisher',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Có thể tăng revenue share không?',
      timestamp: '2 giờ',
      unread: 0,
      online: false
    },
    {
      id: '5',
      name: 'Hoàng Quốc Duy',
      type: 'advertiser',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Cần support về targeting',
      timestamp: '1 ngày',
      unread: 0,
      online: true
    },
    {
      id: '6',
      name: 'Hoàng Quốc Duy',
      type: 'advertiser',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Cần support về targeting',
      timestamp: '1 ngày',
      unread: 0,
      online: true
    },
    {
      id: '7',
      name: 'Hoàng Quốc Duy',
      type: 'advertiser',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Cần support về targeting',
      timestamp: '1 ngày',
      unread: 0,
      online: true
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      content: 'Xin chào admin, tôi cần hỗ trợ về campaign',
      timestamp: '10:30',
      isAdmin: false,
      type: 'text'
    },
    {
      id: '2',
      senderId: 'admin',
      content: 'Chào bạn! Tôi có thể giúp gì cho bạn?',
      timestamp: '10:31',
      isAdmin: true,
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      content: 'Tôi muốn tăng budget cho campaign này',
      timestamp: '10:35',
      isAdmin: false,
      type: 'text'
    }
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || user.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'admin',
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isAdmin: true,
        type: 'text'
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleFileUpload = (type: 'image' | 'file') => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
    setShowAttachMenu(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'file'
  ) => {
    const file = event.target.files?.[0];
    if (file && selectedUser) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'admin',
        content:
          type === 'image' ? 'Đã gửi hình ảnh' : `Đã gửi file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isAdmin: true,
        type: type,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`
      };

      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording start
      setTimeout(() => {
        if (selectedUser) {
          const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'admin',
            content: 'Đã gửi tin nhắn thoại',
            timestamp: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            isAdmin: true,
            type: 'text'
          };
          setMessages((prev) => [...prev, newMessage]);
        }
        setIsRecording(false);
      }, 2000);
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'advertiser'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-emerald-100 text-emerald-800';
  };

  const getTypeLabel = (type: string) => {
    return type === 'advertiser' ? 'ADV' : 'PUB';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-purple-200 bg-white/80 shadow-lg backdrop-blur-sm">
        {/* Header */}
        <div className="border-b border-purple-100 bg-gradient-to-r from-purple-600 to-indigo-400 p-6 text-white">
          <h1 className="mb-4 text-xl font-bold">Admin Chat</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-purple-200" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full rounded-xl border border-purple-300/30 bg-white/20 py-2.5 pl-10 pr-4 text-white placeholder-purple-200 backdrop-blur-sm focus:border-white/50 focus:ring-2 focus:ring-white/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 rounded-lg bg-white/20 p-1 backdrop-blur-sm">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'advertiser', label: 'Advertiser' },
              { key: 'publisher', label: 'Publisher' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white font-medium text-purple-600 shadow-sm'
                    : 'text-purple-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="mb-10 flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer border-b border-purple-50 p-4 transition-all duration-200 hover:bg-purple-50/50 ${
                selectedUser?.id === user.id
                  ? 'border-r-4 border-purple-500 bg-purple-100/60'
                  : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                      user.online ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(user.type)}`}
                      >
                        {getTypeLabel(user.type)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {user.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-gray-600">
                      {user.lastMessage}
                    </p>
                    {user.unread > 0 && (
                      <span className="ml-2 min-w-[20px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 text-center text-xs font-medium text-white shadow-lg">
                        {user.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative flex flex-1 flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-purple-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                      selectedUser.online ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedUser.name}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(selectedUser.type)}`}
                    >
                      {selectedUser.type === 'advertiser'
                        ? 'Advertiser'
                        : 'Publisher'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {selectedUser.online
                      ? 'Đang hoạt động'
                      : `Hoạt động ${selectedUser.timestamp} trước`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="rounded-xl p-2.5 text-purple-400 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="rounded-xl p-2.5 text-purple-400 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600">
                  <Video className="h-5 w-5" />
                </button>
                <button className="rounded-xl p-2.5 text-purple-400 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600">
                  <Info className="h-5 w-5" />
                </button>
                <button className="rounded-xl p-2.5 text-purple-400 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6 pb-28">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm lg:max-w-md ${
                      msg.isAdmin
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : 'border border-gray-200 bg-white text-gray-900'
                    }`}
                  >
                    {msg.type === 'file' && (
                      <div className="mb-2 flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <div className="text-xs">
                          <div className="font-medium">{msg.fileName}</div>
                          <div className="opacity-75">{msg.fileSize}</div>
                        </div>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={`mt-2 text-xs ${
                        msg.isAdmin ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="absolute bottom-5 left-0 right-0 border-t border-purple-200 bg-white/80 p-4 backdrop-blur-sm">
              <div className="flex items-end space-x-3">
                {/* Attachment Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="rounded-xl p-3 text-purple-500 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  {showAttachMenu && (
                    <div className="absolute bottom-full left-0 mb-2 min-w-[160px] rounded-xl border border-purple-200 bg-white p-2 shadow-lg">
                      <button
                        onClick={() => handleFileUpload('image')}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-purple-50"
                      >
                        <Image className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Hình ảnh</span>
                      </button>
                      <button
                        onClick={() => handleFileUpload('file')}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-purple-50"
                      >
                        <File className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Tệp tin</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600">
                    <Smile className="h-5 w-5" />
                  </button>
                </div>

                {/* Voice/Send Button */}
                {message.trim() ? (
                  <button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-3 text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-indigo-600 hover:shadow-xl"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={toggleRecording}
                    className={`rounded-xl p-3 shadow-lg transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-500 animate-pulse text-white'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
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
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'file')}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'image')}
        />
      </div>
    </div>
  );
};

export default ChatPage;
