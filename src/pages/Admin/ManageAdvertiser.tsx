import React, { useState, useEffect } from 'react';
import { Table, Input, Modal, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  CloseCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { BiBuildings } from 'react-icons/bi';
interface Advertiser {
  id: number;
  code: string; // Mã nhà quảng cáo
  name: string; // Tên hiển thị
  phone: string; // Số điện thoại
  userName: string; // Tên người dùng (username)
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
  const [searchValue, setSearchValue] = useState('');
  const [dataSource, setDataSource] =
    useState<Advertiser[]>(initialAdvertisers);

  // -- 1) State cho popup "Xem chi tiết"
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] =
    useState<Advertiser | null>(null);

  // -- 2) State cho popup "Khóa/Mở khóa"
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);

  // (1) Xử lý "Xem chi tiết"
  const handleView = (record: Advertiser) => {
    setSelectedAdvertiser(record);
    setIsViewModalVisible(true);
  };
  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedAdvertiser(null);
  };

  // (2) Xử lý "Khóa/Mở khóa"
  const handleLockUnlock = (record: Advertiser) => {
    setSelectedAdvertiser(record);
    setIsLockModalVisible(true);
  };
  const confirmLockUnlock = () => {
    if (selectedAdvertiser) {
      // Đổi trạng thái
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

  // Cột cho bảng
  const columns: ColumnsType<Advertiser> = [
    {
      title: 'MÃ',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'TÊN NHÀ QUẢNG CÁO',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'TÊN CÔNG TY',
      dataIndex: 'company',
      key: 'company'
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'Hoạt động' ? (
          <span className="font-semibold text-green-600">{status}</span>
        ) : (
          <span className="font-semibold text-[#DC0E0E]">{status}</span>
        )
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          {/* Xem */}
          <EyeOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#1570EF]
              transition-colors hover:bg-[#1570EF] hover:text-white
            "
            onClick={() => handleView(record)}
          />

          {/* Khóa/Mở khóa */}
          <CloseCircleOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#DC0E0E]
              transition-colors hover:bg-[#DC0E0E] hover:text-white
            "
            onClick={() => handleLockUnlock(record)}
          />
        </div>
      )
    }
  ];

  // Lọc dữ liệu theo (mã, tên, công ty)
  useEffect(() => {
    const lower = searchValue.toLowerCase();
    const filtered = initialAdvertisers.filter(
      (item) =>
        item.code.toLowerCase().includes(lower) ||
        item.name.toLowerCase().includes(lower) ||
        item.company.toLowerCase().includes(lower)
    );
    setDataSource(filtered);
  }, [searchValue]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Nhà quảng cáo</h2>

      {/* Thanh tìm kiếm (bên phải) */}
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Tìm kiếm (mã, tên, công ty...)"
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Bảng (pagination giữa) */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          pageSize: 10,
          position: ['bottomCenter']
        }}
      />

      {/* Modal (1) Xem chi tiết */}
      <Modal
        open={isViewModalVisible}
        onCancel={closeViewModal}
        footer={
          <Button onClick={closeViewModal} className="border">
            Đóng
          </Button>
        }
      >
        {selectedAdvertiser && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Icon đại diện */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl text-gray-600">
                <BiBuildings />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
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

      {/* Modal (2) Khóa/Mở khóa */}
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
        // Tùy chỉnh nút OK
        okButtonProps={{
          className: 'bg-[#1570EF] text-white border-none'
        }}
        // Tùy chỉnh nút Hủy
        cancelButtonProps={{
          className: 'text-[#DC0E0E] border-[#DC0E0E]  hover:text-white'
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
