import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderAdmin from '@/components/shared/header-admin';
import SidebarAdmin from '@/components/shared/sidebar-admin';

const { Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <Layout className="h-screen bg-white">
      <HeaderAdmin />
      <div className="fixed left-0 top-[64px]">
        <SidebarAdmin />
      </div>
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
      <Footer className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center">
        © {new Date().getFullYear()} ClickFlow. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default AdminLayout;
