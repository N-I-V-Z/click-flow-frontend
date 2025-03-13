import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';

// Định nghĩa kiểu dữ liệu cho 1 bản ghi Traffic
interface Traffic {
  traffic_id: number;
  campaign_id: number;
  publisher_id: number;
  ip_address: string;
  timestamp: string;
  is_valid: boolean;
  device_type: string;
  browser: string;
  referrer_url: string;
  revenue: number;
  // order_id chỉ xuất hiện khi CPS, có thể để optional
  order_id?: string;
}

// Định nghĩa prop cho component TrafficTable
interface TrafficTableProps {
  campaignId: number; // hiển thị traffic của campaign này
}

const columns: ColumnDef<Traffic>[] = [
  {
    accessorKey: 'traffic_id',
    header: 'Traffic ID'
  },
  {
    accessorKey: 'publisher_id',
    header: 'Publisher ID'
  },
  {
    accessorKey: 'ip_address',
    header: 'IP Address'
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp'
  },
  {
    accessorKey: 'is_valid',
    header: 'Is Valid',
    cell: ({ row }) => (row.original.is_valid ? 'Yes' : 'No')
  },
  {
    accessorKey: 'device_type',
    header: 'Device Type'
  },
  {
    accessorKey: 'browser',
    header: 'Browser'
  },
  {
    accessorKey: 'referrer_url',
    header: 'Referrer URL'
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue'
  },
  {
    accessorKey: 'order_id',
    header: 'Order ID',
    cell: ({ row }) => row.original.order_id ?? 'N/A'
  }
];

const TrafficTable: React.FC<TrafficTableProps> = ({ campaignId }) => {
  // Fake data để demo
  const allTrafficData: Traffic[] = [
    {
      traffic_id: 1,
      campaign_id: 1,
      publisher_id: 1001,
      ip_address: '192.168.0.101',
      timestamp: '2023-03-01 10:00:00',
      is_valid: true,
      device_type: 'Mobile',
      browser: 'Chrome',
      referrer_url: 'https://example.com',
      revenue: 0.5,
      order_id: 'ORDER-ABC-123'
    },
    {
      traffic_id: 2,
      campaign_id: 1,
      publisher_id: 1002,
      ip_address: '192.168.0.102',
      timestamp: '2023-03-01 11:00:00',
      is_valid: false,
      device_type: 'Desktop',
      browser: 'Firefox',
      referrer_url: 'https://example.org',
      revenue: 0
    },
    {
      traffic_id: 3,
      campaign_id: 2,
      publisher_id: 1003,
      ip_address: '192.168.0.103',
      timestamp: '2023-03-02 09:15:00',
      is_valid: true,
      device_type: 'Tablet',
      browser: 'Safari',
      referrer_url: 'https://example.net',
      revenue: 1.2,
      order_id: 'ORDER-XYZ-789'
    },
    {
      traffic_id: 4,
      campaign_id: 1,
      publisher_id: 1004,
      ip_address: '192.168.0.104',
      timestamp: '2023-03-02 12:30:00',
      is_valid: true,
      device_type: 'Mobile',
      browser: 'Chrome',
      referrer_url: 'https://google.com',
      revenue: 0.3
    }
  ];

  // Lọc dữ liệu chỉ hiển thị traffic của campaignId
  const filteredTrafficData = useMemo(
    () => allTrafficData.filter((t) => t.campaign_id === campaignId),
    [campaignId]
  );

  // pageCount = 1 (demo). Bạn có thể tính toán dựa trên tổng số record thực tế.
  const pageCount = 1;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">
        Traffic of Campaign {campaignId}
      </h1>
      <DataTable
        columns={columns}
        data={filteredTrafficData}
        pageCount={pageCount}
        pageSizeOptions={[10, 20, 50, 100]}
        showAdd={false}
      />
    </div>
  );
};

export default TrafficTable;
