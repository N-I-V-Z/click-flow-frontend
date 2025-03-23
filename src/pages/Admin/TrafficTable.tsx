import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { useGetTraffics } from '@/queries/traffic.query';
import { ApiResponse, PagingResponse, TrafficApiResponse } from '@/types';

interface Traffic {
  traffic_id: number;
  campaign_id?: number | undefined | null;
  publisher_id?: number | undefined | null;
  ip_address: string;
  timestamp: string;
  is_valid: boolean;
  device_type: string;
  browser: string;
  referrer_url: string;
  revenue?: number | null;
  order_id?: string | null;
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
  // Gọi API với campaignId, pageIndex và pageSize
  const { data, isLoading, error } = useGetTraffics(campaignId, 1, 10);

  // Lấy dữ liệu từ data.result (nếu có)
  const trafficData =
    (data as ApiResponse<PagingResponse<TrafficApiResponse>>)?.result?.datas ||
    [];
  console.log('Traffic Data:', trafficData);

  // Chuyển đổi dữ liệu thành dạng phù hợp với interface Traffic
  const convertedTrafficData: Traffic[] = useMemo(() => {
    return trafficData.map((item: TrafficApiResponse) => ({
      traffic_id: item.id,
      campaign_id: item.campaignParticipation?.campaignId,
      publisher_id: item.campaignParticipation?.publisherId,
      ip_address: item.ipAddress,
      timestamp: item.timestamp.toUTCString(),
      is_valid: item.isValid,
      device_type: item.deviceType,
      browser: item.browser,
      referrer_url: item.referrerURL,
      revenue: item.revenue,
      order_id: item.orderId
    }));
  }, [trafficData]);

  // Nếu API chưa lọc theo campaignId, ta có thể lọc lại client-side
  const filteredTrafficData = useMemo(() => {
    return convertedTrafficData.filter((t) => t.campaign_id === campaignId);
  }, [convertedTrafficData, campaignId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Đã có lỗi xảy ra.</div>;
  }

  // Giả sử pageCount được tính toán dựa trên dữ liệu hoặc API response
  const pageCount = 1;

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
