import React, { useState, useEffect } from 'react';
import { Table, Input, Modal, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';

interface Publisher {
  id: number;
  code: string;
  name: string;
  phone: string;
  userName: string;
  createdAt: string;
  email: string;
  bankAccount: string;
  bankName: string;
  status: string; // "Hoạt động" | "Bị khóa"
}

const initialPublishers: Publisher[] = [
  {
    id: 1,
    code: 'PLS001',
    name: 'Nguyễn Khải Qui',
    phone: '0431343144',
    userName: 'Quink333',
    createdAt: '26/11/2024',
    email: 'quink1234@gmail.com',
    bankAccount: '0431343144',
    bankName: 'MB BANK - Ngân hàng Quân Đội',
    status: 'Hoạt động'
  },
  {
    id: 2,
    code: 'PLS002',
    name: 'Trần Thị Hồng',
    phone: '0123456789',
    userName: 'TranHong',
    createdAt: '15/10/2024',
    email: 'tran.hong@example.com',
    bankAccount: '1234567890',
    bankName: 'Vietcombank',
    status: 'Bị khóa'
  },
  {
    id: 3,
    code: 'PLS003',
    name: 'Phạm Quang',
    phone: '0987654321',
    userName: 'PhQuang',
    createdAt: '05/09/2024',
    email: 'phquang@example.com',
    bankAccount: '5678901234',
    bankName: 'Techcombank',
    status: 'Hoạt động'
  },
  {
    id: 4,
    code: 'PLS004',
    name: 'Nguyễn Tuấn',
    phone: '0909009009',
    userName: 'NgTuan',
    createdAt: '01/08/2024',
    email: 'ngtuan@example.com',
    bankAccount: '9876543210',
    bankName: 'BIDV',
    status: 'Bị khóa'
  },
  {
    id: 5,
    code: 'PLS005',
    name: 'Võ Thị Xuân',
    phone: '0777000111',
    userName: 'VoXuan',
    createdAt: '10/07/2024',
    email: 'voxuan@example.com',
    bankAccount: '0111001001',
    bankName: 'Agribank',
    status: 'Hoạt động'
  }
  // ... (các dữ liệu khác)
];

const PublisherList: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [dataSource, setDataSource] = useState<Publisher[]>(initialPublishers);

  // Modal xem chi tiết
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );

  // Modal khóa/mở khóa
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);

  const handleView = (record: Publisher) => {
    setSelectedPublisher(record);
    setIsViewModalVisible(true);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedPublisher(null);
  };

  const handleLockUnlock = (record: Publisher) => {
    setSelectedPublisher(record);
    setIsLockModalVisible(true);
  };

  const confirmLockUnlock = () => {
    if (selectedPublisher) {
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === selectedPublisher.id
            ? {
                ...item,
                status: item.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động'
              }
            : item
        )
      );
    }
    setIsLockModalVisible(false);
    setSelectedPublisher(null);
  };

  const cancelLockUnlock = () => {
    setIsLockModalVisible(false);
    setSelectedPublisher(null);
  };

  const columns: ColumnsType<Publisher> = [
    {
      title: 'MÃ',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'TÊN NHÀ TIẾP THỊ',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'createdAt',
      key: 'createdAt'
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
          {/* Xem chi tiết */}
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

  // Lọc theo mã hoặc tên
  useEffect(() => {
    const lower = searchValue.toLowerCase();
    const filtered = initialPublishers.filter(
      (item) =>
        item.code.toLowerCase().includes(lower) ||
        item.name.toLowerCase().includes(lower)
    );
    setDataSource(filtered);
  }, [searchValue]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Nhà tiếp thị</h2>

      {/* Thanh tìm kiếm (bên phải) */}
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Tìm kiếm theo mã hoặc tên"
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Bảng */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          pageSize: 10,
          position: ['bottomCenter']
        }}
      />

      {/* Modal xem chi tiết */}
      <Modal
        open={isViewModalVisible}
        onCancel={closeViewModal}
        footer={
          <Button onClick={closeViewModal} className="border">
            Đóng
          </Button>
        }
        // Xóa title gốc để dùng header tùy chỉnh
        title={null}
      >
        {selectedPublisher && (
          <div>
            {/* Header tùy chỉnh */}
            <div className="flex items-center gap-3">
              {/* Icon đại diện */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl text-gray-600">
                <UserOutlined />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedPublisher.name}
                </h3>
                <p className="text-sm text-gray-500">Nhà tiếp thị</p>
              </div>
            </div>

            {/* Dòng mờ ngăn cách */}
            <hr className="my-4 border-gray-300" />

            {/* Thông tin chi tiết */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-600">
                  Số điện thoại
                </label>
                <Input readOnly value={selectedPublisher.phone} />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  Tên người dùng
                </label>
                <Input readOnly value={selectedPublisher.userName} />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  Ngày tạo
                </label>
                <Input readOnly value={selectedPublisher.createdAt} />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  Email
                </label>
                <Input readOnly value={selectedPublisher.email} />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  Số tài khoản
                </label>
                <Input readOnly value={selectedPublisher.bankAccount} />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  Tên ngân hàng
                </label>
                <Input readOnly value={selectedPublisher.bankName} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal khóa/mở khóa */}
      <Modal
        title={
          selectedPublisher?.status === 'Hoạt động'
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
        // Tùy chỉnh nút Hủy
        cancelButtonProps={{
          className: 'text-[#DC0E0E] border-[#DC0E0E]  hover:text-white'
        }}
      >
        <p>
          Bạn có chắc chắn muốn{' '}
          {selectedPublisher?.status === 'Hoạt động' ? 'khóa' : 'mở khóa'} nhà
          tiếp thị <strong>{selectedPublisher?.name}</strong> không?
        </p>
      </Modal>
    </div>
  );
};

export default PublisherList;
