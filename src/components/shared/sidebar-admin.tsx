import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  PullRequestOutlined
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { BiBuildings } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { useLogout } from '@/queries/auth.query';
import helpers from '@/helpers';
import { logout } from '@/redux/auth.slice';
const { SubMenu } = Menu;

const SidebarAdmin: React.FC = () => {
  const { mutateAsync: logoutAccount, isPending } = useLogout();
  const router = useRouter();
  const dispatch = useDispatch();
  const refreshToken = helpers.cookie_get('RT');

  const handleLogout = async () => {
    await logoutAccount({
      refreshToken: refreshToken
    });
    helpers.cookie_delete('RT');
    helpers.cookie_delete('AT');
    router.push('/login');
    dispatch(logout());
  };
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  return (
    <div
      className="
        mt-[35px] flex
        h-[calc(90vh-64px)]
        w-64 flex-col
        border-r
        border-gray-200
      "
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => setSelectedKey(e.key)}
        className="flex-grow border-r-0"
      >
        <Menu.Item
          key="/admin/dashboard"
          icon={<HomeOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
            ${selectedKey === '/admin/dashboard' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/admin/dashboard">Tổng quan</NavLink>
        </Menu.Item>

        <SubMenu
          key="campaign"
          icon={<FileTextOutlined />}
          title="Chiến dịch"
          className="hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]"
        >
          <Menu.Item
            key="/admin/campaignlist"
            icon={<OrderedListOutlined />}
            className={`
              hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
              ${selectedKey === '/admin/campaignlist' ? '!bg-[#9B52BF] !text-white' : ''}
            `}
          >
            <NavLink to="/admin/campaignlist">Danh sách chiến dịch</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/admin/campaignrequest"
            icon={<PullRequestOutlined />}
            className={`
              hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
              ${selectedKey === '/admin/campaignrequest' ? '!bg-[#9B52BF] !text-white' : ''}
            `}
          >
            <NavLink to="/admin/campaignrequest">Yêu cầu chiến dịch</NavLink>
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          key="/admin/manageadvertiser"
          icon={<BiBuildings />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
            ${selectedKey === '/admin/manageadvertiser' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/admin/manageadvertiser">Nhà quảng cáo</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/admin/managepublisher"
          icon={<UserOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
            ${selectedKey === '/admin/managepublisher' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/admin/managepublisher">Nhà tiếp thị</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/admin/managereport"
          icon={<FileTextOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
            ${selectedKey === '/admin/managereport' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/admin/managereport">Báo cáo</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Hồ sơ, Đăng xuất) */}
      <div className="bg-gray-100 p-3">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          className="border-r-0"
        >
          <Menu.Item
            key="/admin/profile"
            icon={<UserOutlined />}
            className={`
              hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
              ${selectedKey === '/admin/profile' ? '!bg-[#9B52BF] !text-white' : ''}
            `}
          >
            <NavLink to="/admin/profile">Hồ sơ</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            style={{ color: 'red' }}
            onClick={handleLogout}
            disabled={isPending}
            className={`
              hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
              ${selectedKey === '/logout' ? '!bg-[#9B52BF] !text-white' : ''}
            `}
          >
            {/* Khi click vào Đăng xuất, hiển thị modal xác nhận */}
            <p>{isPending ? 'Đang xử lý...' : 'Đăng xuất'}</p>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default SidebarAdmin;
