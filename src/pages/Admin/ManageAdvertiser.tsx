import React, { useState, useMemo } from 'react';
import { Modal, Button, Input } from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { BiBuildings } from 'react-icons/bi';
import DataTable from '@/components/shared/data-table'; // Điều chỉnh path cho phù hợp
import { ColumnDef } from '@tanstack/react-table';

interface Advertiser {
  id: number;
  code: string; // Mã nhà quảng cáo
  name: string; // Tên hiển thị
  phone: string; // Số điện thoại
  userName: string; // Username
  createdAt: string; // Ngày tạo
  email: string;
  company: string; // Tên công ty
  business: string; // Lĩnh vực kinh doanh
  status: string; // "Hoạt động" | "Bị khóa"
}

const initialAdvertisers: Advertiser[] = [
  {
    id: 1,
    code: 'ADS001',
    name: 'Nguyễn Khải Qui',
    phone: '0431343144',
    userName: 'Quink333',
    createdAt: '26/11/2024',
    email: 'quink1234@gmail.com',
    company: 'Shine source',
    business: 'Thực phẩm & đồ uống',
    status: 'Hoạt động'
  },
  {
    id: 2,
    code: 'ADS002',
    name: 'Trần Thị MKT',
    phone: '0123456789',
    userName: 'TranMKT',
    createdAt: '15/10/2024',
    email: 'tranmkt@example.com',
    company: 'ABC Marketing',
    business: 'Dịch vụ quảng cáo',
    status: 'Bị khóa'
  },
  {
    id: 3,
    code: 'ADS003',
    name: 'Phạm Q. Ads',
    phone: '0987654321',
    userName: 'PhQuangAds',
    createdAt: '05/09/2024',
    email: 'phquang@example.com',
    company: 'AdsTech',
    business: 'Công nghệ quảng cáo',
    status: 'Hoạt động'
  },
  {
    id: 4,
    code: 'ADS004',
    name: 'Lê Quảng',
    phone: '0909009009',
    userName: 'LeQuang',
    createdAt: '01/08/2024',
    email: 'lequang@example.com',
    company: 'Startup Co.',
    business: 'Khởi nghiệp',
    status: 'Bị khóa'
  },
  {
    id: 5,
    code: 'ADS005',
    name: 'Võ Quảng Bá',
    phone: '0777000111',
    userName: 'VoQB',
    createdAt: '10/07/2024',
    email: 'voqb@example.com',
    company: 'TTT Corp',
    business: 'Phân phối bán lẻ',
    status: 'Hoạt động'
  }
];

const AdvertiserList: React.FC = () => {
  const [dataSource, setDataSource] =
    useState<Advertiser[]>(initialAdvertisers);

  // State cho modal "Xem chi tiết"
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<Advertiser | null>(null);

  // State cho modal "Khóa/Mở khóa"
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);

  // Xử lý "Xem chi tiết"
  const handleView = (record: Advertiser) => {
    setSelectedAdvertiser(record);
    setIsViewModalVisible(true);
  };
  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedAdvertiser(null);
  };

  // Xử lý "Khóa/Mở khóa"
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

  // Định nghĩa cột theo chuẩn ColumnDef cho DataTable
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

  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Nhà quảng cáo</h2>

      {/* Sử dụng DataTable mới với phân trang, tìm kiếm, sắp xếp tích hợp */}
      <DataTable
        columns={columns}
        data={dataSource}
        pageCount={-1} // -1 để DataTable tự tính số trang dựa trên dữ liệu
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
