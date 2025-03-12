import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderAd from '@/components/shared/header-advertiser';
import SidebarAd from '@/components/shared/sidebar-advertiser';
import Footer from '@/components/shared/footer';
const { Content } = Layout;

const AdvertiserLayout: React.FC = () => {
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
    </Layout>
  );
};

export default AdvertiserLayout;
