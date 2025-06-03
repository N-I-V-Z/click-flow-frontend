import React, { useState } from 'react';
import { FaClock, FaTimesCircle, FaPause, FaCheckCircle } from 'react-icons/fa';
import CreateNewCampaign from './CreateNewCampaign';
import CampaignRequest from './CampaignRequest';
import { useGetUserDetail } from '@/queries/user.query';
import { ApiResponse, UserDetailApiResponse, TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';

import { useGetCampaignCountByAdvertiser } from '@/queries/campaign.query';
import { useGetCampaignParticipationCountByStatusForAdvertiser } from '@/queries/campaign.query';
import BasePages from '@/components/shared/base-pages';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const advertiserId =
  decodedToken?.Id !== undefined ? parseInt(decodedToken.Id) : 0;

const AdvertiserDashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data, isLoading } = useGetUserDetail(1);
  const user = (data as ApiResponse<UserDetailApiResponse>)?.result;
  const greetingName = user?.fullName || (isLoading ? '...' : 'User');

  // Gọi API đếm số lượng campaign cho 2 trạng thái: Canceled & Completed
  const { data: canceledCount, isLoading: isCanceledLoading } =
    useGetCampaignCountByAdvertiser(advertiserId, 'Canceled');

  const { data: completedCount, isLoading: isCompletedLoading } =
    useGetCampaignCountByAdvertiser(advertiserId, 'Completed');

  // Gọi API đếm số lượng participations cho 2 trạng thái: Pending & Rejected
  const { data: pendingCount, isLoading: isPendingLoading } =
    useGetCampaignParticipationCountByStatusForAdvertiser('Pending');

  const { data: rejectedCount, isLoading: isRejectedLoading } =
    useGetCampaignParticipationCountByStatusForAdvertiser('Rejected');

  return (
    <BasePages pageHead="ClickFlow - Tổng quan ">
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
              className="hover:from-orange-600 hover:to-red-600 transform rounded-lg bg-gradient-to-r from-orange to-red px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              ✨ Tạo mới chiến dịch
            </button>
          </div>

          {/* Các thẻ thống kê trạng thái chiến dịch */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* Cần phê duyệt (Pending) */}
            <div className="transform rounded-xl bg-gradient-to-br from-blue to-blue p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaClock size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">
                Cần phê duyệt
              </h4>
              <p className="text-3xl font-bold">
                {isPendingLoading ? '...' : pendingCount ?? 0}
              </p>
            </div>

            {/* Đã từ chối (Rejected) */}
            <div className="transform rounded-xl bg-gradient-to-br from-red to-red p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaTimesCircle size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">Đã từ chối</h4>
              <p className="text-3xl font-bold">
                {isRejectedLoading ? '...' : rejectedCount ?? 0}
              </p>
            </div>

            {/* Tạm dừng (Canceled) */}
            <div className="transform rounded-xl bg-gradient-to-br from-orange to-orange p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaPause size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">Tạm dừng</h4>
              <p className="text-3xl font-bold">
                {isCanceledLoading ? '...' : canceledCount ?? 0}
              </p>
            </div>

            {/* Đã hoàn thành (Completed) */}
            <div className="transform rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-3">
                  <FaCheckCircle size={32} />
                </div>
              </div>
              <h4 className="mb-2 text-lg font-bold text-white">
                Đã hoàn thành
              </h4>
              <p className="text-3xl font-bold">
                {isCompletedLoading ? '...' : completedCount ?? 0}
              </p>
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
            setIsModalVisible(false);
          }}
        />
      </div>
    </BasePages>
  );
};

export default AdvertiserDashboard;
