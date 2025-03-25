// src/components/TrafficTable.tsx
import React from 'react';
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

// Thay vì pdfmake, ta dùng jsPDF + autoTable
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const formatTimestamp = (timestamp: string) => {
  return format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss'); // Ví dụ: 25/03/2025 09:15:51
};
const TrafficTable: React.FC = () => {
  // Gọi API với React Query; bạn có thể truyền pageIndex, pageSize, keyword từ props nếu cần
  const { data, isLoading, isError, error } = useGetPublisherTraffic(1, 10);

  // trafficData là mảng TrafficItem
  const trafficData = data?.result?.datas || [];

  // ------------ XUẤT CSV ------------
  const handleExportCSV = () => {
    if (!trafficData.length) return;

    // Tiêu đề cột
    const headers = [
      'ID',
      'IP',
      'Browser',
      'Device',
      'ReferrerURL',
      'Timestamp'
    ];

    // Tạo các dòng dữ liệu
    const rows = trafficData.map((item) => [
      item.id.toString(),
      item.ipAddress,
      item.browser,
      item.deviceType,
      item.referrerURL,
      item.timestamp
    ]);

    // Ghép thành chuỗi CSV
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Tạo link download và click
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'traffic.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ------------ XUẤT PDF bằng jsPDF + autoTable ------------
  const handleExportPDF = () => {
    if (!trafficData.length) return;

    // Khởi tạo jsPDF
    const doc = new jsPDF();

    // Định nghĩa cột (header) cho autoTable
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'IP', dataKey: 'ipAddress' },
      { header: 'Browser', dataKey: 'browser' },
      { header: 'Device', dataKey: 'deviceType' },
      { header: 'ReferrerURL', dataKey: 'referrerURL' },
      { header: 'Timestamp', dataKey: 'timestamp' }
    ];

    // autoTable cần body là mảng object, mà trafficData đã sẵn là object
    // => Chỉ cần bảo đảm tên property trùng dataKey.
    // Lưu ý: trafficData phải có { id, ipAddress, browser, ... } đúng như columns.

    doc.autoTable({
      columns,
      body: trafficData,
      styles: { fontSize: 8 }, // Tùy chỉnh
      headStyles: { fillColor: [22, 160, 133] }, // Màu header
      startY: 10 // Cách top 10px
    });

    // Xuất PDF
    doc.save('traffic.pdf');
  };

  // ------------ RENDER ------------
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
    </div>
  );
};

export default TrafficTable;
