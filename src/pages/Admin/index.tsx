import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      {/* Khu vực thống kê */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="min-w-[200px] flex-1 rounded border border-green-400 bg-green-100 p-4 text-center">
          <h2 className="text-xl font-bold">385.4tr</h2>
          <p>Doanh thu tháng này</p>
        </div>
        <div className="bg-yellow-100 border-yellow-400 min-w-[200px] flex-1 rounded border p-4 text-center">
          <h2 className="text-xl font-bold">88</h2>
          <p>Số chiến dịch đang chạy</p>
        </div>
        <div className="bg-red-100 border-red-400 min-w-[200px] flex-1 rounded border p-4 text-center">
          <h2 className="text-xl font-bold">44</h2>
          <p>Tổng số report chưa xử lý</p>
        </div>
        <div className="bg-blue-100 border-blue-400 min-w-[200px] flex-1 rounded border p-4 text-center">
          <h2 className="text-xl font-bold">38</h2>
          <p>Quỹ</p>
        </div>
      </div>

      {/* Truy cập nhanh */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <button className="rounded bg-purple-600 px-4 py-2 text-white">
          Thêm mới chiến dịch
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white">
          Chiến dịch gần hết hạn
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white">
          Danh sách chiến dịch
        </button>
        <button className="rounded bg-purple-600 px-4 py-2 text-white">
          Báo cáo
        </button>
      </div>

      {/* Dashboard box */}
      <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>
      <div className="h-64 bg-gray-300" />
    </div>
  );
};

export default AdminDashboard;
