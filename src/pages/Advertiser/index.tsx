import React, { useState } from 'react';
import { FaClock, FaTimesCircle, FaPause, FaCheckCircle } from 'react-icons/fa';
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
  Legend
} from 'recharts';
import CreateNewCampaign from './CreateNewCampaign';
import CampaignRequest from './CampaignRequest';
import { useGetUserDetail } from '@/queries/user.query';
import { useGetOwnTransaction } from '@/queries/transaction.query';
import { TokenDecoded } from '@/types';
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
  const { data } = useGetUserDetail(advertiserId);
  const user = data?.result;

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

  // Lấy dữ liệu ví và giao dịch cho biểu đồ
  const { data: transactionData } = useGetOwnTransaction(1, 50);

  // Tạo dữ liệu cho biểu đồ trạng thái campaign
  const campaignStatusData = [
    { name: 'Cần phê duyệt', value: pendingCount ?? 0, fill: '#3b82f6' },
    { name: 'Đã từ chối', value: rejectedCount ?? 0, fill: '#ef4444' },
    { name: 'Tạm dừng', value: canceledCount ?? 0, fill: '#f97316' },
    { name: 'Hoàn thành', value: completedCount ?? 0, fill: '#22c55e' }
  ];

  // Tạo dữ liệu cho biểu đồ giao dịch theo tháng
  const monthlyTransactionData = React.useMemo(() => {
    if (!transactionData?.result?.datas) return [];

    const monthlyData = {};
    transactionData.result.datas.forEach((transaction) => {
      const date = new Date(transaction.paymentDate);
      const monthKey = `Th${date.getMonth() + 1}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, deposit: 0, withdraw: 0 };
      }

      if (transaction.transactionType === 'Deposit') {
        monthlyData[monthKey].deposit += transaction.amount / 1000000;
      } else if (transaction.transactionType === 'Withdraw') {
        monthlyData[monthKey].withdraw += transaction.amount / 1000000;
      }
    });

    return Object.values(monthlyData);
  }, [transactionData]);

  return (
    <BasePages pageHead="ClickFlow - Tổng quan ">
      <div className="min-h-screen">
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
              className="transform rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
              className="transform rounded-xl p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                {isPendingLoading ? '...' : pendingCount ?? 0}
              </p>
            </div>

            {/* Đã từ chối (Rejected) */}
            <div
              className="transform rounded-xl p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(to bottom right, #dc2626, #ef4444)'
              }}
            >
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
            <div
              className="transform rounded-xl p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(to bottom right, #ea580c, #f97316)'
              }}
            >
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
            <div
              className="transform rounded-xl p-6 text-center text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(to bottom right, #16a34a, #22c55e)'
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
                {isCompletedLoading ? '...' : completedCount ?? 0}
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
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ giao dịch theo tháng */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Giao dịch theo tháng (triệu VNĐ)
              </h3>
              <div className="h-64">
                {monthlyTransactionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTransactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="deposit"
                        stroke="#22c55e"
                        strokeWidth={3}
                        name="Nạp tiền"
                      />
                      <Line
                        type="monotone"
                        dataKey="withdraw"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="Rút tiền"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu giao dịch</p>
                  </div>
                )}
              </div>
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
        />
      </div>
    </BasePages>
  );
};

export default AdvertiserDashboard;
