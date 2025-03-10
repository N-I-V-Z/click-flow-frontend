import React, { useState, useEffect } from 'react';
import { Table, Input, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';

interface Campaign {
  id: number;
  name: string;
  createdAt: string;
  endAt: string;
  advertiser: string;
  status: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Mùa Hè Xanh',
    createdAt: '10/10/2024',
    endAt: '10/12/2024',
    advertiser: 'FPT',
    status: 'Hoạt động'
  },
  {
    id: 2,
    name: 'Xuân Hy Vọng',
    createdAt: '01/01/2024',
    endAt: '30/03/2024',
    advertiser: 'Viettel',
    status: 'Hoạt động'
  },
  {
    id: 3,
    name: 'Thu Vàng',
    createdAt: '15/08/2024',
    endAt: '15/10/2024',
    advertiser: 'VNPT',
    status: 'Hoạt động'
  },
  {
    id: 4,
    name: 'Tết 2024',
    createdAt: '25/12/2023',
    endAt: '10/02/2024',
    advertiser: 'Shopee',
    status: 'Hoạt động'
  },
  {
    id: 5,
    name: 'Ngày Hội Mua Sắm',
    createdAt: '05/05/2024',
    endAt: '15/05/2024',
    advertiser: 'Lazada',
    status: 'Hoạt động'
  },
  {
    id: 6,
    name: 'Black Friday',
    createdAt: '20/11/2024',
    endAt: '01/12/2024',
    advertiser: 'Tiki',
    status: 'Hoạt động'
  },
  {
    id: 7,
    name: 'Siêu Sale 11/11',
    createdAt: '01/11/2024',
    endAt: '12/11/2024',
    advertiser: 'FPT',
    status: 'Hoạt động'
  },
  {
    id: 8,
    name: 'Noel 2024',
    createdAt: '01/12/2024',
    endAt: '31/12/2024',
    advertiser: 'VinID',
    status: 'Hoạt động'
  },
  {
    id: 9,
    name: 'Hè Rực Rỡ',
    createdAt: '01/06/2024',
    endAt: '31/07/2024',
    advertiser: 'FPT',
    status: 'Hoạt động'
  },
  {
    id: 10,
    name: 'Du Lịch Biển',
    createdAt: '10/06/2024',
    endAt: '31/08/2024',
    advertiser: 'VN Airlines',
    status: 'Hoạt động'
  },
  {
    id: 11,
    name: 'Tri Ân Khách Hàng',
    createdAt: '05/09/2024',
    endAt: '15/09/2024',
    advertiser: 'FPT',
    status: 'Hoạt động'
  }
];

const CampaignList: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [dataSource, setDataSource] = useState<Campaign[]>(initialCampaigns);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const handleDelete = () => {
    if (selectedCampaign) {
      setDataSource((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
    }
    setIsModalVisible(false);
    setSelectedCampaign(null);
  };

  const columns: ColumnsType<Campaign> = [
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
        <span className="font-semibold text-green-600">{status}</span>
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_, record) => (
        <div className="flex justify-center gap-3 ">
          {/* Xem */}
          <EyeOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#1570EF]
              transition-colors hover:bg-[#1570EF] hover:text-white
            "
            onClick={() => alert(`Xem: ${record.name}`)}
          />
          {/* Sửa */}
          <EditOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#FFBF00]
              transition-colors hover:bg-[#FFBF00] hover:text-white
            "
            onClick={() => alert(`Sửa: ${record.name}`)}
          />
          {/* Xoá */}
          <CloseCircleOutlined
            className="
              cursor-pointer rounded-full p-1
              text-xl text-[#DC0E0E]
              transition-colors hover:bg-[#DC0E0E] hover:text-white
            "
            onClick={() => {
              setSelectedCampaign(record);
              setIsModalVisible(true);
            }}
          />
        </div>
      )
    }
  ];

  // Lọc dữ liệu khi searchValue thay đổi
  useEffect(() => {
    const filtered = initialCampaigns.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDataSource(filtered);
  }, [searchValue]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Danh sách chiến dịch</h2>

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
      <Modal
        title="Dừng chiến dịch"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
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
        {selectedCampaign && (
          <p>
            Bạn có chắc muốn <b className="text-red-500">dừng</b> chiến dịch "
            {selectedCampaign.name}" không?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CampaignList;
