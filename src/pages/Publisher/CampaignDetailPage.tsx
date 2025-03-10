import React from 'react';
import { Button, Rate, Tabs, Collapse } from 'antd';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const CampaignDetailPage: React.FC = () => {
  // Dữ liệu chiến dịch (mock)
  const campaign = {
    id: 1,
    name: 'Tiệm cơm của Thịnh',
    rating: 4.2, // Rating trung bình
    ratingCount: 5432, // Số lượt đánh giá
    logoUrl: 'https://via.placeholder.com/80', // Logo placeholder
    summary: {
      hoaHong: '1,300,000',
      ngayMo: '21-02-2023',
      loai: 'CPS'
    }
  };

  // Ví dụ: xử lý khi bấm "Đăng ký"
  const handleRegister = () => {
    alert('Bạn vừa đăng ký chiến dịch!');
  };

  return (
    <div className="p-4">
      {/* Phần trên: Thông tin chính và Chiến dịch tương tự */}
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow md:flex-row">
        {/* Cột trái: Thông tin chiến dịch */}
        <div className="flex flex-col items-center border-r p-4 md:w-1/4">
          {/* Logo */}
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <img
              src={campaign.logoUrl}
              alt="logo"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Tên */}
          <h2 className="mt-2 text-center text-base font-semibold">
            {campaign.name}
          </h2>
          {/* Rating */}
          <div className="mt-2 flex items-center">
            <Rate
              disabled
              allowHalf
              value={campaign.rating}
              style={{ fontSize: '14px' }}
            />
            <span className="ml-2 text-sm text-gray-600">
              {campaign.ratingCount}
            </span>
          </div>
          {/* Nút đăng ký (hoặc Tạo link) */}
          <Button
            type="primary"
            className="mt-4 border-none bg-[#8229B0] hover:bg-[#6f2395]"
            onClick={handleRegister}
          >
            Đăng ký
          </Button>
          {/* Tóm tắt */}
          <div className="mt-4 w-full space-y-1 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Hoa hồng:</span>{' '}
              {campaign.summary.hoaHong}
            </div>
            <div>
              <span className="font-semibold">Ngày mở:</span>{' '}
              {campaign.summary.ngayMo}
            </div>
            <div>
              <span className="font-semibold">Loại:</span>{' '}
              {campaign.summary.loai}
            </div>
          </div>
        </div>

        {/* Cột phải: Chiến dịch tương tự */}
        <div className="p-4 md:w-3/4">
          <h3 className="mb-2 text-base font-semibold">Chiến dịch tương tự</h3>
          <div className="flex gap-4 overflow-x-auto">
            {/* Mock danh sách các chiến dịch tương tự */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex h-24 min-w-[100px] flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-500"
              >
                <span>Chiến dịch {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phần dưới: Tabs (Information, Product link, Feedbacks) */}
      <div className="mt-4 rounded-lg bg-white p-4 shadow">
        <Tabs defaultActiveKey="information">
          {/* Tab 1: Information */}
          <TabPane tab="Information" key="information">
            <Collapse
              bordered={false}
              className="mt-2"
              expandIconPosition="end"
            >
              <Panel header="Giới thiệu" key="1">
                <p>Nội dung giới thiệu về chiến dịch...</p>
              </Panel>
              <Panel header="Điều kiện ghi nhận" key="2">
                <p>Chi tiết điều kiện ghi nhận...</p>
              </Panel>
              <Panel header="Lý do hủy" key="3">
                <p>Các lý do có thể bị hủy...</p>
              </Panel>
              <Panel header="Chính sách Commission" key="4">
                <p>Thông tin chính sách hoa hồng, thanh toán...</p>
              </Panel>
              <Panel header="Lưu ý khác" key="5">
                <p>Một số lưu ý thêm về chiến dịch...</p>
              </Panel>
            </Collapse>
          </TabPane>

          {/* Tab 2: Product link */}
          <TabPane tab="Product link" key="product-link">
            <p>Danh sách link sản phẩm, banner, v.v. (nếu có)...</p>
          </TabPane>

          {/* Tab 3: Feedbacks */}
          <TabPane tab="Feedbacks" key="feedbacks">
            <p>Khu vực hiển thị nhận xét, đánh giá của người dùng...</p>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDetailPage;
