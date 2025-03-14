import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Descriptions,
  Badge,
  Tag
} from 'antd';
import CampaignAnalytics from './CampaignAnalytics';
import 'antd/dist/reset.css';
import TrafficTable from './TrafficTable';

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
  status: string; // Bị từ chối / Hoạt động
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
    status: 'Hoạt động',
    category: 'Thực phẩm & Đồ uống',
    commissionType: 'VND',
    commissionValue: 30000,
    // Ảnh demo
    imageUrl:
      'https://scontent.fsgn2-10.fna.fbcdn.net/v/t1.6435-9/102261488_3013160935447101_2486117098089648848_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFL06L37otu4aihgigVt_Vzbd0evSjrMeNt3R69KOsx45lz77Dr1YnFjPPFgY4HyY3HCMgr6puvYhwYiVwo233f&_nc_ohc=r6XQ265M_D8Q7kNvgH_Lp_y&_nc_oc=AdgGjcdzyQWyMcQE5FJM0l6-0kEUPGZ27qmC1yMhfugdpEytiieZeZZ5M_1DuRRSE8s&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=ANHmj0Jal0w23mnx-O69mb1&oh=00_AYH1HgcgHJbObIqrtwBiFVMH1BZkV4IwsFopEYyZdosP6w&oe=67F730AE'
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
    status: 'Hoạt động',
    category: 'Du lịch & Nghỉ dưỡng',
    commissionType: '%',
    commissionValue: 10,
    imageUrl:
      'https://scontent.fsgn2-10.fna.fbcdn.net/v/t1.6435-9/102261488_3013160935447101_2486117098089648848_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFL06L37otu4aihgigVt_Vzbd0evSjrMeNt3R69KOsx45lz77Dr1YnFjPPFgY4HyY3HCMgr6puvYhwYiVwo233f&_nc_ohc=r6XQ265M_D8Q7kNvgH_Lp_y&_nc_oc=AdgGjcdzyQWyMcQE5FJM0l6-0kEUPGZ27qmC1yMhfugdpEytiieZeZZ5M_1DuRRSE8s&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=ANHmj0Jal0w23mnx-O69mb1&oh=00_AYH1HgcgHJbObIqrtwBiFVMH1BZkV4IwsFopEYyZdosP6w&oe=67F730AE'
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
    status: 'Bị từ chối',
    category: 'khác',
    commissionType: '%',
    commissionValue: 5,
    imageUrl:
      'https://scontent.fsgn2-10.fna.fbcdn.net/v/t1.6435-9/102261488_3013160935447101_2486117098089648848_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFL06L37otu4aihgigVt_Vzbd0evSjrMeNt3R69KOsx45lz77Dr1YnFjPPFgY4HyY3HCMgr6puvYhwYiVwo233f&_nc_ohc=r6XQ265M_D8Q7kNvgH_Lp_y&_nc_oc=AdgGjcdzyQWyMcQE5FJM0l6-0kEUPGZ27qmC1yMhfugdpEytiieZeZZ5M_1DuRRSE8s&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=ANHmj0Jal0w23mnx-O69mb1&oh=00_AYH1HgcgHJbObIqrtwBiFVMH1BZkV4IwsFopEYyZdosP6w&oe=67F730AE'
  }
];

const CampaignDetail: React.FC = () => {
  const { id } = useParams();
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
  const statusBadge =
    campaign.status === 'Hoạt động' ? (
      <Badge status="success" text="Hoạt động" />
    ) : (
      <Badge status="error" text="Bị từ chối" />
    );

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

  return (
    <Layout
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #f8fafc, #fff)' }}
    >
      <Content className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Tiêu đề trang */}
          <Title level={2} className="mb-6">
            Chi tiết chiến dịch
          </Title>

          {/* Dùng alignItems: 'stretch' để 2 cột cân chiều cao */}
          <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}>
            {/* Cột trái: flex container để card full height */}
            <Col xs={24} md={8} style={{ display: 'flex' }}>
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow">
                {/* Gradient header (chiều cao nhỏ hơn) */}
                <div
                  className="absolute left-0 right-0 top-0 h-16"
                  style={{
                    background:
                      'linear-gradient(120deg,rgb(6, 6, 212),rgb(166, 40, 201),rgb(174, 102, 241))'
                  }}
                />
                {/* Nội dung card: p-5, pt-20 để đẩy xuống dưới gradient */}
                <div className="relative flex flex-1 flex-col p-5 pt-20 ">
                  {/* Ảnh nằm giữa, bo góc, bóng đổ */}
                  <div className=" flex flex-col items-center justify-center">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.name}
                      className="mb-4 h-40 w-40 rounded-md object-cover shadow-md "
                    />
                  </div>

                  <Title level={4}>
                    <h3>{campaign.name}</h3>
                  </Title>
                  <Paragraph type="secondary" className="mb-3">
                    Nhà quảng cáo: {campaign.advertiserName}
                  </Paragraph>

                  {/* Một vài thông tin tóm tắt, KHÔNG label */}
                  <div className="flex flex-col gap-1 text-gray-700">
                    <Text>{statusBadge}</Text>
                    {/* Mô tả ngắn (nếu cần) */}
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

            {/* Cột phải: cũng stretch */}
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
      <CampaignAnalytics />
      <div className="mb-10">
        <TrafficTable campaignId={campaign.id} />
      </div>
    </Layout>
  );
};

export default CampaignDetail;
