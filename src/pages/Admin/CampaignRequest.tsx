import React, { useState, useMemo } from 'react';
import { Modal, notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
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

const CampaignRequest: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetCampaign('Pending', 1, 10);
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
        header: 'NGÀY TẠO'
      },
      {
        accessorKey: 'endAt',
        header: 'NGÀY KẾT THÚC'
      },
      {
        accessorKey: 'advertiser',
        header: 'NHÀ QUẢNG CÁO'
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => (
          <span className="font-semibold" style={{ color: '#ea580c' }}>
            {row.original.status === 'Pending'
              ? 'Chờ duyệt'
              : row.original.status}
          </span>
        )
      },
      {
        id: 'actions',
        header: 'HÀNH ĐỘNG',
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('accept');
                  setIsModalVisible(true);
                }}
                className="cursor-pointer rounded-full p-1 text-xl transition-colors"
                style={{ color: '#16a34a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#16a34a';
                }}
                title="Duyệt chiến dịch"
              >
                <CheckCircleOutlined />
              </button>

              <button
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('reject');
                  setIsModalVisible(true);
                }}
                className="cursor-pointer rounded-full p-1 text-xl transition-colors"
                style={{ color: '#dc2626' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#dc2626';
                }}
                title="Từ chối chiến dịch"
              >
                <CloseCircleOutlined />
              </button>

              <button
                onClick={() => handleViewDetail(record.id)}
                className="cursor-pointer rounded-full p-1 text-xl transition-colors"
                style={{ color: '#f59e0b' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#f59e0b';
                }}
                title="Xem chi tiết"
              >
                <EllipsisOutlined />
              </button>
            </div>
          );
        }
      }
    ],
    []
  );

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
        <div className="p-4">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
        <div className="p-4" style={{ color: '#dc2626' }}>
          Đã có lỗi xảy ra khi tải dữ liệu!
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
              pageCount={1}
              pageSizeOptions={[10, 20, 30, 40, 50]}
              showAdd={false}
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
                backgroundColor: '#2563eb',
                borderColor: '#2563eb',
                color: '#ffffff'
              }
            }}
            cancelButtonProps={{
              style: {
                color: '#dc2626',
                borderColor: '#dc2626'
              }
            }}
          >
            {modalAction === 'accept' && selectedCampaign && (
              <p style={{ color: '#374151' }}>
                Bạn có chắc muốn <b style={{ color: '#16a34a' }}>duyệt</b> chiến
                dịch "{selectedCampaign.name}" không?
              </p>
            )}
            {modalAction === 'reject' && selectedCampaign && (
              <p style={{ color: '#374151' }}>
                Bạn có chắc muốn <b style={{ color: '#dc2626' }}>từ chối</b>{' '}
                chiến dịch "{selectedCampaign.name}" không?
              </p>
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
