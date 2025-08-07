import BasePages from '@/components/shared/base-pages';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
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
  const {
    data: activeCampaignData,
    isLoading: campaignLoading,
    refetch: refetchCampaigns
  } = useGetCampaignCountByStatus('Activing');
  const activeCampaignCount = activeCampaignData?.result ?? 0;

  // Lấy tổng số khóa học - với cấu hình aggressive để luôn fetch fresh data
  const {
    data: courseData,
    isLoading: courseLoading,
    refetch: refetchCourses
  } = useQuery({
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
  const {
    data: publisherData,
    isLoading: publisherLoading,
    refetch: refetchPublishers
  } = useGetUsersByRole('Publisher', 1, 100);
  const publisherCount = publisherData?.result?.totalItems ?? 0;

  const {
    data: advertiserData,
    isLoading: advertiserLoading,
    refetch: refetchAdvertisers
  } = useGetUsersByRole('Advertiser', 1, 100);
  const advertiserCount = advertiserData?.result?.totalItems ?? 0;

  // Lấy dữ liệu giao dịch để tạo biểu đồ doanh thu (tất cả giao dịch hệ thống)
  const {
    data: transactionData,
    isLoading: transactionLoading,
    refetch: refetchTransactions
  } = useGetAllTransactions(1, 100);

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

  // Dữ liệu cho biểu đồ donut user
  const userStatsData = [publisherCount, advertiserCount];
  const userLabels = ['Publishers', 'Advertisers'];

  // Cấu hình ApexCharts cho biểu đồ người dùng
  const userChartOptions = {
    chart: {
      type: 'donut' as const,
      height: 280,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    labels: userLabels,
    colors: ['#00C49F', '#FFBB28'], // Xanh lá và vàng giống Publisher dashboard
    legend: {
      position: 'bottom' as const,
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif'
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} người`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Tổng',
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151',
              formatter: () => `${publisherCount + advertiserCount}`
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`
    }
  };

  // Dữ liệu cho biểu đồ gói dịch vụ
  const planStatsData = React.useMemo(() => {
    const activePlans = activePlansData?.result?.datas || [];
    const inactivePlans = inactivePlansData?.result?.datas || [];

    return {
      data: [activePlans.length, inactivePlans.length],
      labels: ['Gói hoạt động', 'Gói tạm dừng']
    };
  }, [activePlansData, inactivePlansData]);

  // Cấu hình ApexCharts cho biểu đồ gói
  const planChartOptions = {
    chart: {
      type: 'donut' as const,
      height: 280,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    labels: planStatsData.labels,
    colors: ['#0088FE', '#AA66CC'], // Xanh dương và tím giống Publisher dashboard
    legend: {
      position: 'bottom' as const,
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif'
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} gói`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Tổng',
              fontSize: '16px',
              fontWeight: 600,
              color: '#374151',
              formatter: () =>
                `${planStatsData.data.reduce((a, b) => a + b, 0)}`
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`
    }
  };

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
        {/* Nút refresh tất cả data tổng quan - BÍ MẬT */}
        <div className="relative mb-6">
          <button
            onClick={async () => {
              // Gọi lại TẤT CẢ API cho phần tổng quan
              console.log('🔄 Refreshing all dashboard data...');

              try {
                await Promise.all([
                  refetchCampaigns(), // Chiến dịch đang hoạt động
                  refetchCourses(), // Khóa học đang hoạt động
                  refetchPublishers(), // Số lượng Publisher
                  refetchAdvertisers(), // Số lượng Advertiser
                  refetchTransactions() // Doanh thu tháng này
                ]);
                console.log('✅ All dashboard data refreshed successfully!');
              } catch (error) {
                console.error('❌ Error refreshing dashboard data:', error);
              }
            }}
            className="absolute right-0 top-0 z-10 h-16 w-20 cursor-default bg-transparent opacity-0"
            style={{
              border: 'none',
              outline: 'none',
              userSelect: 'none',
              pointerEvents: 'auto'
            }}
            aria-hidden="true"
          />
        </div>

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

        {/* 2 biểu đồ được chia thành 1 hàng, 2 biểu đồ */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Donut Chart - Thống kê User */}
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
              <div className="h-80">
                <Chart
                  options={userChartOptions}
                  series={userStatsData}
                  type="donut"
                  height={280}
                />
              </div>
            )}
          </div>

          {/* Donut Chart - Thống kê gói */}
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
              <div className="h-80">
                <Chart
                  options={planChartOptions}
                  series={planStatsData.data}
                  type="donut"
                  height={280}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default AdminDashboard;
