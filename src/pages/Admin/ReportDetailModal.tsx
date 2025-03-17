// ReportDetailModal.tsx
import React from 'react';
import { Modal, Descriptions, Card, Image } from 'antd';

interface ReportDetailModalProps {
  open: boolean;
  onClose: () => void;
  // Truyền thẳng object report đã có từ bảng
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
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  open,
  onClose,
  report
}) => {
  if (!report) return null;

  return (
    <Modal
      title="Chi tiết báo cáo"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Card bodyStyle={{ padding: 16 }}>
        <Descriptions
          bordered
          size="small"
          column={1}
          labelStyle={{ fontWeight: 'bold', width: 150 }}
        >
          <Descriptions.Item label="Mã báo cáo">{report.id}</Descriptions.Item>
          <Descriptions.Item label="Người báo cáo">
            {report.reporter} (ID: {report.reporterId})
          </Descriptions.Item>
          <Descriptions.Item label="Bị cáo">
            {report.accused} (ID: {report.accusedId})
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{report.date}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {report.status}
          </Descriptions.Item>
          <Descriptions.Item label="Lý do">{report.reason}</Descriptions.Item>
          <Descriptions.Item label="Bằng chứng">
            {report.evidence ? (
              <Image
                src={report.evidence}
                alt="Bằng chứng"
                style={{ maxHeight: 200 }}
              />
            ) : (
              'Không có'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
};

export default ReportDetailModal;
