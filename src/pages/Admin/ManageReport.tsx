import { useState, useEffect, useMemo } from 'react';
import { Button, Tag, Input } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
import { useGetReports } from '@/queries/report.query';
import ReportDetailModal from './ReportDetailModal';
import ReportResponseModal from './ReportResponseModal';
import { ApiResponse, PagingResponse, ReportApiResponse } from '@/types';
import BasePages from '@/components/shared/base-pages';

interface Report {
  id: string;
  reporter: string;
  reporterId: string;
  accused: string;
  accusedId: string;
  date: string;
  status: 'Đã duyệt' | 'Đang chờ' | 'Từ chối';
  reason: string;
  evidence: string;
}

const statusTagColor: Record<string, string> = {
  'Đã duyệt': 'green',
  'Đang chờ': 'blue',
  'Từ chối': 'red'
};

function mapApiReportToLocal(apiItem: ReportApiResponse): Report {
  return {
    id: String(apiItem.id),
    reporter:
      apiItem.publisher?.applicationUser?.fullName ?? 'Unknown Publisher',
    reporterId: String(apiItem.publisherId ?? ''),
    accused:
      apiItem.advertiser?.applicationUser?.fullName ??
      `Advertiser ${apiItem.advertiserId}`,
    accusedId: String(apiItem.advertiserId ?? ''),
    date: new Date(apiItem.createdAt).toLocaleDateString('vi-VN'),
    status:
      apiItem.status === 'Pending'
        ? 'Đang chờ'
        : apiItem.status === 'Approved'
          ? 'Đã duyệt'
          : 'Từ chối',
    reason: apiItem.reason,
    evidence: apiItem.evidenceURL ?? ''
  };
}

export default function ReportTable() {
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailReport, setDetailReport] = useState<Report | null>(null);
  const [responseOpen, setResponseOpen] = useState(false);
  const [responseReport, setResponseReport] = useState<Report | null>(null);
  const { data, isLoading, error } = useGetReports(1, 10);

  useEffect(() => {
    if (
      (data as ApiResponse<PagingResponse<ReportApiResponse>>)?.result?.datas
    ) {
      const mapped = (
        data as ApiResponse<PagingResponse<ReportApiResponse>>
      ).result?.datas.map((item: ReportApiResponse) =>
        mapApiReportToLocal(item)
      );
      setReports(mapped ?? []);
    }
  }, [data]);

  const filteredReports = useMemo(() => {
    const lower = search.toLowerCase();
    return reports.filter(
      (r) =>
        r.id.toLowerCase().includes(lower) ||
        r.reporter.toLowerCase().includes(lower)
    );
  }, [reports, search]);

  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      { accessorKey: 'id', header: 'Mã báo cáo' },
      { accessorKey: 'reporter', header: 'Tên người báo cáo' },
      { accessorKey: 'date', header: 'Ngày tạo' },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const status = row.original.status;
          const color = statusTagColor[status] || 'default';
          return <Tag color={color}>{status}</Tag>;
        }
      },
      {
        id: 'action',
        header: 'Hành động',
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex gap-2">
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  setDetailReport(record);
                  setDetailOpen(true);
                }}
              />
              {/* Nút Phản hồi */}
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setResponseReport(record);
                  setResponseOpen(true);
                }}
              />
            </div>
          );
        }
      }
    ],
    []
  );

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Quản lý báo cáo">
        <div className="p-4">
          <Loading />
        </div>
      </BasePages>
    );
  }
  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Quản lý báo cáo">
        <div className="p-4">Đã có lỗi xảy ra khi tải dữ liệu báo cáo!</div>
      </BasePages>
    );
  }

  const handleSubmitResponse = (newStatus: string, response: string) => {
    if (!responseReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === responseReport.id
          ? { ...r, status: newStatus as Report['status'] }
          : r
      )
    );
    showToast.success(`Đã gửi phản hồi: ${response}`);
    setResponseOpen(false);
  };

  return (
    <BasePages pageHead="ClickFlow - Quản lý báo cáo">
      <div className="mb-10 p-4">
        <h2 className="mb-4 text-xl font-semibold">Quản lý báo cáo</h2>
        <div className="mb-4 flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm theo mã báo cáo hoặc tên người báo cáo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredReports}
          pageCount={-1}
          pageSizeOptions={[5, 10, 20]}
        />

        <ReportDetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          report={detailReport}
        />

        <ReportResponseModal
          open={responseOpen}
          onClose={() => setResponseOpen(false)}
          report={responseReport}
          onSubmit={handleSubmitResponse}
        />
      </div>
    </BasePages>
  );
}
