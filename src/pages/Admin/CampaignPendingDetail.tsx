import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Descriptions,
  Badge,
  Tag,
  Button,
  message
} from 'antd';
import 'antd/dist/reset.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Campaign {
  id: number;
  name: string;
  advertiserId: number;
  advertiserName: string;
  description: string;
  originUrl: string;
  budget: number;
  startDate: string;
  endDate: string;
  method: string; // CPC, CPA, CPS
  status: string; // Bị từ chối / Hoạt động / Chờ duyệt
  category: string; // Thực phẩm&Đồ uống, Du lịch& Nghỉ dưỡng, khác
  commissionType: string; // "VND" hoặc "%"
  commissionValue: number; // Số tiền hoa hồng hoặc %
  imageUrl: string; // Ảnh giả lập
}

// Dữ liệu giả lập
const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Mùa Hè Xanh',
    advertiserId: 101,
    advertiserName: 'FPT',
    description:
      'Chiến dịch quảng bá sản phẩm mùa hè xanh tươi mát, khuyến mãi cực lớn cho khách hàng mùa hè.',
    originUrl: 'https://example.com/mua-he-xanh',
    budget: 50000000,
    startDate: '10/10/2024',
    endDate: '10/12/2024',
    method: 'CPC',
    status: 'Chờ duyệt',
    category: 'Thực phẩm & Đồ uống',
    commissionType: 'VND',
    commissionValue: 30000,
    imageUrl:
      'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474053mvn/anh-anh-da-den-ca-khia-hai-huoc_035823284.jpeg'
  },
  {
    id: 2,
    name: 'Xuân Hy Vọng',
    advertiserId: 202,
    advertiserName: 'Viettel',
    description:
      'Khuyến mãi mùa xuân với nhiều ưu đãi hấp dẫn, hoàn tiền data và giảm giá gói cước.',
    originUrl: 'https://example.com/xuan-hy-vong',
    budget: 80000000,
    startDate: '01/01/2024',
    endDate: '30/03/2024',
    method: 'CPA',
    status: 'Chờ duyệt',
    category: 'Du lịch & Nghỉ dưỡng',
    commissionType: '%',
    commissionValue: 10,
    imageUrl:
      'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474053mvn/anh-anh-da-den-ca-khia-hai-huoc_035823284.jpeg'
  },
  {
    id: 3,
    name: 'Thu Vàng',
    advertiserId: 303,
    advertiserName: 'VinID',
    description:
      'Chiến dịch ưu đãi nạp tiền điện thoại, tích điểm đổi quà, mua sắm siêu thị tiện lợi.',
    originUrl: 'https://example.com/thu-vang',
    budget: 20000000,
    startDate: '15/08/2024',
    endDate: '15/10/2024',
    method: 'CPS',
    status: 'Chờ duyệt',
    category: 'khác',
    commissionType: '%',
    commissionValue: 5,
    imageUrl:
      'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474053mvn/anh-anh-da-den-ca-khia-hai-huoc_035823284.jpeg'
  }
];

const CampaignPendingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (id) {
      const found = initialCampaigns.find(
        (item) => item.id === parseInt(id, 10)
      );
      if (found) {
        setCampaign(found);
      }
    }
  }, [id]);

  if (!campaign) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="p-6">
          <Card>
            <Title level={4}>Không tìm thấy chiến dịch!</Title>
          </Card>
        </Content>
      </Layout>
    );
  }

  // Badge trạng thái
  let statusBadge;
  if (campaign.status === 'Hoạt động') {
    statusBadge = <Badge status="success" text="Hoạt động" />;
  } else if (campaign.status === 'Bị từ chối') {
    statusBadge = <Badge status="error" text="Bị từ chối" />;
  } else {
    // "Chờ duyệt" hoặc trạng thái khác
    statusBadge = <Badge status="warning" text="Chờ duyệt" />;
  }

  // Tag cho category
  const categoryTag = (
    <Tag color="blue" className="font-semibold">
      {campaign.category}
    </Tag>
  );
  const methodTag = (
    <Tag color="green" className="font-semibold">
      {campaign.method}
    </Tag>
  );

  // Commission hiển thị
  const commissionText =
    campaign.commissionType === '%'
      ? `${campaign.commissionValue}%`
      : `${campaign.commissionValue.toLocaleString()} VND`;

  // Nút Duyệt
  const handleApprove = () => {
    // Gọi API hoặc logic duyệt
    message.success(`Đã duyệt chiến dịch: ${campaign.name}`);
    navigate('/admin/campaigns');
  };

  // Nút Từ chối
  const handleReject = () => {
    // Gọi API hoặc logic từ chối
    message.error(`Đã từ chối chiến dịch: ${campaign.name}`);
    navigate('/admin/campaigns');
  };

  return (
    <Layout
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #f8fafc, #fff)' }}
    >
      <Content className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Thanh tiêu đề + nút Duyệt/Từ chối ở góc phải */}
          <div className="mb-6 flex items-center justify-between">
            <Title level={2} className="mb-0">
              Chi tiết chiến dịch (chưa chạy)
            </Title>
            <div className="space-x-3">
              <Button
                type="primary"
                onClick={handleApprove}
                className="border-none bg-green-600 hover:bg-green-700"
              >
                Duyệt
              </Button>
              <Button
                danger
                onClick={handleReject}
                className="hover:bg-red-600"
              >
                Từ chối
              </Button>
            </div>
          </div>

          <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}>
            {/* Cột trái */}
            <Col xs={24} md={8} style={{ display: 'flex' }}>
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow">
                {/* Gradient header */}
                <div
                  className="absolute left-0 right-0 top-0 h-16"
                  style={{
                    background:
                      'linear-gradient(120deg, #06b6d4, #3b82f6, #9333ea)'
                  }}
                />
                <div className="relative flex flex-1 flex-col p-5 pt-20">
                  {/* Ảnh */}
                  <div className="mb-4 flex justify-center">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      className="h-40 w-40 rounded-md object-cover shadow-md"
                    />
                  </div>
                  <Title level={4} className="mb-1">
                    {campaign.name}
                  </Title>
                  <Paragraph type="secondary" className="mb-2">
                    Nhà quảng cáo: {campaign.advertiserName}
                  </Paragraph>
                  <div className="flex flex-col gap-1 text-gray-700">
                    <Text>{statusBadge}</Text>
                    <Paragraph className="my-3 max-w-sm">
                      {campaign.description}
                    </Paragraph>
                    <div className="flex gap-1">
                      <Text>{categoryTag}</Text>
                      <Text>{methodTag}</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Cột phải */}
            <Col xs={24} md={16} style={{ display: 'flex' }}>
              <Card className="flex-1 shadow-md">
                <Title level={4} className="mb-4">
                  Thông tin chi tiết
                </Title>
                <Descriptions
                  bordered
                  column={1}
                  labelStyle={{ width: '200px', fontWeight: 'bold' }}
                >
                  <Descriptions.Item label="Mã chiến dịch">
                    {campaign.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="ID Nhà quảng cáo">
                    {campaign.advertiserId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hoa hồng">
                    {commissionText}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngân sách (Budget)">
                    {campaign.budget.toLocaleString()} VND
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày bắt đầu">
                    {campaign.startDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày kết thúc">
                    {campaign.endDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Origin URL">
                    <a
                      href={campaign.originUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 break-all hover:underline"
                    >
                      {campaign.originUrl}
                    </a>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CampaignPendingDetail;
