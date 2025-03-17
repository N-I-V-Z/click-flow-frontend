// ReportResponseModal.tsx
import React, { useEffect } from 'react';
import { Modal, Card, Descriptions, Form, Radio, Input } from 'antd';

interface ReportResponseModalProps {
  open: boolean;
  onClose: () => void;
  // Truyền thẳng object report đã có
  report: {
    id: string;
    reporter: string;
    reporterId: string;
    accused: string;
    accusedId: string;
    date: string;
    status: string;
    reason: string;
    evidence: string;
  } | null;
  // Hàm submit (để gọi API update hoặc update cục bộ)
  onSubmit: (newStatus: string, response: string) => void;
}

const ReportResponseModal: React.FC<ReportResponseModalProps> = ({
  open,
  onClose,
  report,
  onSubmit
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Mỗi khi mở modal, set lại form
    if (report) {
      form.setFieldsValue({
        status: report.status,
        response: ''
      });
    }
  }, [report, form]);

  if (!report) return null;

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values.status, values.response);
    });
  };

  return (
    <Modal
      title="Phản hồi báo cáo"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={1000}
      bodyStyle={{
        padding: 24,
        maxHeight: '70vh',
        overflowY: 'auto',
        display: 'flex',
        gap: 16
      }}
    >
      <Card
        bordered={false}
        className="rounded-md bg-gray-50 shadow-sm"
        style={{ flex: 1 }}
        bodyStyle={{ padding: 16 }}
      >
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Mã báo cáo">{report.id}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{report.date}</Descriptions.Item>
          <Descriptions.Item label="Người báo cáo">
            {report.reporter} (ID: {report.reporterId})
          </Descriptions.Item>
          <Descriptions.Item label="Bị cáo">
            {report.accused} (ID: {report.accusedId})
          </Descriptions.Item>
          <Descriptions.Item label="Lý do">{report.reason}</Descriptions.Item>
          <Descriptions.Item label="Bằng chứng">
            {report.evidence ? (
              <img
                src={report.evidence}
                alt="Bằng chứng"
                className="max-h-60 w-full rounded-lg border border-gray-300 object-contain"
              />
            ) : (
              'Không có'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

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
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Radio.Group>
              <Radio.Button value="Đang chờ">Pending</Radio.Button>
              <Radio.Button value="Đã duyệt">Approve</Radio.Button>
              <Radio.Button value="Từ chối">Reject</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="response"
            label="Phản hồi"
            rules={[{ required: true, message: 'Vui lòng nhập phản hồi' }]}
          >
            <Input.TextArea rows={6} placeholder="Nội dung phản hồi..." />
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default ReportResponseModal;
