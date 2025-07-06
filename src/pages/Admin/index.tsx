import BasePages from '@/components/shared/base-pages';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useGetOwnWallet } from '@/queries/wallet.query';
import { useGetCampaignCountByStatus } from '@/queries/campaign.query';
import { useGetCourseAdmin } from '@/queries/course.query';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dữ liệu giả lập cho LineChart (doanh thu theo tháng)
  const revenueData = [
    { month: 'Th1', revenue: 150 },
    { month: 'Th2', revenue: 200 },
    { month: 'Th3', revenue: 250 },
    { month: 'Th4', revenue: 180 },
    { month: 'Th5', revenue: 300 },
    { month: 'Th6', revenue: 400 }
  ];

  // Dữ liệu cho BarChart (Publisher vs Advertiser)
  const participationData = [
    { name: 'Publisher', count: 1200 },
    { name: 'Advertiser', count: 500 }
  ];

  // Lấy số dư ví
  const { data: walletData, isLoading: walletLoading } = useGetOwnWallet();
  const balance = walletData?.result?.balance ?? 0;

  // Lấy số lượng chiến dịch đang hoạt động
  const { data: activeCampaignData, isLoading: campaignLoading } =
    useGetCampaignCountByStatus('Activing');
  const activeCampaignCount = activeCampaignData?.result ?? 0;

  // Lấy tổng số khóa học
  const { data: courseData, isLoading: courseLoading } = useGetCourseAdmin(
    1,
    10
  );
  const totalCourses = courseData?.result?.totalItems ?? 0;

  // Handlers for quick access buttons
  const handleQuickAccess = (
    targetPath: string,
    dropdownKey?: string,
    isCreateAction?: boolean
  ) => {
    // Nếu cần mở dropdown, set localStorage trước khi navigate
    if (dropdownKey) {
      localStorage.setItem('admin-sidebar-open-dropdown', dropdownKey);
    } else {
      localStorage.removeItem('admin-sidebar-open-dropdown');
    }

    // Xử lý các tác vụ tạo mới
    if (isCreateAction) {
      if (targetPath === '/admin/course') {
        // Trigger tạo khóa học mới - có thể mở modal hoặc navigate đến form tạo
        localStorage.setItem('admin-trigger-create-course', 'true');
      } else if (targetPath === '/admin/plan') {
        // Trigger tạo gói mới - có thể mở modal hoặc navigate đến form tạo
        localStorage.setItem('admin-trigger-create-plan', 'true');
      }
    }

    // Navigate đến trang đích
    navigate(targetPath);
  };

  return (
    <BasePages pageHead="ClickFlow - Dashboard">
      <div className="w-full px-6 py-8">
        {/* 4 ô thống kê (canh đều) */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Doanh thu tháng này */}
          <div className="rounded bg-[#24A503] p-4 text-center text-white">
            <h2 className="text-2xl font-bold">
              {walletLoading ? '...' : balance.toLocaleString('vi-VN') + 'đ'}
            </h2>
            <p>Doanh thu tháng này</p>
          </div>

          {/* Khóa học đang hoạt động */}
          <div className="rounded bg-[#F6B93B] p-4 text-center text-white">
            <h2 className="text-2xl font-bold">
              {courseLoading ? '...' : totalCourses}
            </h2>
            <p>Khóa học đang hoạt động</p>
          </div>

          {/* Tổng số report chưa xử lý */}
          <div className="rounded bg-[#E45959] p-4 text-center text-white">
            <h2 className="text-2xl font-bold">44</h2>
            <p>Tổng số report chưa xử lý</p>
          </div>

          {/* Chiến dịch đang hoạt động */}
          <div className="rounded bg-[#1959AD] p-4 text-center text-white">
            <h2 className="text-2xl font-bold">
              {campaignLoading ? '...' : activeCampaignCount}
            </h2>
            <p>Chiến dịch đang hoạt động</p>
          </div>
        </div>

        {/* Tiêu đề trung tâm */}
        <h2 className="mb-4 text-center text-xl font-semibold">
          Truy cập nhanh bằng thông tin
        </h2>

        {/* 4 nút truy cập nhanh (canh đều) */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() =>
              handleQuickAccess('/admin/campaignrequest', 'campaign')
            }
            className="transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
          >
            Yêu cầu chiến dịch
          </button>
          <button
            onClick={() =>
              handleQuickAccess(
                '/admin/withdraw-transactions/pending',
                'withdraw-transactions'
              )
            }
            className="transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
          >
            Duyệt giao dịch rút tiền
          </button>
          <button
            onClick={() => handleQuickAccess('/admin/course', undefined, true)}
            className="transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
          >
            Tạo khóa học mới
          </button>
          <button
            onClick={() => handleQuickAccess('/admin/plan', undefined, true)}
            className="transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700"
          >
            Tạo gói mới
          </button>
        </div>

        {/* Dashboard */}
        <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>

        {/* Khu vực biểu đồ (nền hồng) */}
        <div className="grid grid-cols-1 gap-4 bg-pink-100 p-4 md:grid-cols-2">
          {/* BIỂU ĐỒ 1: LineChart (Doanh thu theo tháng) */}
          <div className="h-72 w-full rounded bg-white p-2 shadow">
            <h3 className="mb-2 text-center font-semibold">
              Doanh thu theo tháng (triệu)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BIỂU ĐỒ 2: BarChart (Publisher vs Advertiser) */}
          <div className="h-72 w-full rounded bg-white p-2 shadow">
            <h3 className="mb-2 text-center font-semibold">
              Lượng Publisher và Advertiser tham gia
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={participationData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default AdminDashboard;
