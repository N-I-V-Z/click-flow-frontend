import { useState } from 'react';
import { Table, Input, Button, Modal, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

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

export default function ReportTable() {
  const [search, setSearch] = useState('');
  const [reports] = useState(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (record: Report) => {
    setSelectedReport(record);
    setIsModalOpen(true);
  };

  const handleSendResponse = () => {
    form.validateFields().then((values) => {
      console.log('Phản hồi gửi đi:', {
        ...selectedReport,
        response: values.response
      });
      setIsModalOpen(false);
    });
  };

  const filteredReports = reports.filter(
    (report) =>
      report.id.includes(search) ||
      report.reporter.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<Report> = [
    {
      title: 'Mã báo cáo',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'Tên người báo cáo',
      dataIndex: 'reporter',
      key: 'reporter',
      sorter: (a, b) => a.reporter.localeCompare(b.reporter)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã duyệt', value: 'Đã duyệt' },
        { text: 'Đang chờ', value: 'Đang chờ' },
        { text: 'Từ chối', value: 'Từ chối' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleOpenModal(record)}
        />
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Tìm kiếm theo mã báo cáo hoặc tên người báo cáo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredReports}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={<div className="text-lg font-semibold">Phản hồi báo cáo</div>}
        open={isModalOpen}
        onOk={handleSendResponse}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{
          className: 'bg-[#7F56D9] text-white border-none'
        }}
      >
        {selectedReport && (
          <div className="space-y-2">
            <div className="text-gray-500">
              {selectedReport.id} - {selectedReport.date}
            </div>
            <div>
              <strong>Người báo cáo:</strong> {selectedReport.reporter} (ID:{' '}
              {selectedReport.reporterId})
            </div>
            <div>
              <strong>Bị cáo:</strong> {selectedReport.accused} (ID:{' '}
              {selectedReport.accusedId})
            </div>
            <div>
              <strong>Lý do:</strong> {selectedReport.reason}
            </div>
            <div>
              <strong>Bằng chứng:</strong>
            </div>
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
            <Form form={form} layout="vertical" className="mt-4">
              <Form.Item
                name="response"
                label="Phản hồi"
                rules={[{ required: true, message: 'Vui lòng nhập phản hồi' }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Viết phản hồi của bạn về báo cáo này..."
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
}
