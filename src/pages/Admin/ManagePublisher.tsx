import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { showToast } from '@/utils/toastUtils';
import {
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';
import BasePages from '@/components/shared/base-pages';
import { useGetUsersByRole, useUpdateUserStatus } from '@/queries/user.query';
import { ApiResponse, PagingResponse, Publisher } from '@/types';
import { PublisherDetailModal } from './PublisherDetailModal';

// Updated interface to match actual API response
interface ApiUserResponse {
  id: number;
  fullName: string;
  role: string;
  isDeleted: boolean;
  email: string;
}

// Updated mapping function to match actual API response
function mapApiUserToPublisher(apiUser: ApiUserResponse): Publisher {
  const isBlocked = apiUser.isDeleted || false;

  const mapped = {
    id: apiUser.id,
    code: `PL${apiUser.id}`,
    name: apiUser.fullName,
    phone: '', // API doesn't provide phone, set as empty
    userName: '', // API doesn't provide userName, set as empty
    email: apiUser.email,
    status: isBlocked ? 'Bị khóa' : 'Hoạt động',
    isBlocked: isBlocked
  };

  return mapped;
}

const PublisherList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [dataSource, setDataSource] = useState<Publisher[]>([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );

  // Get pagination parameters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Use query with pagination parameters
  const { data, isLoading, error } = useGetUsersByRole(
    'Publisher',
    page,
    limit
  );
  const updateUserStatusMutation = useUpdateUserStatus();

  // Calculate total pages from API response
  const pageCount = data?.result?.totalPages || 1;

  useEffect(() => {
    if (data?.result) {
      // Updated to use the correct type
      const mapped = (
        data as ApiResponse<PagingResponse<ApiUserResponse>>
      ).result?.datas.map((user: ApiUserResponse) =>
        mapApiUserToPublisher(user)
      );
      setDataSource(mapped ?? []);
    }
  }, [data]);

  const handleView = (record: Publisher) => {
    setSelectedId(record.id);
    setIsViewModalVisible(true);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedId(null);
  };

  const handleLockUnlock = (record: Publisher) => {
    setSelectedPublisher(record);
    setIsLockModalVisible(true);
  };

  const confirmLockUnlock = async () => {
    if (selectedPublisher && selectedPublisher.id) {
      try {
        const newBlockedStatus = !selectedPublisher.isBlocked;

        await updateUserStatusMutation.mutateAsync({
          userId: selectedPublisher.id,
          isBlocked: newBlockedStatus
        });

        // Update local state
        setDataSource((prev) =>
          prev.map((item) =>
            item.id === selectedPublisher.id
              ? {
                  ...item,
                  status: newBlockedStatus ? 'Bị khóa' : 'Hoạt động',
                  isBlocked: newBlockedStatus
                }
              : item
          )
        );

        showToast.success(
          `${newBlockedStatus ? 'Khóa' : 'Mở khóa'} nhà tiếp thị thành công!`
        );
      } catch (error) {
        showToast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
      }
    }
    setIsLockModalVisible(false);
    setSelectedPublisher(null);
  };

  const cancelLockUnlock = () => {
    setIsLockModalVisible(false);
    setSelectedPublisher(null);
  };

  const columns = useMemo<ColumnDef<Publisher>[]>(
    () => [
      {
        id: 'stt',
        header: () => <div className="w-full text-center">STT</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>
      },
      { accessorKey: 'name', header: 'TÊN NHÀ TIẾP THỊ' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) =>
          row.original.status === 'Hoạt động' ? (
            <span className="font-semibold" style={{ color: '#16A34A' }}>
              {row.original.status}
            </span>
          ) : (
            <span className="font-semibold" style={{ color: '#DC0E0E' }}>
              {row.original.status}
            </span>
          )
      },
      {
        id: 'action',
        header: () => <div className="w-full text-center">HÀNH ĐỘNG</div>,
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              <EyeOutlined
                onClick={() => handleView(record)}
                className="cursor-pointer rounded-full p-1 text-xl transition-colors"
                style={{
                  color: '#1570EF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1570EF';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#1570EF';
                }}
              />
              {record.isBlocked ? (
                <CheckCircleOutlined
                  onClick={() => handleLockUnlock(record)}
                  className="cursor-pointer rounded-full p-1 text-xl transition-colors"
                  style={{
                    color: '#16A34A'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#16A34A';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#16A34A';
                  }}
                />
              ) : (
                <CloseCircleOutlined
                  onClick={() => handleLockUnlock(record)}
                  className="cursor-pointer rounded-full p-1 text-xl transition-colors"
                  style={{
                    color: '#DC0E0E'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC0E0E';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#DC0E0E';
                  }}
                />
              )}
            </div>
          );
        }
      }
    ],
    []
  );

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Nhà tiếp thị ">
        <div className="p-4">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Nhà tiếp thị ">
        <div className="p-4">Đã có lỗi xảy ra khi tải dữ liệu!</div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Nhà tiếp thị ">
      <div className="mb-10 p-4">
        <h2 className="mb-4 text-xl font-semibold">Nhà tiếp thị</h2>

        <DataTable
          columns={columns}
          data={dataSource}
          pageCount={pageCount}
          pageSizeOptions={[10, 20, 30, 40, 50]}
        />

        {/* Modal xem chi tiết */}
        <PublisherDetailModal
          open={isViewModalVisible}
          onClose={closeViewModal}
          publisherId={selectedId}
        />

        {/* Modal khóa/mở khóa */}
        <Modal
          title={
            selectedPublisher?.isBlocked ? 'Xác nhận mở khóa' : 'Xác nhận khóa'
          }
          open={isLockModalVisible}
          onOk={confirmLockUnlock}
          onCancel={cancelLockUnlock}
          okText="Xác nhận"
          cancelText="Hủy"
          confirmLoading={updateUserStatusMutation.isPending}
          okButtonProps={{
            style: {
              backgroundColor: '#1570EF',
              color: 'white',
              border: 'none'
            }
          }}
          cancelButtonProps={{
            style: {
              color: '#DC0E0E',
              borderColor: '#DC0E0E'
            }
          }}
        >
          <p>
            Bạn có chắc chắn muốn{' '}
            {selectedPublisher?.isBlocked ? 'mở khóa' : 'khóa'} nhà tiếp thị{' '}
            <strong>{selectedPublisher?.name}</strong> không?
          </p>
        </Modal>
      </div>
    </BasePages>
  );
};

export default PublisherList;
