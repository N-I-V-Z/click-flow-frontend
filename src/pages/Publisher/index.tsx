import React from 'react';
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Header: Chọn ngày, chiến dịch và nút tìm kiếm */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded bg-white p-4 shadow">
        <label className="text-sm font-medium" htmlFor="date-range">
          So sánh với
        </label>
        <input
          id="date-range"
          type="text"
          placeholder="15/02/2025 đến 15/02/2025"
          className="focus:ring-blue-400 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
        />
        <select className="focus:ring-blue-400 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2">
          <option>Chiến dịch</option>
          <option>Chiến dịch 1</option>
          <option>Chiến dịch 2</option>
        </select>
        <TableSearchInput />
      </div>

      {/* Thẻ thống kê */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <span className="text-sm text-gray-500">Tổng số click</span>
          <div className="mt-2 text-3xl font-bold text-gray-800">
            {stats.totalClicks}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <span className="text-sm text-gray-500">Tổng click chờ xong</span>
          <div className="mt-2 text-3xl font-bold text-gray-800">
            {stats.totalClicksCompleted}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <span className="text-sm text-gray-500">Người dùng hoạt động</span>
          <div className="mt-2 text-3xl font-bold text-gray-800">
            {stats.activeUsers}
          </div>
        </div>
      </div>

      {/* Biểu đồ với dữ liệu mẫu */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-medium text-gray-600">Clicks</span>
          <span className="text-sm text-gray-400">08:00 - 18:00</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bảng: Trình duyệt và Nền tảng thiết bị */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Trình duyệt phổ biến */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-gray-700">
            Trình duyệt phổ biến
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Trình duyệt</th>
                <th className="py-2">Click</th>
                <th className="py-2">Tỉ lệ click</th>
              </tr>
            </thead>
            <tbody>
              {browserData.map((browser, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{browser.name}</td>
                  <td className="py-2">{browser.clicks}</td>
                  <td className="py-2">
                    {totalBrowserClicks > 0
                      ? ((browser.clicks / totalBrowserClicks) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nền tảng thiết bị */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 font-semibold text-gray-700">
            Nền tảng thiết bị
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Thiết bị</th>
                <th className="py-2">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {devicePlatforms.map((device, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{device.platform}</td>
                  <td className="py-2">{device.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;
