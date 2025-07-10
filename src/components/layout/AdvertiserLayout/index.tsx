import { Outlet } from 'react-router-dom';
import React from 'react';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarAd from '@/components/shared/sidebar-advertiser';
import Footer from '@/components/shared/footer';
import ChatBubble from '@/pages/Chat/bubble';
import ScrollButton from '@/components/shared/scroll-button';

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
      <Content className="mb-20 ml-64 mt-[55px] h-[calc(100vh-64px-50px)] bg-white p-6">
        {/* CHỖ NÀY: Bọc Outlet vào Suspense để các trang con lazy load */}

        <Outlet />
      </Content>

      {/* Footer cố định bên dưới */}
      <Footer />

      {/* Chat bubble & window */}
      <ChatBubble />

      {/* Scroll button */}
      <ScrollButton />
    </Layout>
  );
};

export default AdvertiserLayout;
