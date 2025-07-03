import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import BasePages from '@/components/shared/base-pages';
import {
  useGetPublisherBrowserStats,
  useGetPublisherDeviceStats
} from '@/queries/traffic.query';
import { useGetOwnTransaction } from '@/queries/transaction.query';
// import __helpers from '@/helpers';
// import helpers from '@/helpers';

/* ----------------- PHẦN DASHBOARD ----------------- */
const PublisherDashboard: React.FC = () => {
  // State cho loại biểu đồ
  const [chartType, setChartType] = useState('area');

  // Lấy publisherId từ token
  // const decodedToken = helpers.decodeTokens(__helpers.cookie_get('AT'));
  // const publisherId = decodedToken?.Id ? Number(decodedToken.Id) : undefined;

  // Lấy dữ liệu trình duyệt thực tế từ API
  const { data: browserStatsData, isLoading: browserStatsLoading } =
    useGetPublisherBrowserStats();
  const browserData = browserStatsData?.result || [];
  const totalBrowserClicks = browserData.reduce(
    (acc, browser) => acc + browser.clickCount,
    0
  );

  // Lấy dữ liệu thiết bị thực tế từ API
  const { data: deviceStatsData, isLoading: deviceStatsLoading } =
    useGetPublisherDeviceStats();
  const devicePlatforms = deviceStatsData?.result || [];

  // Lấy dữ liệu giao dịch thực tế từ API
  const { data: transactionData } = useGetOwnTransaction(1, 10);
  const transactions = transactionData?.result?.datas || [];

  // Chuyển đổi dữ liệu giao dịch thành dữ liệu cho AreaChart với cải tiến
  const moneyChartData = transactions
    .slice()
    .reverse()
    .map((item) => {
      // Chuyển UTC về GMT+7
      const date = new Date(item.paymentDate);
      date.setHours(date.getHours() - 7);

      const deposit = item.transactionType === 'Deposit' ? item.amount : 0;
      const withdraw = item.transactionType === 'Withdraw' ? item.amount : 0;
      const net = deposit - withdraw;

      return {
        time: date.toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit'
        }),
        deposit,
        withdraw,
        balance: item.balance,
        net
      };
    });

  // Tính toán thống kê tổng quan
  const totalDeposit = moneyChartData.reduce(
    (sum, item) => sum + item.deposit,
    0
  );
  const totalWithdraw = moneyChartData.reduce(
    (sum, item) => sum + item.withdraw,
    0
  );
  const netFlow = totalDeposit - totalWithdraw;
  const currentBalance =
    moneyChartData[moneyChartData.length - 1]?.balance || 0;

  const conversionData = [
    { name: 'Chiến dịch A', value: 1200000 },
    { name: 'Chiến dịch B', value: 800000 },
    { name: 'Chiến dịch C', value: 600000 },
    { name: 'Chiến dịch D', value: 300000 }
  ];

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AA66CC',
    '#F75C03'
  ];

  // Mã màu 16: #8B5CF6
  // const COLOR_16 = '#8B5CF6';

  // Định nghĩa lại màu đa dạng cho từng loại dữ liệu
  const COLOR_DEPOSIT = '#0088FE'; // Tổng nạp
  const COLOR_WITHDRAW = '#00C49F'; // Tổng rút
  const COLOR_BALANCE = '#AA66CC'; // Số dư
  // Framer Motion
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Helper functions cho biểu đồ mới
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Sửa CustomTooltip nhận props optional đúng chuẩn Recharts
  const CustomTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {new Intl.NumberFormat('vi-VN').format(entry.value)}{' '}
              VNĐ
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <BasePages pageHead="ClickFlow - Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-6">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <div className="mb-6">
            <h1 className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-lg">
              Dashboard
            </h1>
          </div>

          {/* Thống kê tổng quan cho dòng tiền - MỚI */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-[#0088FE] p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tổng nạp</p>
                  <p className="text-lg font-bold">
                    {formatYAxis(totalDeposit)}
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-[#00C49F] p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Tổng rút</p>
                  <p className="text-lg font-bold">
                    {formatYAxis(totalWithdraw)}
                  </p>
                </div>
                <TrendingDown className="h-6 w-6 opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-[#FFBB28] p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Dòng tiền ròng</p>
                  <p className="text-lg font-bold">{formatYAxis(netFlow)}</p>
                </div>
                <DollarSign className="h-6 w-6 opacity-80" />
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-[#AA66CC] p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Số dư hiện tại</p>
                  <p className="text-lg font-bold">
                    {formatYAxis(currentBalance)}
                  </p>
                </div>
                <Calendar className="h-6 w-6 opacity-80" />
              </div>
            </motion.div>
          </div>

          {/* Biểu đồ về số tiền chuyển đổi */}
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Biểu đồ tròn: tiền chuyển đổi theo chiến dịch */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                Tiền chuyển đổi theo chiến dịch
              </h2>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conversionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      label
                      paddingAngle={3}
                    >
                      {conversionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Biểu đồ dòng tiền CẢI TIẾN */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">
                  Biểu đồ dòng tiền chi tiết
                </h2>

                {/* Nút chuyển đổi loại chart */}
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setChartType('area')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      chartType === 'area'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Vùng
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      chartType === 'bar'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Cột
                  </button>
                  <button
                    onClick={() => setChartType('composed')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      chartType === 'composed'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Kết hợp
                  </button>
                </div>
              </div>

              <div className="flex h-80 items-center rounded-xl bg-[#f5f3ff] p-4 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart
                      data={moneyChartData}
                      margin={{ top: 24, right: 32, left: 8, bottom: 8 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorDeposit"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLOR_DEPOSIT}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLOR_DEPOSIT}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorWithdraw"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLOR_WITHDRAW}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLOR_WITHDRAW}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorBalance"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLOR_BALANCE}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLOR_BALANCE}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                      <XAxis
                        dataKey="time"
                        stroke="#8B5CF6"
                        fontSize={13}
                        tick={{ fill: '#8B5CF6', fontWeight: 600 }}
                        height={40}
                      />
                      <YAxis
                        stroke="#8B5CF6"
                        fontSize={13}
                        tick={{ fill: '#8B5CF6', fontWeight: 600 }}
                        tickFormatter={formatYAxis}
                        width={70}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                          stroke: '#8B5CF6',
                          strokeWidth: 1,
                          opacity: 0.2
                        }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontWeight: 700, fontSize: 14 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="deposit"
                        stackId="1"
                        stroke={COLOR_DEPOSIT}
                        fillOpacity={0.6}
                        fill="url(#colorDeposit)"
                        name="Nạp tiền"
                        dot={{
                          r: 4,
                          fill: COLOR_DEPOSIT,
                          stroke: '#fff',
                          strokeWidth: 1.5
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="withdraw"
                        stackId="2"
                        stroke={COLOR_WITHDRAW}
                        fillOpacity={0.3}
                        fill="url(#colorWithdraw)"
                        name="Rút tiền"
                        dot={{
                          r: 4,
                          fill: COLOR_WITHDRAW,
                          stroke: '#fff',
                          strokeWidth: 1.5
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke={COLOR_BALANCE}
                        strokeWidth={6}
                        fillOpacity={0.18}
                        fill="url(#colorBalance)"
                        name="Số dư"
                        dot={{
                          r: 6,
                          fill: COLOR_BALANCE,
                          stroke: '#fff',
                          strokeWidth: 2
                        }}
                      />
                    </AreaChart>
                  ) : chartType === 'bar' ? (
                    <BarChart
                      data={moneyChartData}
                      margin={{ top: 24, right: 32, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                      <XAxis
                        dataKey="time"
                        stroke="#8B5CF6"
                        fontSize={13}
                        tick={{ fill: '#8B5CF6', fontWeight: 600 }}
                        height={40}
                      />
                      <YAxis
                        stroke="#8B5CF6"
                        fontSize={13}
                        tick={{ fill: '#8B5CF6', fontWeight: 600 }}
                        tickFormatter={formatYAxis}
                        width={70}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#ede9fe' }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontWeight: 700, fontSize: 14 }}
                      />
                      <Bar
                        dataKey="deposit"
                        fill={COLOR_DEPOSIT}
                        name="Nạp tiền"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="withdraw"
                        fill={COLOR_WITHDRAW}
                        name="Rút tiền"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="balance"
                        fill={COLOR_BALANCE}
                        name="Số dư"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <ComposedChart
                      data={moneyChartData}
                      margin={{ top: 24, right: 32, left: 8, bottom: 8 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorBalanceComposed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLOR_BALANCE}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLOR_BALANCE}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                      <XAxis
                        dataKey="time"
                        stroke="#8B5CF6"
                        fontSize={13}
                        tick={{ fill: '#8B5CF6', fontWeight: 600 }}
                        height={40}
                      />
                      <YAxis
                        stroke="#8B5CF6"
                        fontSize={13}
                        tick={{ fill: '#8B5CF6', fontWeight: 600 }}
                        tickFormatter={formatYAxis}
                        width={70}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: '#ede9fe' }}
                      />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontWeight: 700, fontSize: 14 }}
                      />
                      <Bar
                        dataKey="deposit"
                        fill={COLOR_DEPOSIT}
                        name="Nạp tiền"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="withdraw"
                        fill={COLOR_WITHDRAW}
                        name="Rút tiền"
                        radius={[4, 4, 0, 0]}
                      />
                      {/* Chỉ giữ lại 1 mô tả Số dư: Line */}
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke={COLOR_BALANCE}
                        strokeWidth={6}
                        dot={{
                          r: 6,
                          fill: COLOR_BALANCE,
                          stroke: '#fff',
                          strokeWidth: 2
                        }}
                        name="Số dư"
                      />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Bảng thông tin */}
          <div className="mb-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Bảng Trình duyệt */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                Trình duyệt phổ biến
              </h2>
              {browserStatsLoading ? (
                <div>Đang tải...</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2">Trình duyệt</th>
                      <th className="py-2">Click</th>
                      <th className="py-2">Tỉ lệ click</th>
                    </tr>
                  </thead>
                  <tbody>
                    {browserData.map((browser, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                      >
                        <td className="py-2">{browser.browser}</td>
                        <td className="py-2">{browser.clickCount}</td>
                        <td className="py-2">
                          {totalBrowserClicks > 0
                            ? (
                                (browser.clickCount / totalBrowserClicks) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>

            {/* Bảng Nền tảng thiết bị */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                Nền tảng thiết bị
              </h2>
              {deviceStatsLoading ? (
                <div>Đang tải...</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2">Thiết bị</th>
                      <th className="py-2">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devicePlatforms.map((device, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                      >
                        <td className="py-2">{device.deviceType}</td>
                        <td className="py-2">{device.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          </div>
        </motion.div>
        {/* Thêm padding dưới để tránh bị che bởi footer/fab */}
        <div className="pb-24" />
      </div>
    </BasePages>
  );
};

export default PublisherDashboard;
