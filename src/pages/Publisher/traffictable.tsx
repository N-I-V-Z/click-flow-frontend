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

  // Định nghĩa columns cho DataTable với responsive design
  const columns = useMemo<ColumnDef<TrafficApiResponse>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
        cell: ({ row }) => (
          <div className="text-center font-medium">{row.getValue('id')}</div>
        )
      },
      {
        accessorKey: 'ipAddress',
        header: 'IP Address',
        size: 120,
        cell: ({ row }) => (
          <div className="font-mono text-xs">{row.getValue('ipAddress')}</div>
        )
      },
      {
        accessorKey: 'browser',
        header: 'Browser',
        size: 80,
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue('browser')}</div>
        )
      },
      {
        accessorKey: 'deviceType',
        header: 'Device',
        size: 80,
        cell: ({ row }) => {
          const device = row.getValue('deviceType') as string;
          return (
            <div className="flex items-center gap-1 text-sm">
              <span>{device}</span>
            </div>
          );
        }
      },
      {
        accessorKey: 'referrerURL',
        header: 'Referrer URL',
        size: 200,
        cell: ({ row }) => {
          const url = row.getValue('referrerURL') as string;
          return (
            <div className="max-w-[200px]">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-xs text-[#2563EB] hover:text-[#1E40AF] hover:underline"
                title={url}
              >
                {url}
              </a>
            </div>
          );
        }
      },
      {
        accessorKey: 'campaignParticipation',
        header: 'Campaign',
        size: 180,
        cell: ({ row }) => {
          const campaignParticipation = row.getValue(
            'campaignParticipation'
          ) as TrafficApiResponse['campaignParticipation'];
          return (
            <div className="max-w-[180px]">
              <p className="truncate text-sm font-medium text-[#111827]">
                {campaignParticipation?.campaign?.name || 'N/A'}
              </p>
              <p className="text-xs text-[#6B7280]">
                ID: #{campaignParticipation?.campaign?.id || 'N/A'}
              </p>
            </div>
          );
        }
      },
      {
        accessorKey: 'isValid',
        header: 'Status',
        size: 80,
        cell: ({ row }) => {
          const isValid = row.getValue('isValid') as boolean;
          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                isValid
                  ? 'bg-[#DCFCE7] text-[#166534]'
                  : 'bg-[#FEE2E2] text-[#991B1B]'
              }`}
            >
              {isValid ? '✓ Valid' : '✗ Invalid'}
            </span>
          );
        }
      },
      {
        accessorKey: 'timestamp',
        header: 'Time',
        size: 140,
        cell: ({ row }) => {
          const timestamp = row.getValue('timestamp') as Date | string;
          const formatted = formatTimestamp(timestamp);
          const [date, time] = formatted.split(' ');
          return (
            <div className="text-xs">
              <div className="font-medium text-[#111827]">{date}</div>
              <div className="text-[#6B7280]">{time}</div>
            </div>
          );
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
    return <div className="text-[#DC2626]">Lỗi khi tải dữ liệu traffic!</div>;
  }

  return (
    <div className="w-full">
      {/* Header với Export button - Responsive */}
      <div className="mb-4 flex flex-col gap-3 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#111827] sm:text-xl">
            Traffic Data
          </h2>
          <p className="text-sm text-[#6B7280]">
            {selectedCampaignId
              ? `Campaign ID: ${selectedCampaignId}`
              : 'Tất cả chiến dịch'}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!trafficData.length}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-[#2563EB] hover:to-[#1D4ED8] hover:shadow-lg disabled:cursor-not-allowed disabled:from-[#9CA3AF] disabled:to-[#6B7280] sm:px-6 sm:py-3"
        >
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
          <span className="hidden sm:inline">Xuất Excel (CSV)</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      {/* DataTable Container - Responsive với scroll */}
      <div className="w-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={trafficData}
            pageCount={pageCount}
            isLoading={isLoading}
            pageSizeOptions={[10, 20, 30, 50]}
            heightTable="60dvh"
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TrafficTable;
