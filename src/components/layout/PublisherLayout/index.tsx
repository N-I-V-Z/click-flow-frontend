// src/components/layout/PublisherLayout.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarPublisher from '@/components/shared/sidebar-publisher';
import Footer from '@/components/shared/footer';
import { ChatUI, Message } from '@/pages/Chat/Chatbot';

const PublisherLayout: React.FC = () => {
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
    <Layout className="h-screen bg-white">
      {/* Header Publisher */}
      <HeaderAd />

      {/* Sidebar Publisher */}
      <div className="fixed left-0 top-[64px]">
        <SidebarPublisher />
      </div>

      {/* Nội dung chính */}
      <Content className="relative ml-64 mt-[64px] h-[calc(100vh-64px-64px-30px)] bg-white p-6 pb-8">
        {/* 
          Suspense + Outlet cho phép render mọi route con nằm dưới "/publisher/*" 
          Ví dụ: /publisher/dashboard, /publisher/mission, /publisher/forum, v.v.
        */}
        <Suspense fallback={<div>Đang tải nội dung…</div>}>
          <Outlet />
        </Suspense>
      </Content>

      {/* Footer */}
      <Footer />

      {/* Chat bubble & window */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="flex h-[550px] w-[360px] flex-col overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex-1">
              <ChatUI
                conversationId={`publisher-<ID của bạn>`}
                messages={chatMessages}
                onSend={handleSend}
                isOpen
                onToggle={setIsChatOpen}
              />
            </div>
          </div>
        ) : (
          <button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:shadow-xl"
            onClick={() => setIsChatOpen(true)}
          >
            💬
            <span className="absolute right-1 top-0 block h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400" />
          </button>
        )}
      </div>
    </Layout>
  );
};

export default PublisherLayout;
