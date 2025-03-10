import React from 'react';
import { motion } from 'framer-motion';
import TableSearchInput from '@/components/shared/table-search-input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PublisherDashboard: React.FC = () => {
  // Dữ liệu mẫu cho thống kê
  const stats = {
    totalClicks: 1200,
    totalClicksCompleted: 950,
    activeUsers: 300
  };

  // Dữ liệu mẫu cho trình duyệt
  const browserData = [
    { name: 'Chrome', clicks: 800 },
    { name: 'Firefox', clicks: 200 },
    { name: 'Safari', clicks: 150 },
    { name: 'Edge', clicks: 50 }
  ];
  const totalBrowserClicks = browserData.reduce(
    (acc, browser) => acc + browser.clicks,
    0
  );

  // Dữ liệu mẫu cho nền tảng thiết bị
  const devicePlatforms = [
    { platform: 'Máy tính', count: 700 },
    { platform: 'Điện thoại', count: 400 },
    { platform: 'Máy tính bảng', count: 100 }
  ];

  // Dữ liệu mẫu cho biểu đồ
  const chartData = [
    { time: '08:00', clicks: 100 },
    { time: '09:00', clicks: 200 },
    { time: '10:00', clicks: 150 },
    { time: '11:00', clicks: 300 },
    { time: '12:00', clicks: 250 },
    { time: '13:00', clicks: 400 },
    { time: '14:00', clicks: 350 },
    { time: '15:00', clicks: 450 },
    { time: '16:00', clicks: 500 },
    { time: '17:00', clicks: 550 },
    { time: '18:00', clicks: 600 }
  ];

  // Animation variants dùng cho framer-motion
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <div className="mb-6">
          <h1 className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-lg">
            Dashboard
          </h1>
        </div>

        {/* Header: Chọn ngày, chiến dịch và tìm kiếm */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-6 flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-2xl transition-transform duration-300 hover:scale-105"
        >
          <label
            className="text-sm font-medium text-gray-600"
            htmlFor="date-range"
          >
            So sánh với
          </label>
          <input
            id="date-range"
            type="text"
            placeholder="15/02/2025 đến 15/02/2025"
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>Chiến dịch</option>
            <option>Chiến dịch 1</option>
            <option>Chiến dịch 2</option>
          </select>
          <TableSearchInput />
        </motion.div>

        {/* Thẻ thống kê */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: 'Tổng số click', value: stats.totalClicks },
            { title: 'Tổng click chờ xong', value: stats.totalClicksCompleted },
            { title: 'Người dùng hoạt động', value: stats.activeUsers }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <span className="text-sm text-gray-500">{stat.title}</span>
              <div className="mt-2 text-3xl font-bold text-gray-800">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Biểu đồ */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-6 rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-gray-600">Clicks</span>
            <span className="text-sm text-gray-400">08:00 - 18:00</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#ff6b81"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bảng thông tin */}
        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    <td className="py-2">{browser.name}</td>
                    <td className="py-2">{browser.clicks}</td>
                    <td className="py-2">
                      {totalBrowserClicks > 0
                        ? ((browser.clicks / totalBrowserClicks) * 100).toFixed(
                            1
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    <td className="py-2">{device.platform}</td>
                    <td className="py-2">{device.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublisherDashboard;
