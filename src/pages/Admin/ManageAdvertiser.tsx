import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
import Loading from '@/components/ui/loading';
import { useGetUsersByRole } from '@/queries/user.query';
import {
  ApiResponse,
  ApplicationUserApiResponse,
  PagingResponse
} from '@/types';
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
}

// Temporary type để avoid lỗi any
interface TempApiUser {
  id?: number;
  userId?: number;
  applicationUserId?: number;
  fullName?: string;
  phoneNumber?: string;
  phone?: string;
  userName?: string;
  email?: string;
  isDeleted?: boolean;
  advertiser?: {
    id?: number;
    companyName?: string;
    industry?: string;
    businessArea?: string;
  };
  // Allow additional properties
}

// Sửa type cho function parameter
function mapApiUserToAdvertiser(apiUser: TempApiUser): Advertiser {
  // Try to find ID in different possible fields

  const userId =
    apiUser.id ||
    apiUser.userId ||
    apiUser.applicationUserId ||
    apiUser.advertiser?.id;

  const mapped = {
    id: userId || 0, // Fallback to 0 if no ID found
    code: userId || 0,
    name: apiUser.fullName ?? 'No name',
    phone: apiUser.phoneNumber ?? apiUser.phone ?? '',
    userName: apiUser.userName ?? '',
    email: apiUser.email ?? '',
    company: apiUser.advertiser?.companyName ?? '',
    business:
      apiUser.advertiser?.industry ?? apiUser.advertiser?.businessArea ?? '',
    status: apiUser.isDeleted ? 'Bị khóa' : 'Hoạt động'
  };

  return mapped;
}

const AdvertiserList: React.FC = () => {
  const [dataSource, setDataSource] = useState<Advertiser[]>([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<Advertiser | null>(null);

  const { data, isLoading, error } = useGetUsersByRole('Advertiser', 1, 10);

  useEffect(() => {
    if (data?.result) {
      const mapped = (
        data as ApiResponse<PagingResponse<ApplicationUserApiResponse>>
      ).result?.datas.map((user: ApplicationUserApiResponse) =>
        mapApiUserToAdvertiser(user)
      );
      setDataSource(mapped ?? []);
    }
  }, [data]);
  // console.log(data);

  const handleView = (record: Advertiser) => {
    setSelectedId(record.id); // Ensure this is a number
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

  const confirmLockUnlock = () => {
    if (selectedAdvertiser) {
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === selectedAdvertiser.id
            ? {
                ...item,
                status: item.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động'
              }
            : item
        )
      );
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
            <span className="font-semibold text-green-600">
              {row.original.status}
            </span>
          ) : (
            <span className="font-semibold text-[#DC0E0E]">
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
                className="cursor-pointer rounded-full p-1 text-xl text-[#1570EF] transition-colors hover:bg-[#1570EF] hover:text-white"
              />
              <CloseCircleOutlined
                onClick={() => handleLockUnlock(record)}
                className="cursor-pointer rounded-full p-1 text-xl text-[#DC0E0E] transition-colors hover:bg-[#DC0E0E] hover:text-white"
              />
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
        <div className="p-4">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Nhà quảng cáo ">
        <div className="p-4">Đã có lỗi xảy ra khi tải dữ liệu!</div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Nhà quảng cáo ">
      <div className="mb-10 p-4">
        <h2 className="mb-4 text-xl font-semibold">Nhà quảng cáo</h2>

        <DataTable
          columns={columns}
          data={dataSource}
          pageCount={-1}
          pageSizeOptions={[10, 20, 50, 100]}
          showAdd={false}
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
            selectedAdvertiser?.status === 'Hoạt động'
              ? 'Xác nhận khóa'
              : 'Xác nhận mở khóa'
          }
          open={isLockModalVisible}
          onOk={confirmLockUnlock}
          onCancel={cancelLockUnlock}
          okText="Xác nhận"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-[#1570EF] text-white border-none'
          }}
          cancelButtonProps={{
            className: 'text-[#DC0E0E] border-[#DC0E0E] hover:text-white'
          }}
        >
          <p>
            Bạn có chắc chắn muốn{' '}
            {selectedAdvertiser?.status === 'Hoạt động' ? 'khóa' : 'mở khóa'}{' '}
            nhà quảng cáo <strong>{selectedAdvertiser?.name}</strong> không?
          </p>
        </Modal>
      </div>
    </BasePages>
  );
};

export default AdvertiserList;
