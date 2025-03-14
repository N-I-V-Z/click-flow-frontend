import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { useGetTraffics } from '@/queries/traffic.query';

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
  order_id?: string;
}

interface TrafficTableProps {
  campaignId: number;
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
  // Gọi hook để fetch dữ liệu
  const {
    data, // dữ liệu trả về
    isLoading, // trạng thái loading
    error // đối tượng lỗi (nếu có)
  } = useGetTraffics(1, 10, '');
  // Tuỳ vào logic bạn có thể cho pageIndex, pageSize, keyword làm biến props hoặc state

  // Dữ liệu trả về sẽ có dạng: {statusCode, isSuccess, message, errors, result: [...]}
  // Ta cần lấy data.result để có mảng traffic
  const trafficData = data?.result || [];
  console.log('trdata', trafficData);
  // Tạo mảng trafficData đúng cấu trúc interface Traffic
  const convertedTrafficData: Traffic[] = useMemo(() => {
    return trafficData.map((item) => ({
      traffic_id: item.id,
      campaign_id: item.campaignId,
      publisher_id: item.publisherId,
      ip_address: item.ipAddress,
      timestamp: item.timestamp,
      is_valid: item.isValid,
      device_type: item.deviceType,
      browser: item.browser,
      referrer_url: item.referrerURL,
      revenue: item.revenue,
      order_id: item.orderId
    }));
  }, [trafficData]);

  // Lọc dữ liệu cho đúng campaignId
  const filteredTrafficData = useMemo(() => {
    return convertedTrafficData.filter((t) => t.campaign_id === campaignId);
  }, [convertedTrafficData, campaignId]);

  // Nếu đang fetch thì trả về loading...
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Nếu có lỗi
  if (error) {
    return <div>Đã có lỗi xảy ra.</div>;
  }

  // Tạm thời pageCount cứ set cứng là 1 để demo
  const pageCount = 1;
  console.log('filteredTrafficData', filteredTrafficData);
  console.log('dataaa', data);
  return (
    <div className="bg-gray-100 p-4">
      <div className="m-4 rounded border border-gray-300 bg-white p-4 shadow">
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
    </div>
  );
};

export default TrafficTable;
