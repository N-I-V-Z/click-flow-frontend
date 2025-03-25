import { useState, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { useGetTrafficForAdvertiser } from '@/queries/traffic.query';
import helpers from '@/helpers';

type TrafficType = {
  id: number;
  ipAddress: string;
  referrerURL: string;
  revenue: number;
  browser: string;
  timestamp: string;
};

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
    return traffics.filter((item: TrafficType) => {
      const term = searchTerm.toLowerCase();
      const ipMatch = item.ipAddress?.toLowerCase().includes(term);
      const refMatch = item.referrerURL?.toLowerCase().includes(term);
      return ipMatch || refMatch;
    });
  }, [data, searchTerm]);

  const columns: ColumnDef<TrafficType>[] = [
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
      accessorKey: 'revenue',
      header: 'Revenue',
      cell: ({ row }) => (
        <span className="font-medium text-green-600">
          {row.original.revenue.toLocaleString()}
        </span>
      )
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
        <div className="text-xl font-semibold text-gray-600">
          Đang tải dữ liệu...
        </div>
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="rounded-lg bg-white p-6">
          <div className="mb-6 flex flex-col pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="mb-4 text-3xl font-bold text-gray-800 sm:mb-0">
              Danh sách Traffic
            </h2>
          </div>
          <DataTable columns={columns} data={filteredData} pageCount={1} />
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
