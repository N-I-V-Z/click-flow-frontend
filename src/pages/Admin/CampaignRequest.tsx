import React, { useState, useMemo } from 'react';
import { Modal, notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import CampaignPendingDetail from './CampaignPendingDetail';
import { ColumnDef } from '@tanstack/react-table';
import {
  useGetCampaign,
  useUpdateCampaignStatus
} from '@/queries/campaign.query';
import {
  ApiResponse,
  CampaignApiResponse,
  PagingResponse,
  RequestCampaignType
} from '@/types';
import BasePages from '@/components/shared/base-pages';
import __helpers from '@/helpers';

const CampaignRequest: React.FC = () => {
  const { pageIndex, pageSize } = __helpers.usePaginationParams();
  const { data, isLoading, error, refetch } = useGetCampaign(
    'Pending',
    pageIndex,
    pageSize
  );
  const rawCampaigns =
    (data as ApiResponse<PagingResponse<CampaignApiResponse>>)?.result?.datas ??
    [];
  const campaigns: RequestCampaignType[] = rawCampaigns.map(
    (item: CampaignApiResponse) => ({
      id: item.id,
      name: item.name,
      createdAt: item.startDate,
      endAt: item.endDate,
      advertiser: item.advertiser?.companyName ?? '',
      status: item.status
    })
  );

  const { mutate: updateCampaignStatus } = useUpdateCampaignStatus();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(
    null
  );
  const [selectedCampaign, setSelectedCampaign] =
    useState<RequestCampaignType | null>(null);

  // State for detail popup
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

  const handleOk = () => {
    if (selectedCampaign && modalAction) {
      const newStatus = modalAction === 'accept' ? 'Approved' : 'Canceled';
      updateCampaignStatus(
        { id: selectedCampaign.id, status: newStatus },
        {
          onSuccess: () => {
            notification.success({
              message: 'Cập nhật thành công',
              description: `Chiến dịch "${selectedCampaign.name}" đã được cập nhật thành "${newStatus}".`
            });
            refetch();
          },
          onError: (err: Error) => {
            console.error(err);
            notification.error({
              message: 'Cập nhật thất bại',
              description: `Không thể cập nhật trạng thái của "${selectedCampaign.name}".`
            });
          }
        }
      );
    }
    setIsModalVisible(false);
    setModalAction(null);
    setSelectedCampaign(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
    setSelectedCampaign(null);
  };

  const handleViewDetail = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setIsDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setSelectedCampaignId(null);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = useMemo<ColumnDef<RequestCampaignType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'TÊN CHIẾN DỊCH',
        cell: ({ row }) => (
          <div>
            <p className="font-medium" style={{ color: '#111827' }}>
              {row.original.name}
            </p>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              ID: #{row.original.id}
            </p>
          </div>
        )
      },
      {
        accessorKey: 'createdAt',
        header: 'NGÀY TẠO',
        cell: ({ row }) => formatDate(row.original.createdAt)
      },
      {
        accessorKey: 'endAt',
        header: 'NGÀY KẾT THÚC',
        cell: ({ row }) => formatDate(row.original.endAt)
      },
      {
        accessorKey: 'advertiser',
        header: 'NHÀ QUẢNG CÁO'
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
          >
            {row.original.status === 'Pending'
              ? 'Chờ duyệt'
              : row.original.status}
          </span>
        )
      },
      {
        id: 'actions',
        header: () => <div className="w-full text-center">HÀNH ĐỘNG</div>,
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('accept');
                  setIsModalVisible(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bbf7d0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dcfce7';
                }}
                title="Duyệt chiến dịch"
              >
                <CheckCircleOutlined className="text-sm" />
              </button>

              <button
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('reject');
                  setIsModalVisible(true);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fecaca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                }}
                title="Từ chối chiến dịch"
              >
                <CloseCircleOutlined className="text-sm" />
              </button>

              <button
                onClick={() => handleViewDetail(record.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fed7aa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                }}
                title="Xem chi tiết"
              >
                <EllipsisOutlined className="text-sm" />
              </button>
            </div>
          );
        }
      }
    ],
    []
  );

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
        <div className="p-6">
          <div
            className="rounded-lg p-4 text-center"
            style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
          >
            <p className="font-medium">Đã có lỗi xảy ra khi tải dữ liệu!</p>
            <p className="mt-1 text-sm">Vui lòng thử lại sau.</p>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
      <div className="min-h-screen p-6" style={{ backgroundColor: '#f9fafb' }}>
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="mb-2 text-2xl font-bold"
              style={{ color: '#111827' }}
            >
              Yêu cầu chiến dịch
            </h1>
            <p style={{ color: '#6b7280' }}>
              Quản lý và duyệt các yêu cầu chiến dịch đang chờ xử lý
            </p>
          </div>

          {/* Data Table */}
          <div
            className="rounded-lg shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <DataTable
              columns={columns}
              data={campaigns}
              pageCount={
                (data as ApiResponse<PagingResponse<CampaignApiResponse>>)
                  ?.result?.totalPages || 1
              }
              pageSizeOptions={[10, 20, 30, 40, 50]}
              heightTable="80dvh"
              isLoading={isLoading}
            />
          </div>

          {/* Approve/Reject Modal */}
          <Modal
            title={
              <span style={{ color: '#111827' }}>
                {modalAction === 'accept'
                  ? 'Duyệt chiến dịch'
                  : modalAction === 'reject'
                    ? 'Từ chối chiến dịch'
                    : ''}
              </span>
            }
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{
              style: {
                backgroundColor:
                  modalAction === 'accept' ? '#16a34a' : '#dc2626',
                borderColor: modalAction === 'accept' ? '#16a34a' : '#dc2626',
                color: '#ffffff'
              }
            }}
            cancelButtonProps={{
              style: {
                color: '#4b5563',
                borderColor: '#d1d5db'
              }
            }}
          >
            {modalAction === 'accept' && selectedCampaign && (
              <div className="py-4">
                <p style={{ color: '#374151' }}>
                  Bạn có chắc muốn{' '}
                  <span className="font-semibold" style={{ color: '#16a34a' }}>
                    duyệt
                  </span>{' '}
                  chiến dịch
                </p>
                <p className="mt-2 font-medium" style={{ color: '#111827' }}>
                  "{selectedCampaign.name}"
                </p>
                <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
                  Chiến dịch sẽ được phê duyệt và hiển thị cho publishers.
                </p>
              </div>
            )}
            {modalAction === 'reject' && selectedCampaign && (
              <div className="py-4">
                <p style={{ color: '#374151' }}>
                  Bạn có chắc muốn{' '}
                  <span className="font-semibold" style={{ color: '#dc2626' }}>
                    từ chối
                  </span>{' '}
                  chiến dịch
                </p>
                <p className="mt-2 font-medium" style={{ color: '#111827' }}>
                  "{selectedCampaign.name}"
                </p>
                <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
                  Chiến dịch sẽ bị từ chối và không hiển thị cho publishers.
                </p>
              </div>
            )}
          </Modal>

          {/* Campaign Detail Popup */}
          <CampaignPendingDetail
            campaignId={selectedCampaignId}
            visible={isDetailVisible}
            onClose={handleCloseDetail}
          />
        </div>
      </div>
    </BasePages>
  );
};

export default CampaignRequest;
