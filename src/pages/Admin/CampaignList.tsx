import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { showToast } from '@/utils/toastUtils';
import {
  EyeOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  useGetCampaignListExcpPending,
  useUpdateCampaignStatus
} from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';
import __helpers from '@/helpers';
import BasePages from '@/components/shared/base-pages';

const CampaignList: React.FC = () => {
  const [dataSource, setDataSource] = useState<CampaignApiResponse[]>([]);
  const [paginationData, setPaginationData] =
    useState<PagingResponse<CampaignApiResponse> | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignApiResponse | null>(null);
  const [actionType, setActionType] = useState<'pause' | 'resume'>('pause');
  const navigate = useNavigate();
  const { pageIndex, pageSize } = __helpers.usePaginationParams();

  const { data, isLoading, error, isSuccess, refetch } =
    useGetCampaignListExcpPending(pageIndex, pageSize);

  const updateCampaignStatusMutation = useUpdateCampaignStatus();

  useEffect(() => {
    if (isSuccess && data) {
      const response = data as ApiResponse<PagingResponse<CampaignApiResponse>>;
      const paginationResult = response.result;

      if (paginationResult) {
        setDataSource(paginationResult.datas ?? []);
        setPaginationData(paginationResult);
      }
    }
  }, [data, isSuccess]);

  const handleView = useCallback(
    (record: CampaignApiResponse) => {
      navigate(`/admin/campaign-detail/${record.id}`);
    },
    [navigate]
  );

  const handleToggleStatus = useCallback((record: CampaignApiResponse) => {
    const isPaused = record.status === 'Paused';
    setSelectedCampaign(record);
    setActionType(isPaused ? 'resume' : 'pause');
    setIsModalVisible(true);
  }, []);

  const handleConfirmStatusChange = async () => {
    if (!selectedCampaign) return;

    const newStatus = actionType === 'pause' ? 'Paused' : 'Activing';

    try {
      await updateCampaignStatusMutation.mutateAsync({
        id: selectedCampaign.id,
        status: newStatus
      });

      showToast.success(
        actionType === 'pause'
          ? 'Đã tạm dừng chiến dịch thành công!'
          : 'Đã kích hoạt lại chiến dịch thành công!'
      );

      // Refresh data
      refetch();
    } catch (error) {
      showToast.error('Có lỗi xảy ra khi cập nhật trạng thái chiến dịch!');
      console.error('Error updating campaign status:', error);
    } finally {
      setIsModalVisible(false);
      setSelectedCampaign(null);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    // Add 7 hours to convert UTC to Vietnam time
    const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toLocaleDateString('vi-VN');
  };

  const columns = useMemo<ColumnDef<CampaignApiResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'TÊN CHIẾN DỊCH',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image && (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-medium" style={{ color: '#111827' }}>
                {row.original.name}
              </p>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                ID: #{row.original.id}
              </p>
            </div>
          </div>
        )
      },
      {
        accessorKey: 'startDate',
        header: 'NGÀY TẠO',
        cell: ({ row }) => formatDate(row.original.startDate)
      },
      {
        accessorKey: 'endDate',
        header: 'NGÀY KẾT THÚC',
        cell: ({ row }) => formatDate(row.original.endDate)
      },
      {
        accessorKey: 'advertiser.companyName',
        header: 'NHÀ QUẢNG CÁO',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.advertiser?.companyName || 'N/A'}
            </p>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              {row.original.advertiser?.industry || ''}
            </p>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => {
          const status = row.original.status;
          const getStatusStyle = () => {
            switch (status) {
              case 'Hoạt động':
              case 'Activing':
                return { backgroundColor: '#dcfce7', color: '#15803d' };
              case 'Paused':
                return { backgroundColor: '#fed7aa', color: '#9a3412' };
              case 'Chờ duyệt':
              case 'Pending':
                return { backgroundColor: '#fef3c7', color: '#92400e' };
              case 'Bị từ chối':
              case 'Rejected':
                return { backgroundColor: '#fee2e2', color: '#991b1b' };
              default:
                return { backgroundColor: '#f3f4f6', color: '#1f2937' };
            }
          };

          const getStatusText = () => {
            switch (status) {
              case 'Activing':
                return 'Hoạt động';
              case 'Paused':
                return 'Tạm dừng';
              case 'Pending':
                return 'Chờ duyệt';
              case 'Rejected':
                return 'Bị từ chối';
              default:
                return status;
            }
          };

          return (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={getStatusStyle()}
            >
              {getStatusText()}
            </span>
          );
        }
      },
      {
        id: 'actions',
        header: () => <div className="w-full text-center">HÀNH ĐỘNG</div>,
        cell: ({ row }) => {
          const record = row.original;
          const isPaused = record.status === 'Paused';

          return (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleView(record)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#2563eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bfdbfe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe';
                }}
                title="Xem chi tiết"
              >
                <EyeOutlined className="text-sm" />
              </button>

              <button
                onClick={() => handleToggleStatus(record)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: isPaused ? '#dcfce7' : '#fed7aa',
                  color: isPaused ? '#16a34a' : '#ea580c'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isPaused
                    ? '#bbf7d0'
                    : '#fdba74';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isPaused
                    ? '#dcfce7'
                    : '#fed7aa';
                }}
                title={
                  isPaused ? 'Kích hoạt lại chiến dịch' : 'Tạm dừng chiến dịch'
                }
                disabled={updateCampaignStatusMutation.isPending}
              >
                {isPaused ? (
                  <PlayCircleOutlined className="text-sm" />
                ) : (
                  <CloseCircleOutlined className="text-sm" />
                )}
              </button>
            </div>
          );
        }
      }
    ],
    [handleView, handleToggleStatus, updateCampaignStatusMutation.isPending]
  );

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
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
    <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
      <div className="min-h-screen p-6" style={{ backgroundColor: '#f9fafb' }}>
        <div className="w-full">
          {/* Data Table */}
          <div
            className="rounded-lg shadow-sm"
            style={{ backgroundColor: '#ffffff' }}
          >
            <DataTable
              columns={columns}
              data={dataSource}
              pageCount={paginationData?.totalPages || 1}
              pageSizeOptions={[10, 20, 50, 100]}
              heightTable="80dvh"
              isLoading={isLoading}
              onRefresh={refetch}
            />
          </div>

          {/* Status Change Confirmation Modal */}
          <Modal
            title={
              actionType === 'pause'
                ? 'Tạm dừng chiến dịch'
                : 'Kích hoạt chiến dịch'
            }
            open={isModalVisible}
            onOk={handleConfirmStatusChange}
            onCancel={() => setIsModalVisible(false)}
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={updateCampaignStatusMutation.isPending}
            okButtonProps={{
              style: {
                backgroundColor: actionType === 'pause' ? '#ea580c' : '#16a34a',
                borderColor: actionType === 'pause' ? '#ea580c' : '#16a34a',
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
            {selectedCampaign && (
              <div className="py-4">
                <p style={{ color: '#374151' }}>
                  Bạn có chắc muốn{' '}
                  <span
                    className="font-semibold"
                    style={{
                      color: actionType === 'pause' ? '#ea580c' : '#16a34a'
                    }}
                  >
                    {actionType === 'pause' ? 'tạm dừng' : 'kích hoạt lại'}
                  </span>{' '}
                  chiến dịch
                </p>
                <p className="mt-2 font-medium" style={{ color: '#111827' }}>
                  "{selectedCampaign.name}"
                </p>
                <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>
                  {actionType === 'pause'
                    ? 'Chiến dịch sẽ tạm dừng và không hiển thị cho publishers.'
                    : 'Chiến dịch sẽ được kích hoạt lại và hiển thị cho publishers.'}
                </p>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </BasePages>
  );
};

export default CampaignList;
