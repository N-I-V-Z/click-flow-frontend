import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarAd from '@/components/shared/sidebar-advertiser';
import Footer from '@/components/shared/footer';
import { ChatUI, Message } from '@/pages/Chat/Chatbot';

const AdvertiserLayout: React.FC = () => {
  const { Content } = Layout;
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
    <Layout className="bg-white">
      {/* Header cố định trên cùng */}
      <HeaderAd />
      {/* Sidebar cố định bên trái */}
      <div className="fixed left-0 top-[64px]">
        <SidebarAd />
      </div>
      {/* Nội dung chính có thể scroll */}
      <Content className="mb-20 ml-64 mt-[55px] h-[calc(100vh-64px-50px)] bg-white p-6">
        <Outlet />
      </Content>
      {/* Footer cố định dưới cùng, full width */}
      <Footer />
      {/* Chat bubble & window */}
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

export default AdvertiserLayout;
