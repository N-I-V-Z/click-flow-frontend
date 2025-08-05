import React, { useState } from 'react';
import { Menu, Modal, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  ReadOutlined,
  // SolutionOutlined,
  SnippetsOutlined,
  WechatOutlined,
  BellOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import helpers from '@/helpers';
import { useLogout } from '@/queries/auth.query';
import { useDispatch } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { logout } from '@/redux/auth.slice';
import { useQueryClient } from '@tanstack/react-query';

const SidebarPublisher: React.FC = () => {
  const { mutateAsync: logoutAccount, isPending } = useLogout();
  const location = useLocation();
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
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

      // Clear all React Query cache
      queryClient.clear();

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

      // Clear all React Query cache
      queryClient.clear();

      dispatch(logout());
      router.push('/login');
    }
  };

  return (
    <div
      className="
        mt-[25px] flex
        h-[calc(87vh-60px)]
        w-56 flex-col
        border-r
        border-gray-200
      "
    >
      {/* Menu chính */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className="flex-grow border-r-0"
        onClick={(e) => setSelectedKey(e.key)}
      >
        <Menu.Item
          key="/publisher/dashboard"
          icon={<HomeOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/publisher/dashboard'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/publisher/dashboard">Tổng quan</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/publisher/campaign"
          icon={<ReadOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/publisher/campaign'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/publisher/campaign">Chiến dịch</NavLink>
        </Menu.Item>
        {/* <Menu.Item
          key="/publisher/mission"
          icon={<SolutionOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF] 
            ${selectedKey === '/publisher/mission' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/publisher/mission">Nhiệm vụ</NavLink>
        </Menu.Item> */}
        <Menu.Item
          key="/all/forum"
          icon={<WechatOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/all/forum'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/all/forum">Diễn đàn</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/publisher/courses"
          icon={<SnippetsOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/publisher/courses'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/publisher/courses">Khóa học</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/all/news"
          icon={<BellOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/all/news'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/all/news">Tin tức</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/publisher/chat"
          icon={<MessageOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/publisher/chat'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/publisher/chat">Hỗ Trợ</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Hồ sơ, Đăng xuất) */}
      <div className="border-t">
        <Menu mode="inline" className="border-r-0">
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            className="transition-all duration-200 [&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]"
          >
            <NavLink to="/publisher/publisher-profile">Hồ sơ</NavLink>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={showLogoutModal}
            disabled={isPending}
          >
            <p>{isPending ? 'Đang xử lý...' : 'Đăng xuất'}</p>
          </Menu.Item>
        </Menu>
      </div>

      {/* Custom Logout Confirmation Modal */}
      <Modal
        open={isModalVisible}
        centered
        closable={false}
        onCancel={handleCancelLogout}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancelLogout}
            className="border border-gray-300 hover:border-[#9B52BF]"
            disabled={isPending}
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
            {isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}
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

export default SidebarPublisher;
