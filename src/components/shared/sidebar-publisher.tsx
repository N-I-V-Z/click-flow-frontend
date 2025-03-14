import React, { useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import helpers from '@/helpers';
import { useLogout } from '@/queries/auth.query';
import { useDispatch } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { logout } from '@/redux/auth.slice';

const SidebarPublisher: React.FC = () => {
  const { mutateAsync: logoutAccount } = useLogout();
  const location = useLocation();
  const router = useRouter();
  const dispatch = useDispatch();
  const refreshToken = helpers.cookie_get('RT');
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const { isPending } = useLogout();

  const handleLogout = async () => {
    await logoutAccount({
      refreshToken: refreshToken
    });
    helpers.cookie_delete('RT');
    helpers.cookie_delete('AT');
    router.push('/login');
    dispatch(logout());
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
        selectedKeys={[selectedKey]}
        className="flex-grow border-r-0"
        onClick={(e) => setSelectedKey(e.key)}
      >
        <Menu.Item
          key="/publisher/dashboard"
          icon={<HomeOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF] 
            ${selectedKey === '/publisher/dashboard' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/publisher/dashboard">Tổng quan</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/publisher/campaign"
          icon={<HomeOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF] 
            ${selectedKey === '/publisher/campaign' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/publisher/campaign">Chiến dịch</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Hồ sơ, Đăng xuất) */}
      <div className="border-t">
        <Menu mode="inline" className="border-r-0">
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            className="hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]"
          >
            <NavLink to="">Hồ sơ</NavLink>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            style={{ color: 'red' }}
            onClick={handleLogout}
            disabled={isPending}
          >
            {/* Khi click vào Đăng xuất, hiển thị modal xác nhận */}
            <p>{isPending ? 'Đang xử lý...' : 'Đăng xuất'}</p>
          </Menu.Item>
        </Menu>
      </div>
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
