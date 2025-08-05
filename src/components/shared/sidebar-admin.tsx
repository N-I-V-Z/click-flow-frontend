import React, { useState, useEffect } from 'react';
import { Menu, Modal, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  PullRequestOutlined,
  MessageOutlined,
  GiftOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  KeyOutlined
} from '@ant-design/icons';

import { NavLink, useLocation } from 'react-router-dom';
import { BiBuildings } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { useLogout } from '@/queries/auth.query';
import helpers from '@/helpers';
import { logout } from '@/redux/auth.slice';
import { useQueryClient } from '@tanstack/react-query';
const { SubMenu } = Menu;

const SidebarAdmin: React.FC = () => {
  const { mutateAsync: logoutAccount, isPending } = useLogout();
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Initialize and sync sidebar state with current route
  useEffect(() => {
    const shouldOpenDropdown = localStorage.getItem(
      'admin-sidebar-open-dropdown'
    );

    // Update selected key to match current location
    setSelectedKey(location.pathname);

    // Auto-open dropdowns based on current path or localStorage signal
    const newOpenKeys: string[] = [];

    if (location.pathname.includes('/admin/withdraw-transactions/')) {
      newOpenKeys.push('withdraw-transactions');
    }

    if (location.pathname.includes('/admin/campaign')) {
      newOpenKeys.push('campaign');
    }

    // Add dropdown from localStorage signal
    if (shouldOpenDropdown && !newOpenKeys.includes(shouldOpenDropdown)) {
      newOpenKeys.push(shouldOpenDropdown);
    }

    setOpenKeys(newOpenKeys);

    // Clean up localStorage
    if (shouldOpenDropdown) {
      localStorage.removeItem('admin-sidebar-open-dropdown');
    }
  }, [location.pathname]);

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
        h-[calc(90vh-64px)]
        w-64 flex-col
        border-r
        border-gray-200
      "
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onClick={(e) => setSelectedKey(e.key)}
        className="flex-grow border-r-0"
      >
        <Menu.Item
          key="/admin/dashboard"
          icon={<HomeOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/admin/dashboard'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/admin/dashboard">Tổng quan</NavLink>
        </Menu.Item>

        <SubMenu
          key="campaign"
          icon={<FileTextOutlined />}
          title="Chiến dịch"
          className="transition-all duration-200 [&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover_.ant-menu-submenu-title]:!bg-white [&:hover_.ant-menu-submenu-title]:!text-[#9B52BF] [&:hover_.anticon]:!text-[#9B52BF]"
        >
          <Menu.Item
            key="/admin/campaignlist"
            icon={<OrderedListOutlined />}
            className={`
              transition-all duration-200
              ${
                selectedKey === '/admin/campaignlist'
                  ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                  : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
              }
            `}
          >
            <NavLink to="/admin/campaignlist">Danh sách chiến dịch</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/admin/campaignrequest"
            icon={<PullRequestOutlined />}
            className={`
              transition-all duration-200
              ${
                selectedKey === '/admin/campaignrequest'
                  ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                  : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
              }
            `}
          >
            <NavLink to="/admin/campaignrequest">Yêu cầu chiến dịch</NavLink>
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          key="/admin/manageadvertiser"
          icon={<BiBuildings />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/admin/manageadvertiser'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/admin/manageadvertiser">Nhà quảng cáo</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/admin/managepublisher"
          icon={<UserOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/admin/managepublisher'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/admin/managepublisher">Nhà tiếp thị</NavLink>
        </Menu.Item>

        <SubMenu
          key="withdraw-transactions"
          icon={<DollarCircleOutlined />}
          title="Giao dịch rút tiền"
          className="transition-all duration-200 [&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover_.ant-menu-submenu-title]:!bg-white [&:hover_.ant-menu-submenu-title]:!text-[#9B52BF] [&:hover_.anticon]:!text-[#9B52BF]"
        >
          <Menu.Item
            key="/admin/withdraw-transactions/pending"
            icon={<ClockCircleOutlined />}
            className={`
              transition-all duration-200
              ${
                selectedKey === '/admin/withdraw-transactions/pending' ||
                selectedKey.includes('/admin/withdraw-transactions/pending')
                  ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                  : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
              }
            `}
          >
            <NavLink to="/admin/withdraw-transactions/pending">
              Chưa duyệt
            </NavLink>
          </Menu.Item>
          <Menu.Item
            key="/admin/withdraw-transactions/approved"
            icon={<CheckCircleOutlined />}
            className={`
              transition-all duration-200
              ${
                selectedKey === '/admin/withdraw-transactions/approved' ||
                selectedKey.includes('/admin/withdraw-transactions/approved')
                  ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                  : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
              }
            `}
          >
            <NavLink to="/admin/withdraw-transactions/approved">
              Đã duyệt
            </NavLink>
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          key="/admin/support"
          icon={<MessageOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/admin/support'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/admin/support">Hỗ trợ</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/admin/course"
          icon={<FileTextOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/admin/course'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/admin/course">Khóa học</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/admin/plan"
          icon={<GiftOutlined />}
          className={`
            transition-all duration-200
            ${
              selectedKey === '/admin/plan'
                ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
            }
          `}
        >
          <NavLink to="/admin/plan">Quản lí gói</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Đổi mật khẩu, Đăng xuất) */}
      <div className="mb-5 border-t">
        <Menu mode="inline" className="border-r-0">
          <Menu.Item
            key="/admin/change-password"
            icon={<KeyOutlined />}
            className={`
              transition-all duration-200
              ${
                selectedKey === '/admin/change-password'
                  ? '!bg-[#9B52BF] !text-white [&_.ant-menu-title-content]:!text-white [&_span]:!text-white'
                  : '[&:hover]:border-l-4 [&:hover]:!border-l-[#9B52BF] [&:hover]:!bg-white [&:hover]:!text-[#9B52BF] [&:hover_.ant-menu-title-content]:!text-[#9B52BF] [&:hover_span]:!text-[#9B52BF]'
              }
            `}
          >
            <NavLink to="/admin/change-password">Đổi mật khẩu</NavLink>
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
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Admin không?
        </p>
      </Modal>
    </div>
  );
};

export default SidebarAdmin;
