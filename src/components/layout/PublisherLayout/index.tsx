// src/components/layout/PublisherLayout.tsx
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderPublisher from '@/components/shared/header-publisher';
import SidebarPublisher from '@/components/shared/sidebar-publisher';

import ChatBubble from '@/pages/Chat/bubble';
const PublisherLayout: React.FC = () => {
  const { Content, Footer } = Layout;

  return (
    <Layout className="h-screen bg-white">
      {/* Header Publisher */}
      <HeaderPublisher />

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
      <Footer className="fixed bottom-0 left-0 z-10 w-full bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} ClickFlow. All rights reserved.
      </Footer>

      {/* Chat bubble & window */}
      <ChatBubble />
    </Layout>
  );
};

export default PublisherLayout;
