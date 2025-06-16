import React, { useMemo } from 'react';
import { useGetPublisherTraffic } from '@/queries/traffic.query';
import DataTable from '@/components/shared/data-table';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { TrafficApiResponse } from '@/types';
import { useSearchParams } from 'react-router-dom';

const formatTimestamp = (timestamp: Date | string) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return format(date, 'dd/MM/yyyy HH:mm:ss');
};

interface TrafficTableProps {
  selectedCampaignId?: number;
}

const TrafficTable: React.FC<TrafficTableProps> = ({
  selectedCampaignId = 1
}) => {
  const [searchParams] = useSearchParams();

  // Lấy pagination từ URL search params (như DataTable đang làm)
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;

  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // Lấy traffic data với pagination từ URL
  const { data, isLoading, isError, error } = useGetPublisherTraffic(
    fallbackPage, // Dùng page từ URL
    fallbackPerPage, // Dùng pageSize từ URL
    selectedCampaignId
  );

  const trafficData = data?.result?.datas || [];
  const pageCount = data?.result?.totalPages || 0;

  // Handle search (nếu cần implement search trong tương lai)
  const handleSearchChange = (searchTerm: string) => {
    console.log('Search term:', searchTerm);
    // TODO: Implement search functionality
  };

  // Định nghĩa columns cho DataTable
  const columns = useMemo<ColumnDef<TrafficApiResponse>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue('id')}</div>
      },
      {
        accessorKey: 'ipAddress',
        header: 'IP Address',
        cell: ({ row }) => <div>{row.getValue('ipAddress')}</div>
      },
      {
        accessorKey: 'browser',
        header: 'Browser',
        cell: ({ row }) => <div>{row.getValue('browser')}</div>
      },
      {
        accessorKey: 'deviceType',
        header: 'Device',
        cell: ({ row }) => <div>{row.getValue('deviceType')}</div>
      },
      {
        accessorKey: 'referrerURL',
        header: 'ReferrerURL',
        cell: ({ row }) => (
          <div className="max-w-xs truncate">{row.getValue('referrerURL')}</div>
        )
      },
      {
        accessorKey: 'campaignParticipation',
        header: 'Campaign',
        cell: ({ row }) => {
          const campaignParticipation = row.getValue(
            'campaignParticipation'
          ) as TrafficApiResponse['campaignParticipation'];
          return (
            <div className="max-w-xs">
              <p className="truncate font-medium">
                {campaignParticipation?.campaign?.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                ID: #{campaignParticipation?.campaign?.id || 'N/A'}
              </p>
            </div>
          );
        }
      },
      {
        accessorKey: 'isValid',
        header: 'Valid',
        cell: ({ row }) => {
          const isValid = row.getValue('isValid') as boolean;
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isValid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-[#FEE2E2] text-[#991B1B]'
              }`}
            >
              {isValid ? 'Valid' : 'Invalid'}
            </span>
          );
        }
      },
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: ({ row }) => {
          const timestamp = row.getValue('timestamp') as Date | string;
          return <div>{formatTimestamp(timestamp)}</div>;
        }
      }
    ],
    []
  );

  // Export functions - Export current page data
  const handleExportCSV = () => {
    if (!trafficData.length) return;
    const headers = [
      'ID',
      'IP',
      'Browser',
      'Device',
      'ReferrerURL',
      'Campaign',
      'Valid',
      'Timestamp'
    ];
    const rows = trafficData.map((item) => [
      item.id.toString(),
      item.ipAddress,
      item.browser,
      item.deviceType,
      item.referrerURL,
      item.campaignParticipation?.campaign?.name || 'N/A',
      item.isValid ? 'Valid' : 'Invalid',
      formatTimestamp(item.timestamp)
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `traffic_campaign_${selectedCampaignId || 'all'}_page_${fallbackPage}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isError) {
    console.error(error);
    return <div className="text-red-500">Lỗi khi tải dữ liệu traffic!</div>;
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 ">
      {/* Header với Export button */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Traffic Data</h2>
          <p className="text-sm text-gray-500">
            {selectedCampaignId
              ? `Campaign ID: ${selectedCampaignId}`
              : 'Tất cả chiến dịch'}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!trafficData.length}
          className="transform rounded-lg bg-gradient-to-r from-blue to-[#2563EB] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-[#2563EB] hover:to-[#1D4ED8] hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Xuất Excel (CSV)
          </span>
        </button>
      </div>

      {/* DataTable Container */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={trafficData}
          pageCount={pageCount}
          isLoading={isLoading}
          pageSizeOptions={[10, 20, 30, 50]}
          heightTable="70dvh"
          onSearchChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default TrafficTable;
