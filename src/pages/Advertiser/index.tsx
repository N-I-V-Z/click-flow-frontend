import React, { useState, useMemo } from 'react';
import { FaClock, FaTimesCircle, FaCheckCircle, FaPlay } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import CreateNewCampaign from './CreateNewCampaign';
import { useGetUserDetail } from '@/queries/user.query';
import { useGetOwnTransaction } from '@/queries/transaction.query';
import { useGetTrafficForAdvertiser } from '@/queries/traffic.query';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';

import { useGetCampaignStatusCount } from '@/queries/campaign.query';
import BasePages from '@/components/shared/base-pages';
import { useAutoRefresh } from '@/hooks/use-auto-refresh';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const advertiserId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const AdvertiserDashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeRange, setTimeRange] = useState<
    '7days' | '1month' | '3months' | '6months' | '1year'
  >('1month');

  const { data, refetch: refetchUserDetail } = useGetUserDetail(advertiserId);
  const user = data?.result;

  // Sử dụng API mới để lấy dữ liệu trạng thái campaign với auto-refresh
  const {
    data: statusCountData,
    isLoading: isStatusCountLoading,
    refetch: refetchStatusCount
  } = useGetCampaignStatusCount();

  // Lấy dữ liệu ví và giao dịch cho biểu đồ với auto-refresh
  const { data: transactionData, refetch: refetchTransactionData } =
    useGetOwnTransaction(1, 100);

  // Lấy dữ liệu traffic cho advertiser
  const { data: trafficData, refetch: refetchTrafficData } =
    useGetTrafficForAdvertiser(1, 50);

  // Sử dụng custom hook để auto-refresh
  useAutoRefresh([
    refetchStatusCount,
    refetchTransactionData,
    refetchUserDetail,
    refetchTrafficData
  ]);

  // Tạo dữ liệu cho biểu đồ trạng thái campaign (chỉ hiển thị 4 trạng thái)
  const campaignStatusData = [
    {
      name: 'Cần phê duyệt',
      value: statusCountData?.result?.pendingCount ?? 0,
      fill: '#6366f1'
    },
    {
      name: 'Đang chạy',
      value: statusCountData?.result?.activingCount ?? 0,
      fill: '#10b981'
    },
    {
      name: 'Đã bị từ chối',
      value: statusCountData?.result?.canceledCount ?? 0,
      fill: '#f59e0b'
    },
    {
      name: 'Đã hoàn thành',
      value: statusCountData?.result?.completedCount ?? 0,
      fill: '#8b5cf6'
    }
  ];

  // Hàm chuyển đổi múi giờ UTC+0 sang UTC+7 (Việt Nam)
  const convertToVietnamTime = (utcDateString: string) => {
    const utcDate = new Date(utcDateString);
    const vietnamTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime;
  };

  // Hàm lấy khoảng thời gian dựa trên lựa chọn
  const getDateRange = (range: string) => {
    const now = new Date();
    const vietnamNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    let startDate: Date;

    switch (range) {
      case '7days':
        startDate = new Date(vietnamNow.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        startDate = new Date(vietnamNow.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(vietnamNow.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(vietnamNow.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(vietnamNow.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(vietnamNow.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate: vietnamNow };
  };

  // Tạo dữ liệu cho biểu đồ giao dịch theo khoảng thời gian được chọn
  const transactionChartData = useMemo(() => {
    if (!transactionData?.result?.datas) return [];

    const { startDate, endDate } = getDateRange(timeRange);

    // Lọc giao dịch theo khoảng thời gian
    const filteredTransactions = transactionData.result.datas.filter(
      (transaction) => {
        const transactionDate = convertToVietnamTime(
          transaction.paymentDate.toString()
        );
        return transactionDate >= startDate && transactionDate <= endDate;
      }
    );

    // Tạo dữ liệu theo định dạng phù hợp với timeRange
    const chartData = {} as Record<
      string,
      { time: string; deposit: number; withdraw: number }
    >;

    filteredTransactions.forEach((transaction) => {
      const transactionDate = convertToVietnamTime(
        transaction.paymentDate.toString()
      );
      let timeKey: string;

      if (timeRange === '7days') {
        timeKey = transactionDate.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit'
        });
      } else if (timeRange === '1month') {
        timeKey = `Tuần ${Math.ceil(transactionDate.getDate() / 7)}`;
      } else {
        timeKey = `Th${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`;
      }

      if (!chartData[timeKey]) {
        chartData[timeKey] = { time: timeKey, deposit: 0, withdraw: 0 };
      }

      const amountInMillion = transaction.amount / 1000000;
      if (transaction.transactionType === 'Deposit') {
        chartData[timeKey].deposit += amountInMillion;
      } else if (transaction.transactionType === 'Withdraw') {
        chartData[timeKey].withdraw += amountInMillion;
      }
    });

    return Object.values(chartData);
  }, [transactionData, timeRange]);

  // Tạo dữ liệu thống kê traffic
  const trafficStatsData = useMemo(() => {
    if (!trafficData?.result?.datas) return [];

    const stats = trafficData.result.datas.reduce(
      (acc, traffic) => {
        const date = convertToVietnamTime(traffic.timestamp.toString());
        const dateKey = date.toLocaleDateString('vi-VN');

        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, clicks: 0, views: 0 };
        }

        acc[dateKey].clicks += 1;
        // Giả định views cao hơn clicks (có thể adjust dựa trên dữ liệu thực)
        acc[dateKey].views += Math.floor(Math.random() * 3) + 2;

        return acc;
      },
      {} as Record<string, { date: string; clicks: number; views: number }>
    );

    return Object.values(stats).slice(-10); // Lấy 10 ngày gần nhất
  }, [trafficData]);

  // Dữ liệu cho biểu đồ thiết bị
  const deviceStatsData = useMemo(() => {
    if (!trafficData?.result?.datas) return [];

    const deviceStats = trafficData.result.datas.reduce(
      (acc, traffic) => {
        const device = traffic.deviceType || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(deviceStats).map(([device, count]) => ({
      name: device,
      value: count as number,
      fill:
        device === 'Mobile'
          ? '#06b6d4'
          : device === 'Desktop'
            ? '#6366f1'
            : '#f59e0b'
    }));
  }, [trafficData]);

  // Dữ liệu cho biểu đồ trình duyệt
  const browserStatsData = useMemo(() => {
    if (!trafficData?.result?.datas) return [];

    const browserStats = trafficData.result.datas.reduce(
      (acc, traffic) => {
        const browser = traffic.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6366f1'];
    return Object.entries(browserStats).map(([browser, count], index) => ({
      name: browser,
      value: count as number,
      fill: colors[index % colors.length]
    }));
  }, [trafficData]);

  // Dữ liệu cho biểu đồ doanh thu theo tháng
  const monthlyRevenueData = useMemo(() => {
    if (!transactionData?.result?.datas) return [];

    const monthlyData = {} as Record<
      string,
      { month: string; revenue: number; expense: number; profit: number }
    >;
    const currentYear = new Date().getFullYear();

    // Khởi tạo dữ liệu cho 12 tháng
    for (let i = 1; i <= 12; i++) {
      monthlyData[`Th${i}`] = {
        month: `Th${i}`,
        revenue: 0,
        expense: 0,
        profit: 0
      };
    }

    transactionData.result.datas.forEach((transaction) => {
      const date = convertToVietnamTime(transaction.paymentDate.toString());
      if (date.getFullYear() === currentYear) {
        const monthKey = `Th${date.getMonth() + 1}`;
        const amount = transaction.amount / 1000000; // Convert to millions

        if (transaction.transactionType === 'Deposit') {
          monthlyData[monthKey].revenue += amount;
        } else if (transaction.transactionType === 'Withdraw') {
          monthlyData[monthKey].expense += amount;
        }

        monthlyData[monthKey].profit =
          monthlyData[monthKey].revenue - monthlyData[monthKey].expense;
      }
    });

    return Object.values(monthlyData);
  }, [transactionData]);

  return (
    <BasePages pageHead="ClickFlow - Tổng quan ">
      <div className="min-h-screen pb-20">
        {/* HEADER */}
        <header className="bg-transparent px-10 py-5">
          <div className="text-center text-white">
            <h1 className="mb-0 text-3xl font-bold text-[#DD83E0]">
              Xin chào, {user?.user.fullName}
            </h1>
            <p className="text-gray-500">Chúc bạn có một ngày tốt lành</p>
          </div>
        </header>

        {/* NỘI DUNG */}
        <main className="px-10 py-5">
          {/* Nút tạo chiến dịch */}
          <div className="mb-5 text-right">
            <button
              type="button"
              onClick={() => setIsModalVisible(true)}
              className="rounded-lg px-6 py-3 font-semibold text-white shadow-lg"
              style={{
                background: 'linear-gradient(to right, #e11d48, #dc2626)'
              }}
            >
              ✨ Tạo mới chiến dịch
            </button>
          </div>

          {/* Các thẻ thống kê trạng thái chiến dịch */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* Cần phê duyệt (Pending) */}
            <div
              className="rounded-xl p-6 text-center text-white backdrop-blur"
              style={{
                background: 'linear-gradient(to bottom right, #2563eb, #3b82f6)'
              }}
            >
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaClock size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">
                Cần phê duyệt
              </h4>
              <p className="text-3xl font-bold">
                {isStatusCountLoading
                  ? '...'
                  : statusCountData?.result?.pendingCount ?? 0}
              </p>
            </div>

            {/* Đang chạy (Activing) */}
            <div
              className="rounded-xl p-6 text-center text-white backdrop-blur"
              style={{
                background: 'linear-gradient(to bottom right, #16a34a, #22c55e)'
              }}
            >
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaPlay size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">Đang chạy</h4>
              <p className="text-3xl font-bold">
                {isStatusCountLoading
                  ? '...'
                  : statusCountData?.result?.activingCount ?? 0}
              </p>
            </div>

            {/* Đã bị từ chối (Canceled) */}
            <div
              className="rounded-xl p-6 text-center text-white backdrop-blur"
              style={{
                background: 'linear-gradient(to bottom right, #dc2626, #ef4444)'
              }}
            >
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaTimesCircle size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">
                Đã bị từ chối
              </h4>
              <p className="text-3xl font-bold">
                {isStatusCountLoading
                  ? '...'
                  : statusCountData?.result?.canceledCount ?? 0}
              </p>
            </div>

            {/* Đã hoàn thành (Completed) */}
            <div
              className="rounded-xl p-6 text-center text-white backdrop-blur"
              style={{
                background: 'linear-gradient(to bottom right, #ea580c, #f97316)'
              }}
            >
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaCheckCircle size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">
                Đã hoàn thành
              </h4>
              <p className="text-3xl font-bold">
                {isStatusCountLoading
                  ? '...'
                  : statusCountData?.result?.completedCount ?? 0}
              </p>
            </div>
          </div>

          {/* Biểu đồ Analytics */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Biểu đồ trạng thái campaign */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Phân bố trạng thái Campaign
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ giao dịch theo khoảng thời gian */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Giao dịch theo thời gian (triệu VNĐ)
                </h3>
                <select
                  value={timeRange}
                  onChange={(e) =>
                    setTimeRange(
                      e.target.value as
                        | '7days'
                        | '1month'
                        | '3months'
                        | '6months'
                        | '1year'
                    )
                  }
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="7days">7 ngày</option>
                  <option value="1month">1 tháng</option>
                  <option value="3months">3 tháng</option>
                  <option value="6months">6 tháng</option>
                  <option value="1year">1 năm</option>
                </select>
              </div>
              <div className="h-64">
                {transactionChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transactionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="deposit"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Nạp tiền"
                      />
                      <Line
                        type="monotone"
                        dataKey="withdraw"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        name="Rút tiền"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">
                      Chưa có dữ liệu giao dịch trong khoảng thời gian này
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Biểu đồ Traffic mới */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Biểu đồ Traffic theo ngày */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Thống kê Traffic (10 ngày gần nhất)
              </h3>
              <div className="h-64">
                {trafficStatsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficStatsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" fill="#8b5cf6" name="Click" />
                      <Bar dataKey="views" fill="#06b6d4" name="View" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu traffic</p>
                  </div>
                )}
              </div>
            </div>

            {/* Biểu đồ Pie Chart cho trạng thái campaign */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Tỷ lệ trạng thái Campaign
              </h3>
              <div className="h-64">
                {campaignStatusData.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={campaignStatusData.filter(
                          (item) => item.value > 0
                        )}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          percent > 0
                            ? `${name} ${(percent * 100).toFixed(0)}%`
                            : ''
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {campaignStatusData
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu campaign</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thêm hàng biểu đồ mới */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Biểu đồ thiết bị */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Thống kê theo thiết bị
              </h3>
              <div className="h-64">
                {deviceStatsData.length > 0 &&
                deviceStatsData.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceStatsData.filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          percent > 0
                            ? `${name} ${(percent * 100).toFixed(0)}%`
                            : ''
                        }
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceStatsData
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu thiết bị</p>
                  </div>
                )}
              </div>
            </div>

            {/* Biểu đồ trình duyệt */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Thống kê theo trình duyệt
              </h3>
              <div className="h-64">
                {browserStatsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={browserStatsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu trình duyệt</p>
                  </div>
                )}
              </div>
            </div>

            {/* Biểu đồ doanh thu theo tháng */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Doanh thu năm {new Date().getFullYear()} (triệu VNĐ)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Doanh thu"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Chi phí"
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#6366f1"
                      strokeWidth={3}
                      name="Lợi nhuận"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>

        {/* Modal tạo chiến dịch */}
        <CreateNewCampaign
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
        />
      </div>
    </BasePages>
  );
};

export default AdvertiserDashboard;
