import React from 'react';
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
  message,
  Modal
} from 'antd';
import 'antd/dist/reset.css';

import {
  useGetCampaignById,
  useUpdateCampaignStatus
} from '@/queries/campaign.query';
import { ApiResponse, Campaign, CampaignApiResponse } from '@/types';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

const CampaignPendingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hook lấy chi tiết campaign theo ID
  const { data, isLoading, error } = useGetCampaignById(Number(id));
  // Hook cập nhật trạng thái
  const { mutate: updateCampaignStatus } = useUpdateCampaignStatus();

  // Loading
  if (isLoading) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="p-6">
          <Card>
            <Title level={4}>Đang tải dữ liệu chiến dịch...</Title>
          </Card>
        </Content>
      </Layout>
    );
  }

  // Lỗi
  if (error) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="p-6">
          <Card>
            <Title level={4}>Đã có lỗi xảy ra khi tải chiến dịch!</Title>
          </Card>
        </Content>
      </Layout>
    );
  }

  // Lấy đối tượng campaign từ API
  const apiCampaign = (data as ApiResponse<CampaignApiResponse>)?.result;
  if (!apiCampaign) {
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

  // Map dữ liệu API -> interface Campaign (tuỳ theo trường backend)
  const campaign: Campaign = {
    id: apiCampaign.id,
    name: apiCampaign.name,
    advertiserId: apiCampaign.advertiserId,
    advertiserName: apiCampaign.advertiser.applicationUser.fullName ?? '',
    description: apiCampaign.description,
    originUrl: apiCampaign.originURL,
    budget: apiCampaign.budget,
    startDate: apiCampaign.startDate.toUTCString(),
    endDate: apiCampaign.endDate.toUTCString(),
    method: apiCampaign.typePay,
    status: apiCampaign.status,
    category: apiCampaign.typeCampaign,
    commissionType: apiCampaign.percents ? '%' : 'VND',
    commissionValue: apiCampaign.percents ?? apiCampaign.commission,
    imageUrl: apiCampaign.image
  };

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

  // Tag cho category và method
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

  // Hoa hồng
  const commissionText =
    campaign.commissionType === '%'
      ? `${campaign.commissionValue}%`
      : `${campaign.commissionValue?.toLocaleString()} VND`;

  // Hỏi xác nhận và cập nhật status
  const confirmUpdateStatus = (action: 'approve' | 'reject') => {
    confirm({
      title: action === 'approve' ? 'Duyệt chiến dịch?' : 'Từ chối chiến dịch?',
      content:
        action === 'approve'
          ? `Bạn có chắc muốn duyệt chiến dịch: "${campaign.name}"?`
          : `Bạn có chắc muốn từ chối chiến dịch: "${campaign.name}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        const newStatus = action === 'approve' ? 'Approved' : 'Canceled';
        updateCampaignStatus(
          { id: campaign.id, status: newStatus },
          {
            onSuccess: () => {
              message.success(
                action === 'approve'
                  ? `Đã duyệt chiến dịch: ${campaign.name}`
                  : `Đã từ chối chiến dịch: ${campaign.name}`
              );
              // Đợi 1 giây rồi chuyển hướng
              setTimeout(() => {
                navigate('/admin/campaignrequest');
              }, 1000);
            },
            onError: () => {
              message.error('Cập nhật trạng thái thất bại!');
            }
          }
        );
      }
    });
  };

  // Xử lý nút Duyệt
  const handleApprove = () => {
    confirmUpdateStatus('approve');
  };

  // Xử lý nút Từ chối
  const handleReject = () => {
    confirmUpdateStatus('reject');
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
                      src={campaign.imageUrl ?? ''}
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
