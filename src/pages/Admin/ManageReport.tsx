import React, { useState, useMemo } from 'react';
import {
  Button,
  Modal,
  Form,
  Radio,
  Descriptions,
  Card,
  Tag,
  Input
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import DataTable from '@/components/shared/data-table'; // Điều chỉnh path theo dự án của bạn
import { ColumnDef } from '@tanstack/react-table';

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

const initialReports: Report[] = [
  {
    id: 'RP00001',
    reporter: 'Nguyễn Khải Qui',
    reporterId: 'U12345',
    accused: 'Trần Văn B',
    accusedId: 'U67890',
    date: '10/10/2024',
    status: 'Đang chờ',
    reason: 'Vi phạm nội quy diễn đàn',
    evidence: 'example-image.jpg'
  }
];

// Gán màu cho Tag theo status
const statusTagColor: Record<string, string> = {
  'Đã duyệt': 'green',
  'Đang chờ': 'blue',
  'Từ chối': 'red'
};

export default function ReportTable() {
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (record: Report) => {
    setSelectedReport(record);
    form.setFieldsValue({
      status: record.status,
      response: ''
    });
    setIsModalOpen(true);
  };

  const handleSendResponse = () => {
    form.validateFields().then((values) => {
      console.log('Phản hồi gửi đi:', {
        ...selectedReport,
        newStatus: values.status,
        response: values.response
      });
      if (selectedReport) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === selectedReport.id ? { ...r, status: values.status } : r
          )
        );
      }
      setIsModalOpen(false);
    });
  };

  const filteredReports = useMemo(() => {
    const lower = search.toLowerCase();
    return reports.filter(
      (report) =>
        report.id.includes(search) ||
        report.reporter.toLowerCase().includes(lower)
    );
  }, [reports, search]);

  // Định nghĩa cột theo chuẩn ColumnDef của tanstack/react-table
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

  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Quản lý báo cáo</h2>

      {/* Sử dụng DataTable mới để hiển thị báo cáo với phân trang và tìm kiếm client-side */}
      <DataTable
        columns={columns}
        data={filteredReports}
        pageCount={-1} // -1 để DataTable tự tính số trang dựa trên dữ liệu
        pageSizeOptions={[5, 10, 20]}
        showAdd={false}
      />

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
