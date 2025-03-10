import React, { useState, useEffect } from 'react';
import { Table, Input, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined,
  SearchOutlined
} from '@ant-design/icons';

interface RequestCampaign {
  id: number;
  name: string;
  createdAt: string;
  endAt: string;
  advertiser: string;
  status: string;
}

// 11 dữ liệu mẫu
const initialRequests: RequestCampaign[] = [
  {
    id: 1,
    name: 'Mùa Hè Xanh',
    createdAt: '10/10/2024',
    endAt: '10/12/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  },
  {
    id: 2,
    name: 'Xuân Hy Vọng',
    createdAt: '01/01/2024',
    endAt: '30/03/2024',
    advertiser: 'Viettel',
    status: 'Chờ duyệt'
  },
  {
    id: 3,
    name: 'Thu Vàng',
    createdAt: '15/08/2024',
    endAt: '15/10/2024',
    advertiser: 'VNPT',
    status: 'Chờ duyệt'
  },
  {
    id: 4,
    name: 'Tết 2024',
    createdAt: '25/12/2023',
    endAt: '10/02/2024',
    advertiser: 'Shopee',
    status: 'Chờ duyệt'
  },
  {
    id: 5,
    name: 'Ngày Hội Mua Sắm',
    createdAt: '05/05/2024',
    endAt: '15/05/2024',
    advertiser: 'Lazada',
    status: 'Chờ duyệt'
  },
  {
    id: 6,
    name: 'Black Friday',
    createdAt: '20/11/2024',
    endAt: '01/12/2024',
    advertiser: 'Tiki',
    status: 'Chờ duyệt'
  },
  {
    id: 7,
    name: 'Siêu Sale 11/11',
    createdAt: '01/11/2024',
    endAt: '12/11/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  },
  {
    id: 8,
    name: 'Noel 2024',
    createdAt: '01/12/2024',
    endAt: '31/12/2024',
    advertiser: 'VinID',
    status: 'Chờ duyệt'
  },
  {
    id: 9,
    name: 'Hè Rực Rỡ',
    createdAt: '01/06/2024',
    endAt: '31/07/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  },
  {
    id: 10,
    name: 'Du Lịch Biển',
    createdAt: '10/06/2024',
    endAt: '31/08/2024',
    advertiser: 'VN Airlines',
    status: 'Chờ duyệt'
  },
  {
    id: 11,
    name: 'Tri Ân Khách Hàng',
    createdAt: '05/09/2024',
    endAt: '15/09/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  }
  // ... (các item khác)
];

const CampaignRequest: React.FC = () => {
  // State cho tìm kiếm
  const [searchValue, setSearchValue] = useState('');

  // State cho dữ liệu bảng (lọc theo search)
  const [dataSource, setDataSource] =
    useState<RequestCampaign[]>(initialRequests);

  // State quản lý Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(
    null
  );
  const [selectedCampaign, setSelectedCampaign] =
    useState<RequestCampaign | null>(null);

  // Xử lý khi bấm OK trên Modal
  const handleOk = () => {
    if (selectedCampaign && modalAction) {
      if (modalAction === 'accept') {
        alert(`Đã duyệt chiến dịch: ${selectedCampaign.name}`);
      } else {
        alert(`Đã từ chối chiến dịch: ${selectedCampaign.name}`);
      }
    }
    setIsModalVisible(false);
    setModalAction(null);
    setSelectedCampaign(null);
  };

  // Xử lý khi bấm Cancel trên Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
    setSelectedCampaign(null);
  };

  // Cấu hình cột cho bảng
  const columns: ColumnsType<RequestCampaign> = [
    {
      title: 'TÊN CHIẾN DỊCH',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'NGÀY KẾT THÚC',
      dataIndex: 'endAt',
      key: 'endAt'
    },
    {
      title: 'NHÀ QUẢNG CÁO',
      dataIndex: 'advertiser',
      key: 'advertiser'
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className="text-orange-600 font-semibold">{status}</span>
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          {/* Duyệt */}
          <CheckCircleOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-green-500
              transition-colors hover:bg-green-500 hover:text-white
            "
            onClick={() => {
              setSelectedCampaign(record);
              setModalAction('accept');
              setIsModalVisible(true);
            }}
          />

          {/* Từ chối */}
          <CloseCircleOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#DC0E0E]
              transition-colors hover:bg-[#DC0E0E] hover:text-white
            "
            onClick={() => {
              setSelectedCampaign(record);
              setModalAction('reject');
              setIsModalVisible(true);
            }}
          />

          {/* Khác / Menu */}
          <EllipsisOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#FFBF00]
              transition-colors hover:bg-[#FFBF00] hover:text-white
            "
            onClick={() => alert(`Thao tác khác cho: ${record.name}`)}
          />
        </div>
      )
    }
  ];

  // Lọc dữ liệu khi searchValue thay đổi
  useEffect(() => {
    const filtered = initialRequests.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDataSource(filtered);
  }, [searchValue]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Yêu cầu chiến dịch</h2>

      {/* Thanh tìm kiếm (bên phải) */}
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Tìm kiếm chiến dịch"
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

      {/* Modal xác nhận Duyệt / Từ chối */}
      <Modal
        title={
          modalAction === 'accept'
            ? 'Duyệt chiến dịch'
            : modalAction === 'reject'
              ? 'Từ chối chiến dịch'
              : ''
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
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
        {modalAction === 'accept' && selectedCampaign && (
          <p>
            Bạn có chắc muốn <b className="text-green-600">duyệt</b> chiến dịch
            <span className="ml-1 font-semibold">
              "{selectedCampaign.name}"
            </span>
            ?
          </p>
        )}
        {modalAction === 'reject' && selectedCampaign && (
          <p>
            Bạn có chắc muốn <b className="text-[#DC0E0E]">từ chối</b> chiến
            dịch
            <span className="ml-1 font-semibold">
              "{selectedCampaign.name}"
            </span>
            ?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CampaignRequest;
