import React from 'react';
import { Button, Rate, Tabs, Collapse } from 'antd';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;

// Custom arrow cho nút next
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', right: 10, zIndex: 1 }}
      onClick={onClick}
    >
      <RightOutlined style={{ fontSize: '24px', color: '#8229B0' }} />
    </div>
  );
};

// Custom arrow cho nút prev
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', left: 10, zIndex: 1 }}
      onClick={onClick}
    >
      <LeftOutlined style={{ fontSize: '24px', color: '#8229B0' }} />
    </div>
  );
};

const CampaignDetailPage: React.FC = () => {
  // Dữ liệu chiến dịch (mock)
  const campaign = {
    id: 1,
    name: 'Tiệm cơm của Thịnh',
    rating: 4.2,
    ratingCount: 5432,
    logoUrl:
      'https://i-giadinh.vnecdn.net/2024/03/07/7Honthinthnhphm1-1709800144-8583-1709800424.jpg',
    summary: {
      hoaHong: '1,300,000',
      ngayMo: '21-02-2023',
      loai: 'CPS'
    }
  };
  const imageUrls = [
    'https://i-giadinh.vnecdn.net/2024/03/07/7Honthinthnhphm1-1709800144-8583-1709800424.jpg',
    'https://i-giadinh.vnecdn.net/2023/11/11/Bc5Thnhphm15-1699693079-2955-1699693082.jpg',
    'https://images.baodantoc.vn/uploads/2023/Th%C3%A1ng%205/Ng%C3%A0y_17/Thanh/quan-com-tam-o-ha-noi-.jpg',
    'https://file.hstatic.net/1000394081/article/com-tam_e03b4325c9914def9d66619930a73432.jpg',
    'https://images2.thanhnien.vn/528068263637045248/2024/7/1/anh-man-hinh-2024-07-01-luc-113638-17198087615431007741437.png' // ... thêm ảnh thật hoặc placeholder khác
  ];

  const handleRegister = () => {
    alert('Bạn vừa đăng ký chiến dịch!');
  };

  // Animation variants cho framer-motion
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Cấu hình slider cho "Chiến dịch tương tự"
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        {/* Phần trên: Thông tin chính và chiến dịch tương tự */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg md:flex-row">
          {/* Cột trái: Thông tin chiến dịch */}
          <motion.div
            className="flex flex-col items-center border-r pr-6 md:w-1/3"
            whileHover={{ scale: 1.02 }}
          >
            {/* Logo */}
            <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-xl">
              <img
                src={campaign.logoUrl}
                alt="logo"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Tên */}
            <h2 className="mt-4 text-center text-xl font-bold text-gray-800">
              {campaign.name}
            </h2>
            {/* Rating */}
            <div className="mt-2 flex items-center">
              <Rate
                disabled
                allowHalf
                value={campaign.rating}
                style={{ fontSize: '16px' }}
              />
              <span className="ml-2 text-sm text-gray-600">
                {campaign.ratingCount}
              </span>
            </div>
            {/* Nút đăng ký */}
            <Button
              type="primary"
              onClick={handleRegister}
              className="mt-4 rounded-full border-none bg-[#9B52BF] bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:!border-[#9B52BF] hover:!bg-white hover:!text-[#9B52BF]"
            >
              Đăng ký
            </Button>
            {/* Tóm tắt */}
            <div className="mt-6 w-full space-y-2 text-sm text-gray-700">
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
          </motion.div>

          {/* Cột phải: Chiến dịch tương tự với slider */}
          <motion.div className="p-4 md:w-2/3" whileHover={{ scale: 1.02 }}>
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Chiến dịch tương tự
            </h3>
            <Slider {...sliderSettings}>
              {imageUrls.map((url, index) => (
                <div key={index} className="px-3">
                  <motion.div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl bg-white p-4 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={url}
                      alt={`Chiến dịch ${index + 1}`}
                      className="h-24 w-full rounded-md object-cover"
                    />
                    <p className="mt-2 text-sm font-medium text-gray-800">
                      Chiến dịch {index + 1}
                    </p>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </motion.div>
        </div>

        {/* Phần dưới: Tabs (Information, Product link, Feedbacks) */}
        <motion.div
          className="mb-10 mt-6 rounded-2xl bg-white p-6 shadow-lg"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Tabs defaultActiveKey="information" size="large" tabBarGutter={32}>
            {/* Tab 1: Information */}
            <TabPane tab="Information" key="information">
              <Collapse
                bordered={false}
                expandIconPosition="end"
                className="mt-4"
              >
                <Panel header="Giới thiệu" key="1">
                  <p className="text-gray-700">
                    Nội dung giới thiệu về chiến dịch...
                  </p>
                </Panel>
                <Panel header="Điều kiện ghi nhận" key="2">
                  <p className="text-gray-700">
                    Chi tiết điều kiện ghi nhận...
                  </p>
                </Panel>
                <Panel header="Lý do hủy" key="3">
                  <p className="text-gray-700">Các lý do có thể bị hủy...</p>
                </Panel>
                <Panel header="Chính sách Commission" key="4">
                  <p className="text-gray-700">
                    Thông tin chính sách hoa hồng, thanh toán...
                  </p>
                </Panel>
                <Panel header="Lưu ý khác" key="5">
                  <p className="text-gray-700">
                    Một số lưu ý thêm về chiến dịch...
                  </p>
                </Panel>
              </Collapse>
            </TabPane>

            {/* Tab 2: Product link */}
            <TabPane tab="Product link" key="product-link">
              <p className="mt-4 text-gray-700">
                Danh sách link sản phẩm, banner, v.v. (nếu có)...
              </p>
            </TabPane>

            {/* Tab 3: Feedbacks */}
            <TabPane tab="Feedbacks" key="feedbacks">
              <p className="mt-4 text-gray-700">
                Khu vực hiển thị nhận xét, đánh giá của người dùng...
              </p>
            </TabPane>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CampaignDetailPage;
