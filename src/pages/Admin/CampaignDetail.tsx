import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Target,
  DollarSign,
  Globe,
  Star
} from 'lucide-react';
import { useGetCampaignDetail } from '@/queries/campaign.query';
import Loading from '@/components/ui/loading';
import BasePages from '@/components/shared/base-pages';
import PublisherListCampaign from './PublisherListCampaign';
import { ApiResponse, CampaignApiResponse } from '@/types';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const campaignId = id ? parseInt(id) : undefined;

  const { data, isLoading, error } = useGetCampaignDetail(campaignId);

  const campaign = (data as ApiResponse<CampaignApiResponse>)?.result;

  const handleBack = () => {
    navigate('/admin/campaignlist?page=1&limit=10');
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    // Add 7 hours to convert UTC to Vietnam time
    const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động':
      case 'Activing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Chờ duyệt':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Bị từ chối':
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Chi tiết chiến dịch">
        <Loading />
      </BasePages>
    );
  }

  if (error || !campaign) {
    return (
      <BasePages pageHead="ClickFlow - Chi tiết chiến dịch">
        <div className="p-6">
          <div className="text-center text-red-600">
            Đã có lỗi xảy ra khi tải chi tiết chiến dịch!
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Chi tiết chiến dịch">
      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slide-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-gentle { animation: bounce-gentle 2s infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s infinite; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
      `}</style>
      <div className="animate-slide-up min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="w-full px-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex transform items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-600 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
            >
              <ArrowLeft
                size={20}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-600">
              Chi tiết chiến dịch
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Campaign Info Card */}
              <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900 transition-colors duration-200 hover:text-blue-600">
                      {campaign.name}
                    </h2>
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 ${getStatusColor(campaign.status)}`}
                      >
                        {campaign.status}
                      </span>
                      {campaign.averageStarRate && (
                        <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 transition-colors duration-200 hover:bg-yellow-100">
                          <Star className="animate-pulse-soft h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-sm font-medium">
                            {campaign.averageStarRate.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Thêm thời gian chiến dịch */}
                    <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3 transition-colors duration-200 hover:bg-blue-100">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Thời gian:</span>
                      </div>
                      <div className="mt-1 text-sm text-blue-600">
                        <span className="font-medium">
                          {formatDate(campaign.startDate)}
                        </span>
                        <span className="mx-2 text-blue-400">→</span>
                        <span className="font-medium">
                          {formatDate(campaign.endDate)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-blue-500">
                        {(() => {
                          const start = new Date(campaign.startDate);
                          const end = new Date(campaign.endDate);
                          const days = Math.ceil(
                            (end.getTime() - start.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          return `Thời gian diễn ra: ${days} ngày`;
                        })()}
                      </div>
                    </div>
                  </div>
                  {campaign.image && (
                    <div className="ml-4 flex-shrink-0">
                      <img
                        src={campaign.image}
                        alt={campaign.name}
                        className="h-20 w-20 transform rounded-lg object-cover shadow-md transition-all duration-300 hover:rotate-2 hover:scale-110 hover:shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                      Mô tả
                    </h3>
                    <p className="rounded-lg bg-gray-50 p-4 leading-relaxed text-gray-700 transition-colors duration-200 hover:bg-gray-100">
                      {campaign.description}
                    </p>
                  </div>

                  <div className="group">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                      Liên kết gốc
                    </h3>
                    <a
                      href={campaign.originURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex transform items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-600 transition-all duration-200 hover:scale-105 hover:bg-blue-100 hover:text-blue-800"
                    >
                      <Globe size={16} className="animate-spin-slow" />
                      {campaign.originURL}
                    </a>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="transform rounded-xl border-l-4 border-blue-400 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 transition-colors duration-200 hover:bg-blue-200">
                      <DollarSign className="animate-bounce-gentle h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-blue-600">
                      Ngân sách
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-blue-50 p-3 transition-colors duration-200 hover:bg-blue-100">
                      <p className="text-sm text-blue-600">Tổng ngân sách</p>
                      <p className="text-xl font-bold text-blue-900 transition-transform duration-200 hover:scale-105">
                        {formatCurrency(campaign.budget)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 transition-colors duration-200 hover:bg-green-100">
                      <p className="text-sm text-green-600">
                        Ngân sách còn lại
                      </p>
                      <p className="text-lg font-semibold text-green-700 transition-transform duration-200 hover:scale-105">
                        {formatCurrency(campaign.remainingBudget)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="transform rounded-xl border-l-4 border-green-400 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2 transition-colors duration-200 hover:bg-green-200">
                      <Target className="animate-pulse-soft h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-green-600">
                      Hoa hồng
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {campaign.commission && (
                      <div className="rounded-lg bg-orange-50 p-3 transition-colors duration-200 hover:bg-orange-100">
                        <p className="text-sm text-orange-600">
                          Hoa hồng cố định
                        </p>
                        <p className="text-xl font-bold text-orange-900 transition-transform duration-200 hover:scale-105">
                          {formatCurrency(campaign.commission)}
                        </p>
                      </div>
                    )}
                    {campaign.percents && (
                      <div className="rounded-lg bg-purple-50 p-3 transition-colors duration-200 hover:bg-purple-100">
                        <p className="text-sm text-purple-600">
                          Phần trăm hoa hồng
                        </p>
                        <p className="text-lg font-semibold text-purple-700 transition-transform duration-200 hover:scale-105">
                          {campaign.percents}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Campaign Types */}
              <div className="transform rounded-xl border-l-4 border-purple-400 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-purple-600">
                  Thông tin chiến dịch
                </h3>
                <div className="space-y-4">
                  <div className="group rounded-lg bg-purple-50 p-3 transition-colors duration-200 hover:bg-purple-100">
                    <p className="text-sm text-purple-600 group-hover:text-purple-700">
                      Loại thanh toán
                    </p>
                    <p className="text-base font-medium text-purple-900 transition-transform duration-200 group-hover:scale-105">
                      {campaign.typePay}
                    </p>
                  </div>
                  <div className="group rounded-lg bg-indigo-50 p-3 transition-colors duration-200 hover:bg-indigo-100">
                    <p className="text-sm text-indigo-600 group-hover:text-indigo-700">
                      Loại chiến dịch
                    </p>
                    <p className="text-base font-medium text-indigo-900 transition-transform duration-200 group-hover:scale-105">
                      {campaign.typeCampaign}
                    </p>
                  </div>
                  <div className="group rounded-lg bg-pink-50 p-3 transition-colors duration-200 hover:bg-pink-100">
                    <p className="text-sm text-pink-600 group-hover:text-pink-700">
                      ID chiến dịch
                    </p>
                    <p className="font-mono text-base text-pink-900 transition-transform duration-200 hover:scale-105">
                      #{campaign.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advertiser Info */}
              {campaign.advertiser && (
                <div className="transform rounded-xl border-l-4 border-orange-400 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-orange-600">
                    Thông tin nhà quảng cáo
                  </h3>
                  <div className="space-y-4">
                    <div className="group rounded-lg bg-orange-50 p-3 transition-colors duration-200 hover:bg-orange-100">
                      <p className="text-sm text-orange-600 group-hover:text-orange-700">
                        Tên công ty
                      </p>
                      <p className="text-base font-medium text-orange-900 transition-transform duration-200 group-hover:scale-105">
                        {campaign.advertiser.companyName}
                      </p>
                    </div>
                    <div className="group rounded-lg bg-cyan-50 p-3 transition-colors duration-200 hover:bg-cyan-100">
                      <p className="text-sm text-cyan-600 group-hover:text-cyan-700">
                        Website
                      </p>
                      <a
                        href={campaign.advertiser.introductionWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-cyan-700 transition-all duration-200 hover:text-cyan-900 hover:underline group-hover:scale-105"
                      >
                        {campaign.advertiser.introductionWebsite}
                      </a>
                    </div>
                    <div className="group rounded-lg bg-teal-50 p-3 transition-colors duration-200 hover:bg-teal-100">
                      <p className="text-sm text-teal-600 group-hover:text-teal-700">
                        Quy mô nhân sự
                      </p>
                      <p className="text-base font-medium text-teal-900 transition-transform duration-200 group-hover:scale-105">
                        {campaign.advertiser.staffSize} nhân viên
                      </p>
                    </div>
                    <div className="group rounded-lg bg-emerald-50 p-3 transition-colors duration-200 hover:bg-emerald-100">
                      <p className="text-sm text-emerald-600 group-hover:text-emerald-700">
                        Ngành nghề
                      </p>
                      <span className="inline-block rounded-full bg-emerald-200 px-2 py-1 text-sm font-medium text-emerald-800 transition-transform duration-200 group-hover:scale-105">
                        {campaign.advertiser.industry}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Publishers List Section - Full Width */}
          <div className="mt-8">
            <PublisherListCampaign campaignId={campaign.id} />
          </div>
        </div>
      </div>
    </BasePages>
  );
};

export default CampaignDetail;
