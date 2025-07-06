import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { showToast } from '@/utils/toastUtils';
import {
  EyeOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';
import Loading from '@/components/ui/loading';
import { useGetUsersByRole, useUpdateUserStatus } from '@/queries/user.query';
import { ApiResponse, PagingResponse } from '@/types';
import DataTable from '@/components/shared/data-table';
import BasePages from '@/components/shared/base-pages';
import { AdvertiserDetailModal } from './AdvertiserDetailModal';

interface Advertiser {
  id: number;
  code: number;
  name: string;
  phone: string;
  userName: string;
  email: string;
  company: string;
  business: string;
  status: string;
  isBlocked: boolean;
}

// Updated interface to match actual API response
interface ApiUserResponse {
  id: number;
  fullName: string;
  role: string;
  isDeleted: boolean;
  email: string;
  // Add advertiser info if available in actual API
  advertiser?: {
    id?: number;
    companyName?: string;
    industry?: string;
    businessArea?: string;
  };
}

function mapApiUserToAdvertiser(apiUser: ApiUserResponse): Advertiser {
  const isBlocked = apiUser.isDeleted || false;

  const mapped = {
    id: apiUser.id,
    code: apiUser.id,
    name: apiUser.fullName,
    phone: '', // API doesn't provide phone, set as empty
    userName: '', // API doesn't provide userName, set as empty
    email: apiUser.email,
    company: apiUser.advertiser?.companyName ?? '',
    business:
      apiUser.advertiser?.industry ?? apiUser.advertiser?.businessArea ?? '',
    status: isBlocked ? 'Bị khóa' : 'Hoạt động',
    isBlocked: isBlocked
  };

  return mapped;
}

const AdvertiserList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [dataSource, setDataSource] = useState<Advertiser[]>([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<Advertiser | null>(null);

  // Get pagination parameters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Use query with pagination parameters
  const { data, isLoading, error } = useGetUsersByRole(
    'Advertiser',
    page,
    limit
  );
  const updateUserStatusMutation = useUpdateUserStatus();

  // Calculate total pages from API response
  const pageCount = data?.result?.totalPages || 1;

  useEffect(() => {
    if (data?.result) {
      const mapped = (
        data as ApiResponse<PagingResponse<ApiUserResponse>>
      ).result?.datas.map((user: ApiUserResponse) =>
        mapApiUserToAdvertiser(user)
      );
      setDataSource(mapped ?? []);
    }
  }, [data]);

  const handleView = (record: Advertiser) => {
    setSelectedId(record.id);
    setIsViewModalVisible(true);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedId(null);
  };

  const handleLockUnlock = (record: Advertiser) => {
    setSelectedAdvertiser(record);
    setIsLockModalVisible(true);
  };

  const confirmLockUnlock = async () => {
    if (selectedAdvertiser && selectedAdvertiser.id) {
      try {
        const newBlockedStatus = !selectedAdvertiser.isBlocked;

        await updateUserStatusMutation.mutateAsync({
          userId: selectedAdvertiser.id,
          isBlocked: newBlockedStatus
        });

        // Update local state
        setDataSource((prev) =>
          prev.map((item) =>
            item.id === selectedAdvertiser.id
              ? {
                  ...item,
                  status: newBlockedStatus ? 'Bị khóa' : 'Hoạt động',
                  isBlocked: newBlockedStatus
                }
              : item
          )
        );

        showToast.success(
          `${newBlockedStatus ? 'Khóa' : 'Mở khóa'} nhà quảng cáo thành công!`
        );
      } catch (error) {
        showToast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
        console.error('Error updating user status:', error);
      }
    }
    setIsLockModalVisible(false);
    setSelectedAdvertiser(null);
  };

  const cancelLockUnlock = () => {
    setIsLockModalVisible(false);
    setSelectedAdvertiser(null);
  };

  const columns = useMemo<ColumnDef<Advertiser>[]>(
    () => [
      {
        id: 'stt',
        header: () => <div className="w-full text-center">STT</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>
      },
      { accessorKey: 'name', header: 'TÊN NHÀ QUẢNG CÁO' },
      { accessorKey: 'company', header: 'TÊN CÔNG TY' },
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
      <BasePages pageHead="ClickFlow - Nhà quảng cáo ">
        <div className="w-full px-6 py-8">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Nhà quảng cáo ">
        <div className="w-full px-6 py-8">
          Đã có lỗi xảy ra khi tải dữ liệu!
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Nhà quảng cáo ">
      <div className="w-full px-6 py-8">
        <h2 className="mb-4 text-xl font-semibold">Nhà quảng cáo</h2>

        <DataTable
          columns={columns}
          data={dataSource}
          pageCount={pageCount}
          pageSizeOptions={[10, 20, 50, 100]}
        />

        {/* Modal xem chi tiết */}
        <AdvertiserDetailModal
          open={isViewModalVisible}
          onClose={closeViewModal}
          advertiserId={selectedId}
        />

        {/* Modal khóa/mở khóa */}
        <Modal
          title={
            selectedAdvertiser?.isBlocked ? 'Xác nhận mở khóa' : 'Xác nhận khóa'
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
            {selectedAdvertiser?.isBlocked ? 'mở khóa' : 'khóa'} nhà quảng cáo{' '}
            <strong>{selectedAdvertiser?.name}</strong> không?
          </p>
        </Modal>
      </div>
    </BasePages>
  );
};

export default AdvertiserList;
