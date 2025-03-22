import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
// Import 2 hook dưới:
import { useGetUsersByRole } from '@/queries/user.query';

interface Advertiser {
  id: number;
  code: number;
  name: string;
  phone: string;
  userName: string;
  email: string;
  /** Bỏ createdAt nếu không cần nữa */
  // createdAt: string;
  company: string;
  business: string;
  status: string;
}

function mapApiUserToAdvertiser(apiUser: any): Advertiser {
  return {
    id: apiUser.id,
    code: apiUser.id, // Tùy bạn format "ADSxxx" nếu muốn
    name: apiUser.fullName ?? 'No name',
    phone: apiUser.phone ?? '',
    userName: apiUser.userName ?? '',
    email: apiUser.email ?? '',
    // company -> Lấy từ apiUser.advertiser.companyName
    company: apiUser.advertiser?.companyName ?? '',
    // business -> Lĩnh vực kinh doanh (nếu backend có)
    business: apiUser.advertiser?.businessArea ?? '',
    // status
    status: apiUser.isDeleted ? 'Bị khóa' : 'Hoạt động'
  };
}

const AdvertiserList: React.FC = () => {
  // State chứa danh sách advertiser
  const [dataSource, setDataSource] = useState<Advertiser[]>([]);

  // Modal "Xem chi tiết"
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  // Lưu ID advertiser đang xem để gọi API chi tiết
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal "Khóa/Mở khóa"
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<Advertiser | null>(null);

  // 1) Gọi API lấy user role = "Advertiser", page=1, size=10
  const { data, isLoading, error } = useGetUsersByRole('Advertiser', 1, 10);

  // 2) Mỗi khi data?.result thay đổi, map sang Advertiser[]
  useEffect(() => {
    if (data?.result) {
      const mapped = data.result.map((user: any) =>
        mapApiUserToAdvertiser(user)
      );
      setDataSource(mapped);
    }
  }, [data]);

  // 3) "Xem chi tiết"
  const handleView = (record: Advertiser) => {
    setSelectedId(record.id);
    setIsViewModalVisible(true);
  };
  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedId(null);
  };

  // 4) "Khóa/Mở khóa"
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

  // Định nghĩa cột cho DataTable
  const columns = useMemo<ColumnDef<Advertiser>[]>(
    () => [
      { accessorKey: 'code', header: 'MÃ' },
      { accessorKey: 'name', header: 'TÊN NHÀ QUẢNG CÁO' },
      // BỎ cột { accessorKey: 'createdAt', header: 'NGÀY TẠO' },
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
        header: 'HÀNH ĐỘNG',
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              {/* Nút Xem chi tiết */}
              <EyeOutlined
                onClick={() => handleView(record)}
                className="cursor-pointer rounded-full p-1 text-xl text-[#1570EF] transition-colors hover:bg-[#1570EF] hover:text-white"
              />
              {/* Nút Khóa/Mở khóa */}
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

  // Xử lý trạng thái loading / error
  if (isLoading) {
    return <div>Đang tải danh sách nhà quảng cáo...</div>;
  }
  if (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu!</div>;
  }

  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Nhà quảng cáo</h2>

      {/* DataTable hiển thị advertisers */}
      <DataTable
        columns={columns}
        data={dataSource}
        pageCount={-1}
        pageSizeOptions={[10, 20, 50, 100]}
        showAdd={false}
      />

      {/* Modal "Xem chi tiết" */}
      {/* <AdvertiserDetailModal
        open={isViewModalVisible}
        onClose={closeViewModal}
        advertiserId={selectedId}
      /> */}

      {/* Modal "Khóa/Mở khóa" */}
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
          {selectedAdvertiser?.status === 'Hoạt động' ? 'khóa' : 'mở khóa'} nhà
          quảng cáo <strong>{selectedAdvertiser?.name}</strong> không?
        </p>
      </Modal>
    </div>
  );
};

export default AdvertiserList;
