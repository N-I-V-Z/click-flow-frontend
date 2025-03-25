import React, { useEffect, useState } from 'react';
import { useGetPublisherTraffic } from '@/queries/traffic.query';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const formatTimestamp = (timestamp: string) => {
  return format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss');
};

const TrafficTable: React.FC = () => {
  // Khai báo state để theo dõi trang hiện tại
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Gọi API với trang hiện tại và số lượng phần tử trên mỗi trang
  const { data, isLoading, isError, error } = useGetPublisherTraffic(
    page,
    pageSize
  );
  const trafficData = data?.result?.datas || [];

  // Hàm xuất CSV và PDF giữ nguyên
  const handleExportCSV = () => {
    if (!trafficData.length) return;
    const headers = [
      'ID',
      'IP',
      'Browser',
      'Device',
      'ReferrerURL',
      'Timestamp'
    ];
    const rows = trafficData.map((item) => [
      item.id.toString(),
      item.ipAddress,
      item.browser,
      item.deviceType,
      item.referrerURL,
      item.timestamp
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'traffic.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!trafficData.length) return;
    const doc = new jsPDF();
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'IP', dataKey: 'ipAddress' },
      { header: 'Browser', dataKey: 'browser' },
      { header: 'Device', dataKey: 'deviceType' },
      { header: 'ReferrerURL', dataKey: 'referrerURL' },
      { header: 'Timestamp', dataKey: 'timestamp' }
    ];
    doc.autoTable({
      columns,
      body: trafficData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      startY: 10
    });
    doc.save('traffic.pdf');
  };

  // Các hàm xử lý phân trang
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={6}
        rowCount={10}
        searchableColumnCount={1}
        filterableColumnCount={1}
      />
    );
  }

  if (isError) {
    console.error(error);
    return <div className="text-red-500">Lỗi khi tải dữ liệu traffic!</div>;
  }

  return (
    <div className="space-y-4">
      {/* Nút xuất file */}
      <div className="flex space-x-2">
        <button
          onClick={handleExportCSV}
          className="bg-blue-500 hover:bg-blue-600 rounded px-4 py-2 font-semibold text-black"
        >
          Xuất Excel (CSV)
        </button>
        {/* Có thể bật nút xuất PDF nếu cần */}
        {/* <button
          onClick={handleExportPDF}
          className="rounded bg-red-500 px-4 py-2 font-semibold text-black hover:bg-red-600"
        >
          Xuất PDF
        </button> */}
      </div>

      {/* Bảng Traffic */}
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>ReferrerURL</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trafficData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.ipAddress}</TableCell>
                <TableCell>{item.browser}</TableCell>
                <TableCell>{item.deviceType}</TableCell>
                <TableCell>{item.referrerURL}</TableCell>
                <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Điều hướng phân trang */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>Trang {page}</span>
        <button
          onClick={handleNextPage}
          className="rounded bg-gray-300 px-4 py-2"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default TrafficTable;
