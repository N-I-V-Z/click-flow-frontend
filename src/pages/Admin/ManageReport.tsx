import React, { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Radio,
  Descriptions,
  Card,
  Tag,
  Input,
  message
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';

// Import hook lấy dữ liệu từ API
import { useGetReports } from '@/queries/report.query';

// Interface cho báo cáo trong UI
interface Report {
  id: string;
  reporter: string;
  reporterId: string;
  accused: string;
  accusedId: string;
  date: string;
  status: 'Đã duyệt' | 'Đang chờ' | 'Từ chối';
  reason: string;
  evidence: string | File;
}

// Map status -> màu Tag
const statusTagColor: Record<string, string> = {
  'Đã duyệt': 'green',
  'Đang chờ': 'blue',
  'Từ chối': 'red'
};

/**
 * Chuyển dữ liệu từ API => Report (UI).
 * Ví dụ API item: { id, reason, status, createAt, evidenceURL, publisherId, advertiserId, ... }
 */
function mapApiReportToLocal(apiItem: any): Report {
  return {
    // Mã báo cáo: "RP000xx"
    id: String(apiItem.id),
    // "reporter" = publisherId
    reporter: `Publisher ${apiItem.publisherId}`,
    reporterId: String(apiItem.publisherId),
    // "accused" = advertiserId
    accused: `Advertiser ${apiItem.advertiserId}`,
    accusedId: String(apiItem.advertiserId),
    // Định dạng ngày => "DD/MM/YYYY"
    date: new Date(apiItem.createAt).toLocaleDateString('vi-VN'),
    // Map status "Pending" => "Đang chờ", "Approved" => "Đã duyệt", "Rejected" => "Từ chối"
    status:
      apiItem.status === 'Pending'
        ? 'Đang chờ'
        : apiItem.status === 'Approved'
          ? 'Đã duyệt'
          : 'Từ chối',
    reason: apiItem.reason,
    evidence: apiItem.evidenceURL
  };
}

export default function ReportTable() {
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  // Gọi API KHÔNG truyền keyword => load toàn bộ
  const { data, isLoading, error } = useGetReports(1, 10);

  // Map dữ liệu API -> local state
  useEffect(() => {
    if (data?.result) {
      const apiReports = data.result;
      // Nếu cần lọc bỏ "Processing":
      // const filtered = apiReports.filter((item: any) => item.status !== 'Processing');
      // const mapped = filtered.map((item: any) => mapApiReportToLocal(item));
      const mapped = apiReports.map((item: any) => mapApiReportToLocal(item));
      setReports(mapped);
    }
  }, [data]);

  // Mở modal chỉnh sửa status
  const handleOpenModal = (record: Report) => {
    setSelectedReport(record);
    form.setFieldsValue({
      status: record.status,
      response: ''
    });
    setIsModalOpen(true);
  };

  // Gửi phản hồi => cập nhật cục bộ (chưa gọi API update)
  const handleSendResponse = () => {
    form.validateFields().then((values) => {
      if (!selectedReport) return;
      const newStatus = values.status as 'Đã duyệt' | 'Đang chờ' | 'Từ chối';
      console.log('Phản hồi gửi đi:', {
        ...selectedReport,
        newStatus,
        response: values.response
      });
      // Cập nhật cục bộ
      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id ? { ...r, status: newStatus } : r
        )
      );
      message.success('Đã gửi phản hồi thành công!');
      setIsModalOpen(false);
    });
  };

  // Tìm kiếm client-side
  const filteredReports = useMemo(() => {
    const lower = search.toLowerCase();
    return reports.filter(
      (report) =>
        report.id.toLowerCase().includes(lower) ||
        report.reporter.toLowerCase().includes(lower)
    );
  }, [reports, search]);

  // Định nghĩa cột DataTable
  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Mã báo cáo'
      },
      {
        accessorKey: 'reporter',
        header: 'Tên người báo cáo'
      },
      {
        accessorKey: 'date',
        header: 'Ngày tạo'
      },
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
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          );
        }
      }
    ],
    []
  );

  // Loading / Error
  if (isLoading) {
    return <div>Đang tải danh sách báo cáo...</div>;
  }
  if (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu báo cáo!</div>;
  }

  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Quản lý báo cáo</h2>

      {/* Ô tìm kiếm */}
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
        showAdd={false}
      />

      {/* Modal phản hồi */}
      <Modal
        title={<div className="text-lg font-semibold">Phản hồi báo cáo</div>}
        open={isModalOpen}
        onOk={handleSendResponse}
        onCancel={() => setIsModalOpen(false)}
        style={{ top: 80 }}
        width={1000}
        bodyStyle={{
          padding: 24,
          maxHeight: '70vh',
          overflowY: 'auto',
          display: 'flex',
          gap: 16
        }}
        okButtonProps={{
          className: 'bg-[#7F56D9] text-white border-none hover:opacity-90'
        }}
        cancelButtonProps={{
          className: 'hover:opacity-80'
        }}
      >
        {selectedReport && (
          <>
            {/* Cột trái: Thông tin báo cáo */}
            <Card
              bordered={false}
              className="rounded-md bg-gray-50 shadow-sm"
              style={{ flex: 1 }}
              bodyStyle={{ padding: 16 }}
            >
              <Descriptions
                bordered
                size="small"
                column={1}
                labelStyle={{ fontWeight: 'bold' }}
              >
                <Descriptions.Item label="Mã báo cáo">
                  {selectedReport.id}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {selectedReport.date}
                </Descriptions.Item>
                <Descriptions.Item label="Người báo cáo">
                  {selectedReport.reporter} (ID: {selectedReport.reporterId})
                </Descriptions.Item>
                <Descriptions.Item label="Bị cáo">
                  {selectedReport.accused} (ID: {selectedReport.accusedId})
                </Descriptions.Item>
                <Descriptions.Item label="Lý do">
                  {selectedReport.reason}
                </Descriptions.Item>
                <Descriptions.Item label="Bằng chứng">
                  {typeof selectedReport.evidence === 'string' ? (
                    <img
                      src={selectedReport.evidence}
                      alt="Bằng chứng"
                      className="max-h-60 w-full rounded-lg border border-gray-300 object-contain"
                    />
                  ) : (
                    <a
                      href={URL.createObjectURL(selectedReport.evidence)}
                      className="text-[#7F56D9] underline"
                    >
                      Tải xuống bằng chứng
                    </a>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Cột phải: Trạng thái & Phản hồi */}
            <Card
              bordered={false}
              className="rounded-md bg-gray-50 shadow-sm"
              style={{ flex: 1 }}
              bodyStyle={{ padding: 16 }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[
                    { required: true, message: 'Vui lòng chọn trạng thái' }
                  ]}
                >
                  <Radio.Group>
                    <Radio.Button
                      value="Đang chờ"
                      className="bg-[#F6B93B] text-white hover:border-[#F6B93B] hover:bg-white hover:text-[#F6B93B]"
                    >
                      Pending
                    </Radio.Button>
                    <Radio.Button
                      value="Đã duyệt"
                      className="bg-[#24A503] text-white hover:border-[#24A503] hover:bg-white hover:text-[#24A503]"
                    >
                      Approve
                    </Radio.Button>
                    <Radio.Button
                      value="Từ chối"
                      className="bg-[#E45959] text-white hover:border-[#E45959] hover:bg-white hover:text-[#E45959]"
                    >
                      Reject
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="response"
                  label="Phản hồi"
                  rules={[
                    { required: true, message: 'Vui lòng nhập phản hồi' }
                  ]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Viết phản hồi của bạn về báo cáo này..."
                  />
                </Form.Item>
              </Form>
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
}
