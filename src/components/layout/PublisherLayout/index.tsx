import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarPublisher from '@/components/shared/sidebar-publisher';

const { Content, Footer } = Layout;

const PublisherLayout: React.FC = () => {
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
          ml-64
          mt-[64px] 
          h-[calc(100vh-64px-64px)]
          overflow-auto
          bg-white
          p-6
        "
      >
        <Outlet />
      </Content>

      {/* Footer cố định dưới cùng */}
      <Footer className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} ClickFlow. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default PublisherLayout;
