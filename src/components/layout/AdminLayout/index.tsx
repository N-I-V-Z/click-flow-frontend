import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarAd from '@/components/shared/sidebar-advertiser';

const { Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <Layout className="h-screen bg-white">
      {/* Header cố định trên cùng */}
      <HeaderAd />

      {/* Sidebar cố định bên trái, ngay dưới Header 64px */}
      <div className="fixed left-0 top-[64px]">
        <SidebarAd />
      </div>

      {/* Nội dung chính (scroll) */}
      <Content className="ml-64 mt-[64px] h-[calc(100vh-64px-50px)] overflow-auto bg-white p-6">
        <Outlet />
      </Content>

      {/* Footer cố định dưới cùng */}
      <Footer className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} ClickFlow. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default AdminLayout;
