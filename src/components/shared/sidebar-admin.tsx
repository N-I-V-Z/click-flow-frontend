import React, { useState } from 'react';
import { Menu, Modal, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  PullRequestOutlined,
  MessageOutlined
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
  const location = useLocation();
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

        <Menu.Item
          key="/admin/support"
          icon={<MessageOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
            ${selectedKey === '/admin/support' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/admin/support">Hỗ trợ</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/admin/course"
          icon={<FileTextOutlined />}
          className={`
            hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]
            ${selectedKey === '/admin/course' ? '!bg-[#9B52BF] !text-white' : ''}
          `}
        >
          <NavLink to="/admin/course">Khóa học</NavLink>
        </Menu.Item>
      </Menu>

      {/* Khu vực dưới cùng (Hồ sơ, Đăng xuất) */}
      <div className="mb-5 border-t">
        <Menu mode="inline" className="border-r-0">
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
