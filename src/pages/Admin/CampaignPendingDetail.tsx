import React from 'react';
import { Modal, Divider } from 'antd';
import {
  Calendar,
  Target,
  DollarSign,
  Globe,
  Star,
  User,
  Building2
} from 'lucide-react';
import { useGetCampaignById } from '@/queries/campaign.query';
import Loading from '@/components/ui/loading';
import { ApiResponse, CampaignApiResponse } from '@/types';

interface CampaignPendingDetailProps {
  campaignId: number | null;
  visible: boolean;
  onClose: () => void;
}

const CampaignPendingDetail: React.FC<CampaignPendingDetailProps> = ({
  campaignId,
  visible,
  onClose
}) => {
  const { data, isLoading, error } = useGetCampaignById(
    campaignId || undefined
  );

  const campaign = (data as ApiResponse<CampaignApiResponse>)?.result;

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
      case 'Pending':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  if (isLoading) {
    return (
      <Modal
        title="Chi tiết chiến dịch"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        centered
      >
        <div className="flex items-center justify-center py-12">
          <Loading />
        </div>
      </Modal>
    );
  }

  if (error || !campaign) {
    return (
      <Modal
        title="Chi tiết chiến dịch"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        centered
      >
        <div className="py-8 text-center" style={{ color: '#dc2626' }}>
          <p className="font-medium">Không thể tải chi tiết chiến dịch!</p>
          <p className="mt-1 text-sm">Vui lòng thử lại sau.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div
            className="rounded-full p-2"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <Target className="h-5 w-5" style={{ color: '#6b7280' }} />
          </div>
          <span style={{ color: '#111827' }}>Chi tiết chiến dịch</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <div className="py-4">
        {/* Campaign Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-3 text-xl font-bold" style={{ color: '#111827' }}>
              {campaign.name}
            </h2>

            <div className="mb-4 flex items-center gap-4">
              <span
                className="rounded-full px-3 py-1 text-sm font-medium"
                style={getStatusColor(campaign.status)}
              >
                Chờ duyệt
              </span>

              {campaign.averageStarRate && (
                <div className="flex items-center gap-1">
                  <Star
                    className="h-4 w-4"
                    style={{ color: '#f59e0b' }}
                    fill="currentColor"
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#111827' }}
                  >
                    {campaign.averageStarRate.toFixed(1)}
                  </span>
                </div>
              )}

              <div
                className="flex items-center gap-1 text-sm"
                style={{ color: '#6b7280' }}
              >
                <Calendar className="h-4 w-4" />
                <span>ID: #{campaign.id}</span>
              </div>
            </div>

            {/* Campaign Duration */}
            <div
              className="rounded-lg border p-4"
              style={{
                backgroundColor: '#f9fafb',
                borderColor: '#e5e7eb'
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: '#6b7280' }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: '#374151' }}
                >
                  Thời gian chiến dịch
                </span>
              </div>
              <div className="text-sm" style={{ color: '#111827' }}>
                <span className="font-medium">
                  {formatDate(campaign.startDate)}
                </span>
                <span className="mx-2" style={{ color: '#9ca3af' }}>
                  →
                </span>
                <span className="font-medium">
                  {formatDate(campaign.endDate)}
                </span>
              </div>
              <div className="mt-1 text-xs" style={{ color: '#6b7280' }}>
                {(() => {
                  const start = new Date(campaign.startDate);
                  const end = new Date(campaign.endDate);
                  const days = Math.ceil(
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return `Thời gian diễn ra: ${days} ngày`;
                })()}
              </div>
            </div>
          </div>

          {campaign.image && (
            <div className="ml-6 flex-shrink-0">
              <img
                src={campaign.image}
                alt={campaign.name}
                className="h-24 w-24 rounded-lg border object-cover shadow-sm"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          )}
        </div>

        <Divider style={{ margin: '20px 0', borderColor: '#e5e7eb' }} />

        {/* Campaign Description */}
        <div className="mb-6">
          <h3
            className="mb-3 text-base font-semibold"
            style={{ color: '#111827' }}
          >
            Mô tả chiến dịch
          </h3>
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb',
              color: '#374151'
            }}
          >
            {campaign.description}
          </div>
        </div>

        {/* Main Information Grid */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {/* Budget & Commission */}
          <div
            className="rounded-lg border p-5"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb'
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <DollarSign className="h-5 w-5" style={{ color: '#6b7280' }} />
              <h4 className="font-semibold" style={{ color: '#111827' }}>
                Ngân sách & Hoa hồng
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#6b7280' }}>
                    Tổng ngân sách
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: '#059669' }}
                  >
                    {formatCurrency(campaign.budget)}
                  </span>
                </div>
              </div>

              <Divider style={{ margin: '12px 0', borderColor: '#f3f4f6' }} />

              <div className="space-y-2">
                {campaign.commission && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#6b7280' }}>
                      Hoa hồng{' '}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: '#111827' }}
                    >
                      {formatCurrency(campaign.commission)}
                    </span>
                  </div>
                )}
                {campaign.percents && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#6b7280' }}>
                      Phần trăm hoa hồng
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: '#111827' }}
                    >
                      {campaign.percents}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campaign & Advertiser Info */}
          <div
            className="rounded-lg border p-5"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#e5e7eb'
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Building2 className="h-5 w-5" style={{ color: '#6b7280' }} />
              <h4 className="font-semibold" style={{ color: '#111827' }}>
                Thông tin chiến dịch
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#6b7280' }}>
                    Loại thanh toán
                  </span>
                  <span className="font-medium" style={{ color: '#111827' }}>
                    {campaign.typePay}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#6b7280' }}>
                    Loại chiến dịch
                  </span>
                  <span className="font-medium" style={{ color: '#111827' }}>
                    {campaign.typeCampaign}
                  </span>
                </div>
              </div>

              {campaign.advertiser && (
                <>
                  <Divider
                    style={{ margin: '12px 0', borderColor: '#f3f4f6' }}
                  />
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" style={{ color: '#6b7280' }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: '#374151' }}
                      >
                        Nhà quảng cáo
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: '#111827' }}
                        >
                          {campaign.advertiser.companyName}
                        </p>
                        <p className="text-sm" style={{ color: '#6b7280' }}>
                          {campaign.advertiser.staffSize} nhân viên •{' '}
                          {campaign.advertiser.industry}
                        </p>
                      </div>
                      {campaign.advertiser.introductionWebsite && (
                        <a
                          href={campaign.advertiser.introductionWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: '#2563eb' }}
                        >
                          {campaign.advertiser.introductionWebsite}
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Origin URL */}
        {campaign.originURL && (
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: '#f9fafb',
              borderColor: '#e5e7eb'
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" style={{ color: '#6b7280' }} />
              <span
                className="text-sm font-medium"
                style={{ color: '#374151' }}
              >
                Liên kết gốc
              </span>
            </div>
            <a
              href={campaign.originURL}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm hover:underline"
              style={{ color: '#2563eb' }}
            >
              {campaign.originURL}
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CampaignPendingDetail;
