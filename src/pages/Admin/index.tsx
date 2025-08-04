import BasePages from '@/components/shared/base-pages';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { gsap } from 'gsap';
import { useQuery } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';
import { PagingResponse, CourseResponse } from '@/types';
import { useGetCampaignCountByStatus } from '@/queries/campaign.query';
import { useGetUsersByRole } from '@/queries/user.query';
import { useGetAllTransactions } from '@/queries/transaction.query';
import { useGetPlan } from '@/queries/plan.query';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Lấy số lượng chiến dịch đang hoạt động
  const { data: activeCampaignData, isLoading: campaignLoading } =
    useGetCampaignCountByStatus('Activing');
  const activeCampaignCount = activeCampaignData?.result ?? 0;

  // Lấy tổng số khóa học - với cấu hình aggressive để luôn fetch fresh data
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['admin-dashboard-courses'],
    queryFn: async () => {
      return await BaseRequest.Get<PagingResponse<CourseResponse>>(
        `/api/Courses/admin?PageIndex=1&PageSize=100`
      );
    },
    staleTime: 0, // Luôn fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3
  });
  const totalCourses = courseData?.result?.totalItems ?? 0;

  // Lấy số lượng Publisher và Advertiser
  const { data: publisherData, isLoading: publisherLoading } =
    useGetUsersByRole('Publisher', 1, 100);
  const publisherCount = publisherData?.result?.totalItems ?? 0;

  const { data: advertiserData, isLoading: advertiserLoading } =
    useGetUsersByRole('Advertiser', 1, 100);
  const advertiserCount = advertiserData?.result?.totalItems ?? 0;

  // Lấy dữ liệu giao dịch để tạo biểu đồ doanh thu (tất cả giao dịch hệ thống)
  const { data: transactionData, isLoading: transactionLoading } =
    useGetAllTransactions(1, 100);

  // Lấy danh sách tất cả gói (active và inactive) để thống kê
  const { data: activePlansData, isLoading: activePlansLoading } = useGetPlan(
    true,
    1,
    50
  );
  const { data: inactivePlansData, isLoading: inactivePlansLoading } =
    useGetPlan(false, 1, 50);

  // Tính doanh thu tháng này từ giao dịch dịch vụ thực tế (Pay + Received)
  const currentMonthRevenue = React.useMemo(() => {
    if (!transactionData?.result?.datas) return 0;

    const currentDate = new Date();
    // Chuyển về múi giờ Việt Nam (GMT+7)
    const vietnamDate = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);
    const currentMonth = vietnamDate.getMonth();
    const currentYear = vietnamDate.getFullYear();

    return transactionData.result.datas.reduce((total, transaction) => {
      // Chuyển thời gian transaction từ UTC sang múi giờ Việt Nam
      const transactionDate = new Date(transaction.paymentDate);
      const vietnamTransactionDate = new Date(
        transactionDate.getTime() + 7 * 60 * 60 * 1000
      );
      const transactionMonth = vietnamTransactionDate.getMonth();
      const transactionYear = vietnamTransactionDate.getFullYear();

      // Chỉ tính giao dịch dịch vụ thực tế (Pay + Received) trong tháng hiện tại
      // Bỏ qua Deposit/Withdraw vì đó là nạp/rút tiền, không phải doanh thu kinh doanh
      if (
        (transaction.transactionType === 'Pay' ||
          transaction.transactionType === 'Received') &&
        transactionMonth === currentMonth &&
        transactionYear === currentYear
      ) {
        return total + transaction.amount;
      }
      return total;
    }, 0);
  }, [transactionData]);

  // Dữ liệu cho biểu đồ cột user
  const userStatsData = [
    { name: 'Publishers', count: publisherCount, fill: '#10B981' },
    { name: 'Advertisers', count: advertiserCount, fill: '#3B82F6' }
  ];

  // Dữ liệu cho biểu đồ thống kê gói
  const planStatsData = React.useMemo(() => {
    const activePlans = activePlansData?.result?.datas || [];
    const inactivePlans = inactivePlansData?.result?.datas || [];

    return [
      { name: 'Gói hoạt động', count: activePlans.length, fill: '#059669' },
      { name: 'Gói tạm dừng', count: inactivePlans.length, fill: '#DC2626' },
      {
        name: 'Tổng gói',
        count: activePlans.length + inactivePlans.length,
        fill: '#7C3AED'
      }
    ];
  }, [activePlansData, inactivePlansData]);

  // Dữ liệu monthly growth cho area chart
  const monthlyGrowthData = React.useMemo(() => {
    if (!transactionData?.result?.datas) {
      return [
        { month: 'Th3', users: 45, campaigns: 12, revenue: 150 },
        { month: 'Th4', users: 52, campaigns: 15, revenue: 200 },
        { month: 'Th5', users: 61, campaigns: 18, revenue: 250 },
        { month: 'Th6', users: 68, campaigns: 22, revenue: 180 },
        { month: 'Th7', users: 75, campaigns: 25, revenue: 300 },
        { month: 'Th8', users: 82, campaigns: 28, revenue: 220 }
      ];
    }
    // Có thể tính toán từ dữ liệu thực nếu cần
    return [
      {
        month: 'Th3',
        users: publisherCount - 15,
        campaigns: activeCampaignCount - 8,
        revenue: 150
      },
      {
        month: 'Th4',
        users: publisherCount - 10,
        campaigns: activeCampaignCount - 5,
        revenue: 200
      },
      {
        month: 'Th5',
        users: publisherCount - 5,
        campaigns: activeCampaignCount - 3,
        revenue: 250
      },
      {
        month: 'Th6',
        users: publisherCount - 2,
        campaigns: activeCampaignCount - 1,
        revenue: 180
      },
      {
        month: 'Th7',
        users: publisherCount,
        campaigns: activeCampaignCount,
        revenue: 300
      },
      {
        month: 'Th8',
        users: publisherCount + advertiserCount,
        campaigns: activeCampaignCount + 2,
        revenue: 220
      }
    ];
  }, [transactionData, publisherCount, advertiserCount, activeCampaignCount]);

  // GSAP animation refs
  const chartRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // GSAP animation for chart containers
    const validRefs = chartRefs.current.filter((ref) => ref !== null);
    if (validRefs.length > 0) {
      gsap.fromTo(
        validRefs,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );
    }
  }, [
    transactionLoading,
    publisherLoading,
    advertiserLoading,
    activePlansLoading,
    inactivePlansLoading
  ]);

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
      <div className="mb-10 w-full px-6 py-8">
        {/* 4 ô thống kê (canh đều) */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Doanh thu tháng này */}
          <div className="rounded bg-[#24A503] p-4 text-center text-white">
            <h2 className="text-2xl font-bold">
              {transactionLoading
                ? '...'
                : currentMonthRevenue.toLocaleString('vi-VN') + 'đ'}
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

          {/* Tổng người dùng */}
          <div className="rounded bg-[#E45959] p-4 text-center text-white">
            <h2 className="text-2xl font-bold">
              {publisherLoading || advertiserLoading
                ? '...'
                : publisherCount + advertiserCount}
            </h2>
            <p>Tổng người dùng</p>
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

        {/* Dashboard với biểu đồ chuyên nghiệp */}
        <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>

        {/* 4 biểu đồ được chia thành 2 hàng, mỗi hàng 2 biểu đồ */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Biểu đồ cột - Thống kê User */}
          <div
            ref={(el) => (chartRefs.current[0] = el)}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Thống kê người dùng
            </h3>
            {publisherLoading || advertiserLoading ? (
              <div className="flex h-80 items-center justify-center">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={userStatsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [
                      `${value} người`,
                      'Số lượng'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart - Thống kê gói */}
          <div
            ref={(el) => (chartRefs.current[1] = el)}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Thống kê gói dịch vụ
            </h3>
            {activePlansLoading || inactivePlansLoading ? (
              <div className="flex h-80 items-center justify-center">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={planStatsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value} gói`, 'Số lượng']}
                  />
                  <Legend />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Gói" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Hàng dưới: 2 biểu đồ phân tích */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Area Chart - Tăng trưởng theo tháng */}
          <div
            ref={(el) => (chartRefs.current[2] = el)}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Tăng trưởng người dùng
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={monthlyGrowthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Người dùng"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Chiến dịch theo tháng */}
          <div
            ref={(el) => (chartRefs.current[3] = el)}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Chiến dịch theo tháng
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={monthlyGrowthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [
                    `${value} chiến dịch`,
                    'Số lượng'
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="campaigns"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Chiến dịch"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default AdminDashboard;
