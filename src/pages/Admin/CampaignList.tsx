import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
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

  // Cột cho bảng
  const columns: ColumnsType<Campaign> = [
    {
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endAt',
      key: 'endAt'
    },
    {
      title: 'Nhà quảng cáo',
      dataIndex: 'advertiser',
      key: 'advertiser'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className="font-semibold text-green-600">{status}</span>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => alert(`Sửa chiến dịch: ${record.name}`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => alert(`Xoá chiến dịch: ${record.name}`)}
          />
        </div>
      )
    }
  ];

  // Lọc dữ liệu mỗi khi searchValue thay đổi
  useEffect(() => {
    const filtered = initialCampaigns.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDataSource(filtered);
  }, [searchValue]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Danh sách chiến dịch</h2>

      {/* Thanh tìm kiếm */}
      <div className="mb-4 flex w-full max-w-sm items-center">
        <Input
          placeholder="Tìm kiếm chiến dịch"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Bảng */}
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CampaignList;
