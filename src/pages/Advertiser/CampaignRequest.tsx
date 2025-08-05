import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Modal, Badge } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import BasePages from '@/components/shared/base-pages';
import { ColumnDef } from '@tanstack/react-table';
import {
  useGetPublisherParticipationByStatusForAdvertiser,
  useUpdateParticipationStatus
} from '@/queries/campaign.query';
import { CampaignParticipationApiResponse } from '@/types';
import __helpers from '@/helpers';

function formatDate(dateString?: string | Date): string {
  if (!dateString) return '';

  // Handle both string and Date types
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return '';

  // Add 7 hours to convert UTC to Vietnam time
  const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const day = vietnamTime.getDate().toString().padStart(2, '0');
  const month = (vietnamTime.getMonth() + 1).toString().padStart(2, '0');
  const year = vietnamTime.getFullYear();
  return `${day}/${month}/${year}`;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    Pending: {
      color: '#fbbf24',
      bgColor: '#fef3c7',
      borderColor: '#fde68a',
      text: 'Đang chờ'
    },
    Participated: {
      color: '#10b981',
      bgColor: '#d1fae5',
      borderColor: '#a7f3d0',
      text: 'Đã tham gia'
    },
    Rejected: {
      color: '#ef4444',
      bgColor: '#fee2e2',
      borderColor: '#fecaca',
      text: 'Đã từ chối'
    }
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <Badge
      count={config.text}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`
      }}
    />
  );
};

const AttractivePublisherParticipationRequest: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<
    CampaignParticipationApiResponse['campaign'] | null
  >(null);
  const [keyWord, setKeyWord] = useState<string>('');
  const { pageIndex, pageSize } = __helpers.usePaginationParams();

  const {
    data: participations,
    isLoading,
    error,
    refetch
  } = useGetPublisherParticipationByStatusForAdvertiser(
    pageIndex,
    pageSize,
    'Pending'
  );

  useEffect(() => {
    refetch();
  }, [keyWord, refetch]);

  const updateParticipationStatusMutation = useUpdateParticipationStatus();

  const handleAccept = useCallback(
    async (item: CampaignParticipationApiResponse) => {
      try {
        await updateParticipationStatusMutation.mutateAsync({
          publisherId: item.publisherId || 0,
          campaignParticipationId: item.id,
          newStatus: 'Participated'
        });
        showToast.success('Đã duyệt yêu cầu tham gia thành công!');
        refetch();
      } catch (error) {
        showToast.error('Có lỗi xảy ra khi duyệt yêu cầu!');
        console.error('Accept participation error:', error);
      }
    },
    [updateParticipationStatusMutation, refetch]
  );

  const handleReject = useCallback(
    async (item: CampaignParticipationApiResponse) => {
      try {
        await updateParticipationStatusMutation.mutateAsync({
          publisherId: item.publisherId || 0,
          campaignParticipationId: item.id,
          newStatus: 'Rejected'
        });
        showToast.success('Đã từ chối yêu cầu thành công!');
        refetch();
      } catch (error) {
        showToast.error('Có lỗi xảy ra khi từ chối yêu cầu!');
        console.error('Reject participation error:', error);
      }
    },
    [updateParticipationStatusMutation, refetch]
  );

  const openModal = useCallback(
    (campaign: CampaignParticipationApiResponse['campaign']) => {
      setSelectedCampaign(campaign);
      setIsModalVisible(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setSelectedCampaign(null);
    setIsModalVisible(false);
  }, []);

  const columns = useMemo<ColumnDef<CampaignParticipationApiResponse>[]>(
    () => [
      {
        id: 'stt',
        header: () => (
          <div className="text-center font-semibold text-gray-700">STT</div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={row.index + 1}
              style={{
                backgroundColor: '#f0f9ff',
                color: '#0284c7',
                border: '1px solid #e0f2fe'
              }}
            />
          </div>
        ),
        size: 60
      },
      {
        accessorKey: 'publisher.applicationUser.fullName',
        header: () => (
          <div className="font-semibold text-gray-700">PUBLISHER</div>
        ),
        cell: ({ row }) => {
          const publisherName =
            row.original?.publisher?.applicationUser?.fullName || '-';
          return (
            <div className="max-w-xs">
              <p
                className="truncate font-medium text-gray-900"
                title={publisherName}
              >
                {publisherName}
              </p>
            </div>
          );
        }
      },
      {
        accessorKey: 'campaign.name',
        header: () => (
          <div className="font-semibold text-gray-700">CHIẾN DỊCH</div>
        ),
        cell: ({ row }) => {
          const campaignName = row.original?.campaign?.name || '-';
          return (
            <div className="max-w-xs">
              <p
                className="truncate font-medium text-gray-900"
                title={campaignName}
              >
                {campaignName}
              </p>
              <p className="text-sm text-gray-500">
                {row.original?.campaign?.typeCampaign || 'Chưa xác định'}
              </p>
            </div>
          );
        }
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="text-center font-semibold text-gray-700">
            TRẠNG THÁI
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {getStatusBadge(row.original?.status || 'Pending')}
          </div>
        ),
        size: 120
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="font-semibold text-gray-700">NGÀY TẠO</div>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="text-gray-900">
              {formatDate(row.original?.createAt)}
            </div>
          </div>
        ),
        size: 120
      },
      {
        accessorKey: 'campaign.budget',
        header: () => (
          <div className="text-right font-semibold text-gray-700">
            NGÂN SÁCH
          </div>
        ),
        cell: ({ row }) => {
          const budget = row.original?.campaign?.budget;
          return (
            <div className="text-center">
              <span className="font-semibold text-green-600">
                {budget
                  ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(budget)
                  : '-'}
              </span>
            </div>
          );
        },
        size: 140
      },
      {
        id: 'actions',
        header: () => (
          <div className="ml-4 text-center font-semibold text-gray-700">
            THAO TÁC
          </div>
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => item?.campaign && openModal(item.campaign)}
                className="rounded-full bg-blue-50 p-2 text-blue-500 transition-colors duration-200 hover:bg-blue-100"
                title="Xem chi tiết"
              >
                <EyeOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleAccept(item)}
                className="rounded-full bg-green-50 p-2 text-green-600 transition-colors duration-200 hover:bg-green-100"
                title="Duyệt yêu cầu"
              >
                <CheckOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleReject(item)}
                className="rounded-full bg-red-50 p-2 text-red-500 transition-colors duration-200 hover:bg-red-100"
                title="Từ chối yêu cầu"
              >
                <CloseOutlined className="text-sm" />
              </button>
            </div>
          );
        },
        size: 140
      }
    ],
    [handleAccept, handleReject, openModal]
  );

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Yêu cầu tham gia Publisher">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Oops! Có lỗi xảy ra
            </h3>
            <p className="text-gray-600">
              Không thể tải dữ liệu yêu cầu tham gia. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Yêu cầu tham gia Publisher">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl py-2 sm:px-6 lg:px-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-10 py-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Yêu cầu tham gia từ Publisher
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({participations?.result?.totalItems} yêu cầu)
                  </span>
                </h2>
              </div>
            </div>

            <div className="-mb-10 p-8">
              <DataTable
                columns={columns}
                data={participations?.result?.datas ?? []}
                pageCount={participations?.result?.totalPages ?? 0}
                isLoading={isLoading}
                onSearchChange={setKeyWord}
                onRefresh={refetch}
              />
            </div>
          </div>
        </div>

        {/* Campaign Detail Modal */}
        <Modal
          title={null}
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={900}
          className="campaign-detail-modal top-10"
          styles={{
            body: { padding: 0 },
            header: { display: 'none' }
          }}
        >
          {selectedCampaign && (
            <div className="relative max-h-[85vh] bg-white">
              {/* Clean Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Chi tiết chiến dịch
                  </h1>
                  <p className="text-sm text-gray-500">
                    {selectedCampaign.name || 'Untitled Campaign'}
                  </p>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Campaign Header Section */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-6">
                  <div className="flex items-start space-x-14">
                    {/* Campaign Image */}
                    <div className="flex-shrink-0">
                      <div className="w-70 h-32 overflow-hidden rounded-lg border border-gray-200 bg-white">
                        {selectedCampaign.image ? (
                          <img
                            src={selectedCampaign.image}
                            alt={selectedCampaign.name || 'Campaign'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            <EyeOutlined className="text-xl" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="min-w-0 flex-1">
                      <h2 className="mb-2 text-lg font-medium text-gray-900">
                        {selectedCampaign.name || 'Untitled Campaign'}
                      </h2>
                      {selectedCampaign.description && (
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                          {selectedCampaign.description}
                        </p>
                      )}

                      {/* Quick Stats Row */}
                      <div className="flex space-x-6">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Ngân sách
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedCampaign.budget
                              ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(selectedCampaign.budget)
                              : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Trạng thái
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedCampaign.status || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Đánh giá
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedCampaign.averageStarRate
                              ? `${selectedCampaign.averageStarRate} ⭐`
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-4 text-sm font-medium text-gray-900">
                          Thông tin chiến dịch
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between border-b border-gray-100 py-2">
                            <span className="text-sm text-gray-600">
                              Loại chiến dịch
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedCampaign.typeCampaign || '-'}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-2">
                            <span className="text-sm text-gray-600">
                              Loại thanh toán
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedCampaign.typePay || '-'}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-2">
                            <span className="text-sm text-gray-600">
                              Ngày bắt đầu
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(selectedCampaign.startDate)}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-100 py-2">
                            <span className="text-sm text-gray-600">
                              Ngày kết thúc
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(selectedCampaign.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-4 text-sm font-medium text-gray-900">
                          Thông tin hoa hồng
                        </h3>
                        <div className="rounded-lg bg-gray-50 p-4">
                          <div className="text-center">
                            <div className="mb-1 text-2xl font-bold text-gray-900">
                              {selectedCampaign.commission
                                ? new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }).format(selectedCampaign.commission)
                                : '-'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Hoa hồng (
                              {selectedCampaign.percents
                                ? `${selectedCampaign.percents}%`
                                : '0%'}
                              )
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedCampaign.originURL && (
                        <div>
                          <h3 className="mb-4 text-sm font-medium text-gray-900">
                            Liên kết
                          </h3>
                          <div className="rounded-lg border border-gray-200 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs uppercase tracking-wide text-gray-500">
                                URL gốc
                              </span>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    selectedCampaign.originURL || ''
                                  )
                                }
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Copy
                              </button>
                            </div>
                            <p className="mt-1 break-all text-sm text-gray-900">
                              {selectedCampaign.originURL}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </BasePages>
  );
};

export default AttractivePublisherParticipationRequest;
