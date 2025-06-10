import { useState, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { useGetTrafficForAdvertiser } from '@/queries/traffic.query';
import helpers from '@/helpers';
import BasePages from '@/components/shared/base-pages';
import Loading from '@/components/ui/loading';
import { TrafficItem, TrafficApiResponse } from '@/types';

// Mapping function to convert API response to UI model
function mapTrafficApiToTrafficItem(apiItem: TrafficApiResponse): TrafficItem {
  return {
    id: apiItem.id,
    ipAddress: apiItem.ipAddress,
    isValid: apiItem.isValid,
    revenue: 0, // TrafficApiResponse doesn't have revenue, set default
    deviceType: apiItem.deviceType,
    orderId: apiItem.clickId, // Map clickId to orderId
    browser: apiItem.browser,
    referrerURL: apiItem.referrerURL,
    timestamp: new Date(apiItem.timestamp).toISOString()
  };
}

export default function Traffic() {
  const { pageIndex, pageSize } = helpers.usePaginationParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError } = useGetTrafficForAdvertiser(
    pageIndex,
    pageSize,
    searchTerm
  );

  const filteredData = useMemo(() => {
    const traffics = data?.result?.datas || [];
    // Map from TrafficApiResponse to TrafficItem
    const mappedTraffics = traffics.map((item: TrafficApiResponse) =>
      mapTrafficApiToTrafficItem(item)
    );

    return mappedTraffics.filter((item: TrafficItem) => {
      const term = searchTerm.toLowerCase();
      const ipMatch = item.ipAddress?.toLowerCase().includes(term);
      const refMatch = item.referrerURL?.toLowerCase().includes(term);
      return ipMatch || refMatch;
    });
  }, [data, searchTerm]);

  const columns: ColumnDef<TrafficItem>[] = [
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address'
    },
    {
      accessorKey: 'referrerURL',
      header: 'Referrer',
      cell: ({ row }) => {
        const ref = row.original.referrerURL;
        return (
          <a
            href={ref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline transition-colors"
          >
            {ref}
          </a>
        );
      }
    },
    {
      accessorKey: 'isValid',
      header: 'Valid',
      cell: ({ row }) => (
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            row.original.isValid
              ? 'bg-green-100 text-green-800'
              : 'bg-[#fee2e2] text-[#991b1b]'
          }`}
        >
          {row.original.isValid ? 'Valid' : 'Invalid'}
        </span>
      )
    },
    {
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {row.original.revenue?.toLocaleString() || '0'}
        </span>
      )
    },
    {
      accessorKey: 'deviceType',
      header: 'Device Type'
    },
    {
      accessorKey: 'orderId',
      header: 'Order ID'
    },
    {
      accessorKey: 'browser',
      header: 'Browser'
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) =>
        new Date(row.original.timestamp).toLocaleString('vi-VN')
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">
          Lỗi khi tải dữ liệu.
        </div>
      </div>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Truy cập">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-white p-6">
            <div className="mb-6 flex flex-col pb-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0">
                Danh sách Traffic
              </h2>
              <div className="mt-4 sm:mt-0">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded border p-2"
                />
              </div>
            </div>
            <DataTable columns={columns} data={filteredData} pageCount={1} />
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </BasePages>
  );
}
