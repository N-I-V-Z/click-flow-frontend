import React from 'react';
import { Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  PullRequestOutlined
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { BiBuildings } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { useLogout } from '@/queries/auth.query';
import helpers from '@/helpers';
import { logout } from '@/redux/auth.slice';
const { SubMenu } = Menu;

const SidebarAdmin: React.FC = () => {
  const { mutateAsync: logoutAccount } = useLogout();
  const router = useRouter();
  const dispatch = useDispatch();
  const refreshToken = helpers.cookie_get('RT');
  const { mutateAsync, isPending } = useLogout();

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
        h-[calc(90vh-64px)]
        w-64 flex-col
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
        {/* Tổng quan */}
        <Menu.Item key="overview" icon={<HomeOutlined />}>
          <NavLink to="/admin/dashboard">Tổng quan</NavLink>
        </Menu.Item>

        {/* Submenu Chiến dịch */}
        <SubMenu key="campaign" icon={<FileTextOutlined />} title="Chiến dịch">
          <Menu.Item key="campaign-list" icon={<OrderedListOutlined />}>
            <NavLink to="/admin/campaignlist">Danh sách chiến dịch</NavLink>
          </Menu.Item>
          <Menu.Item key="campaign-request" icon={<PullRequestOutlined />}>
            <NavLink to="/admin/campaignrequest">Yêu cầu chiến dịch</NavLink>
          </Menu.Item>
        </SubMenu>

        {/* Nhà quảng cáo */}
        <Menu.Item key="advertiser" icon={<BiBuildings />}>
          <NavLink to="/admin/manageadvertiser">Nhà quảng cáo</NavLink>
        </Menu.Item>

        {/* Nhà tiếp thị */}
        <Menu.Item key="publisher" icon={<UserOutlined />}>
          <NavLink to="/admin/managepublisher">Nhà tiếp thị</NavLink>
        </Menu.Item>

        {/* Báo cáo */}
        <Menu.Item key="report" icon={<FileTextOutlined />}>
          <NavLink to="/admin/managereport">Báo cáo</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Hồ sơ, Đăng xuất) */}
      <div className="bg-gray-100 p-3">
        <Menu mode="inline" className="border-r-0">
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <NavLink to="/admin/profile">Hồ sơ</NavLink>
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
    </div>
  );
};

export default SidebarAdmin;
