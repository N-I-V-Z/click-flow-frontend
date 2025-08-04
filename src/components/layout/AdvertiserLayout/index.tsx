import { Outlet } from 'react-router-dom';
import React from 'react';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarAd from '@/components/shared/sidebar-advertiser';
import Footer from '@/components/shared/footer';
import ScrollButton from '@/components/shared/scroll-button';
import AIChatWidget from '@/components/shared/ai-chat-widget';

const AdvertiserLayout: React.FC = () => {
  const { Content } = Layout;

  return (
    <Layout className="bg-white">
      {/* Header cố định trên cùng */}
      <HeaderAd />

      {/* Sidebar cố định bên trái (dưới Header) */}
      <div className="fixed left-0 top-[64px]">
        <SidebarAd />
      </div>

      {/* Nội dung chính (scroll được) */}
      <Content className="mb-20 ml-56 mt-[30px] h-[calc(100vh-64px-50px)] bg-white p-6">
        {/* CHỖ NÀY: Bọc Outlet vào Suspense để các trang con lazy load */}

        <Outlet />
      </Content>

      {/* Footer cố định bên dưới */}
      <Footer />

      {/* AI Chat Widget - thay thế ChatBubble */}
      <AIChatWidget />

      {/* Scroll button */}
      <ScrollButton />
    </Layout>
  );
};

export default AdvertiserLayout;
