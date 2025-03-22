import React, { useState } from 'react';
import { FaClock, FaTimesCircle, FaPause, FaCheckCircle } from 'react-icons/fa';
import CreateNewCampaign from './CreateNewCampaign';
import CampaignRequest from './CampaignRequest';
import { useGetUserDetail } from '@/queries/user.query';

const AdvertiserDashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Gọi API lấy thông tin người dùng (chỉ lấy fullName)
  const { data, isLoading } = useGetUserDetail(1);
  const user = data?.result;

  // Nếu đang loading hoặc có lỗi, có thể hiển thị fallback cho tên
  const greetingName = user?.fullName || (isLoading ? '...' : 'User');

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="bg-transparent px-10 py-5">
        <div className="text-center text-white">
          <h1 className="mb-0 text-3xl font-bold text-[#DD83E0]">
            Xin chào, {greetingName}
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
            className="rounded bg-[#ff7f50] px-4 py-2 text-white"
          >
            Tạo mới chiến dịch
          </button>
        </div>

        {/* Các thẻ thống kê trạng thái chiến dịch */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Cần phê duyệt */}
          <div className="rounded-xl bg-blue p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaClock size={30} />
            <h4 className="my-2 text-xl font-bold text-white">Cần phê duyệt</h4>
            <p className="text-2xl font-bold">0</p>
          </div>

          {/* Đã từ chối */}
          <div className="rounded-xl bg-[#E54646] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaTimesCircle size={30} />
            <h4 className="my-2 text-xl font-bold text-white">Đã từ chối</h4>
            <p className="text-2xl font-bold">0</p>
          </div>

          {/* Tạm dừng */}
          <div className="rounded-xl bg-[#EC870E] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaPause size={30} />
            <h4 className="my-2 text-xl font-bold text-white">Tạm dừng</h4>
            <p className="text-2xl font-bold">0</p>
          </div>

          {/* Đã hoàn thành */}
          <div className="rounded-xl bg-[#00AE72] p-5 text-center text-white backdrop-blur hover:shadow-lg">
            <FaCheckCircle size={30} />
            <h4 className="my-2 text-xl font-bold text-white">Đã hoàn thành</h4>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Phần hiển thị yêu cầu hoặc chi tiết chiến dịch */}
        <div className="mt-10">
          <CampaignRequest />
        </div>
      </main>

      {/* Modal tạo chiến dịch */}
      <CreateNewCampaign
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreate={(values: boolean) => {
          console.log('Dữ liệu chiến dịch:', values);
          setIsModalVisible(false);
        }}
      />
    </div>
  );
};

export default AdvertiserDashboard;
