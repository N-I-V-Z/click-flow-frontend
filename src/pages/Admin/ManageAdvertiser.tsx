import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input } from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BiBuildings } from 'react-icons/bi';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';

// Import hook để lấy user theo role
import { useGetUsersByRole } from '@/queries/user.query';

/** Interface local mô tả Advertiser */
interface Advertiser {
  id: number;
  code: number; // Mã nhà quảng cáo (VD: "ADS001")
  name: string; // Tên hiển thị (fullName)
  phone: string; // Số điện thoại
  userName: string; // Tên đăng nhập
  createdAt: string;
  email: string;
  company: string;
  business: string;
  status: string; // "Hoạt động" | "Bị khóa"
}

/**
 * Hàm chuyển dữ liệu từ API -> Advertiser (UI)
 * Tuỳ thuộc server trả về trường gì.
 * Ví dụ: { id, fullName, email, phone, status="Active"/"Locked", ... }
 */
function mapApiUserToAdvertiser(apiUser: any): Advertiser {
  return {
    id: apiUser.id,
    // code = "ADS" + id zero-pad
    code: apiUser.id,
    name: apiUser.fullName ?? 'No name',
    phone: apiUser.phone ?? '',
    userName: apiUser.userName ?? '',
    createdAt: apiUser.createdAt ?? '',
    email: apiUser.email ?? '',
    company: apiUser.company ?? '',
    business: apiUser.business ?? '',
    // Map "Active" => "Hoạt động", "Locked" => "Bị khóa"
    status: apiUser.status === 'Active' ? 'Hoạt động' : 'Bị khóa'
  };
}

const AdvertiserList: React.FC = () => {
  // State chứa danh sách advertiser
  const [dataSource, setDataSource] = useState<Advertiser[]>([]);

  // Modal "Xem chi tiết"
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<Advertiser | null>(null);

  // Modal "Khóa/Mở khóa"
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);

  // 1) Gọi API lấy user role = "Advertiser", page=1, size=10
  const { data, isLoading, error } = useGetUsersByRole('Advertiser', 1, 10);

  // 2) Mỗi khi data?.result thay đổi, map sang Advertiser[]
  useEffect(() => {
    if (data?.result) {
      const apiUsers = data.result; // Mảng user từ backend
      const mapped = apiUsers.map((user: any) => mapApiUserToAdvertiser(user));
      setDataSource(mapped);
    }
  }, [data]);

  // 3) "Xem chi tiết"
  const handleView = (record: Advertiser) => {
    setSelectedAdvertiser(record);
    setIsViewModalVisible(true);
  };
  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedAdvertiser(null);
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
      { accessorKey: 'createdAt', header: 'NGÀY TẠO' },
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
        pageSizeOptions={[10, 20, 30, 40, 50]}
        showAdd={false}
      />

      {/* Modal "Xem chi tiết" */}
      <Modal
        open={isViewModalVisible}
        onCancel={closeViewModal}
        footer={<Button onClick={closeViewModal}>Đóng</Button>}
      >
        {selectedAdvertiser && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl text-gray-600">
                <BiBuildings />
              </div>
              <div>
                <h3 className="text-lg font-semibold ">
                  {selectedAdvertiser.name}
                </h3>
                <p className="text-sm text-gray-500">Nhà quảng cáo</p>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-600">
                Số điện thoại
              </label>
              <Input readOnly value={selectedAdvertiser.phone} />
            </div>
            <div>
              <label className="block font-semibold text-gray-600">
                Tên người dùng
              </label>
              <Input readOnly value={selectedAdvertiser.userName} />
            </div>
            <div>
              <label className="block font-semibold text-gray-600">
                Ngày tạo
              </label>
              <Input readOnly value={selectedAdvertiser.createdAt} />
            </div>
            <div>
              <label className="block font-semibold text-gray-600">Email</label>
              <Input readOnly value={selectedAdvertiser.email} />
            </div>
            <div>
              <label className="block font-semibold text-gray-600">
                Tên công ty
              </label>
              <Input readOnly value={selectedAdvertiser.company} />
            </div>
            <div>
              <label className="block font-semibold text-gray-600">
                Lĩnh vực kinh doanh
              </label>
              <Input readOnly value={selectedAdvertiser.business} />
            </div>
          </div>
        )}
      </Modal>

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
