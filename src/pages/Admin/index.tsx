import React from 'react';
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

const AdminDashboard: React.FC = () => {
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

  return (
    <div className="mb-10 p-4">
      {/* 4 ô thống kê (canh đều) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Doanh thu tháng này */}
        <div className="rounded bg-[#24A503] p-4 text-center text-white">
          <h2 className="text-2xl font-bold">385.4tr</h2>
          <p>Doanh thu tháng này</p>
        </div>

        {/* Số chiến dịch trong tháng qua */}
        <div className="rounded bg-[#F6B93B] p-4 text-center text-white">
          <h2 className="text-2xl font-bold">88</h2>
          <p>Số chiến dịch trong tháng qua</p>
        </div>

        {/* Tổng số report chưa xử lý */}
        <div className="rounded bg-[#E45959] p-4 text-center text-white">
          <h2 className="text-2xl font-bold">44</h2>
          <p>Tổng số report chưa xử lý</p>
        </div>

        {/* Chiến dịch mới */}
        <div className="rounded bg-[#1959AD] p-4 text-center text-white">
          <h2 className="text-2xl font-bold">38</h2>
          <p>Chiến dịch mới</p>
        </div>
      </div>

      {/* Tiêu đề trung tâm */}
      <h2 className="mb-4 text-center text-xl font-semibold">
        Truy cập nhanh bằng thông tin
      </h2>

      {/* 4 nút truy cập nhanh (canh đều) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Thêm mới chiến dịch
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Chiến dịch gần hết hạn
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Danh sách chiến dịch
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Báo cáo
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
  );
};

export default AdminDashboard;
