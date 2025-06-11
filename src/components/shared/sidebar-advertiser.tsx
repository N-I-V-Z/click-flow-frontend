import React, { useState } from 'react';
import { Menu, Modal, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  WechatOutlined,
  BellOutlined
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import helpers from '@/helpers';
import { useLogout } from '@/queries/auth.query';
import { useDispatch } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { logout } from '@/redux/auth.slice';

const SidebarAdvertiser: React.FC = () => {
  const { mutateAsync: logoutAccount } = useLogout();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isPending } = useLogout();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };
  const showLogoutModal = () => {
    setIsModalVisible(true);
  };
  const handleConfirmLogout = async () => {
    try {
      setIsModalVisible(false);

      // Lấy refresh token từ cookie hoặc localStorage
      const refreshToken =
        helpers.cookie_get('RT') || localStorage.getItem('refreshToken');

      if (refreshToken) {
        // Call API logout với refreshToken
        await logoutAccount({ refreshToken });
      }

      // Xóa tokens khỏi storage
      helpers.cookie_delete('AT');
      helpers.cookie_delete('RT');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      // Dispatch logout action
      dispatch(logout());

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);

      // Ngay cả khi API lỗi, vẫn clear local data và logout
      helpers.cookie_delete('AT');
      helpers.cookie_delete('RT');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      dispatch(logout());
      router.push('/login');
    }
  };
  return (
    <div
      className="
        mt-[35px] flex
        h-[calc(87vh-60px)]
        w-60 flex-col
        border-r
        border-gray-200
      "
    >
      {/* Menu chính */}
      <Menu
        mode="inline"
        defaultSelectedKeys={['overview']}
        className="flex-grow border-r-0"
      >
        <Menu.Item key="overview" icon={<HomeOutlined />}>
          <NavLink to="/advertiser/dashboard">Tổng quan</NavLink>
        </Menu.Item>
        <Menu.Item key="campaign" icon={<UnorderedListOutlined />}>
          <NavLink to="/advertiser/campaigns">Chiến dịch</NavLink>
        </Menu.Item>
        <Menu.Item key="traffic" icon={<LinkOutlined />}>
          <NavLink to="/advertiser/traffics">Truy cập</NavLink>
        </Menu.Item>
        <Menu.Item key="forum" icon={<WechatOutlined />}>
          <NavLink to="/all/forum">Diễn đàn</NavLink>
        </Menu.Item>
        <Menu.Item key="news" icon={<BellOutlined />}>
          <NavLink to="/all/news">Tin tức</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Hồ sơ, Đăng xuất) */}
      <div className="border-t">
        <Menu mode="inline" className="border-r-0">
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <NavLink to="/advertiser/advertiser-profile">Hồ sơ</NavLink>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            style={{ color: 'red' }}
            onClick={showLogoutModal}
            disabled={isPending}
          >
            {/* Khi click vào Đăng xuất, hiển thị modal xác nhận */}
            <p>{isPending ? 'Đang xử lý...' : 'Đăng xuất'}</p>
          </Menu.Item>
        </Menu>
      </div>
      <Modal
        visible={isModalVisible}
        centered
        closable={false}
        onCancel={handleCancelLogout}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancelLogout}
            className="border border-gray-300 hover:border-[#9B52BF]"
          >
            Hủy
          </Button>,
          <Button
            key="logout"
            type="primary"
            danger
            loading={isPending}
            onClick={handleConfirmLogout}
            className="border-[#9B52BF] bg-[#9B52BF] hover:border-[#7a3293] hover:bg-[#7a3293]"
          >
            Đăng xuất
          </Button>
        ]}
        bodyStyle={{ textAlign: 'center', paddingTop: 30 }}
        modalRender={(modal) => (
          <div className="p-5" style={{ borderRadius: 12, overflow: 'hidden' }}>
            {modal}
          </div>
        )}
      >
        <LogoutOutlined
          style={{ fontSize: 28, color: '#9B52BF', marginBottom: 20 }}
        />
        <h2 className="mb-2 text-xl font-bold">Xác nhận đăng xuất</h2>
        <p className="mb-5 text-gray-600">
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
        </p>
      </Modal>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default SidebarAdvertiser;
