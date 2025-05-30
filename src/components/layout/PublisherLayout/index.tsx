import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarPublisher from '@/components/shared/sidebar-publisher';
import { ChatUI, Message } from '@/pages/Chat/Chatbot';

const PublisherLayout: React.FC = () => {
  const { Content, Footer } = Layout;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  useEffect(() => {
    async function loadHistory() {
      const history: Message[] = [];
      setChatMessages(history);
    }
    loadHistory();
  }, []);
  const handleSend = async (text: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'advertiser',
      content: text,
      timestamp: new Date().toLocaleString()
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };
  return (
    <Layout className="h-screen bg-white">
      {/* Header cố định trên cùng (cao 64px) */}
      <HeaderAd />
      {/* Sidebar cố định bên trái, ngay dưới Header */}
      <div className="fixed left-0 top-[64px]">
        <SidebarPublisher />
      </div>
      {/* Nội dung chính (scroll) có khoảng trắng trên-dưới */}
      <Content
        className="
           relative
    ml-64
    mt-[64px] 
    h-[calc(100vh-64px-64px-30px)] 
    bg-white
    p-6
    pb-8
        "
      >
        <Outlet />
      </Content>

      {/* Footer cố định dưới cùng */}
      <Footer className="fixed bottom-0 left-0 z-10 w-full bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} ClickFlow. All rights reserved.
      </Footer>
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="flex h-[550px] w-[360px] flex-col overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex-1">
              <ChatUI
                conversationId={`advertiser-<ID của bạn>`}
                messages={chatMessages}
                onSend={handleSend}
                isOpen
                onToggle={setIsChatOpen}
              />
            </div>
          </div>
        ) : (
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:shadow-xl"
            onClick={() => setIsChatOpen(true)}
          >
            💬{' '}
            <span className="absolute right-1 top-0 block h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400" />
          </button>
        )}
      </div>
    </Layout>
  );
};

export default PublisherLayout;
