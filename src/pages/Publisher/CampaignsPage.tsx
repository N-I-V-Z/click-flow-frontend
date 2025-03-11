import React, { useState } from 'react';
import { Form, Select, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

import PaginationSection from '@/components/shared/pagination-section';

const { Option } = Select;

interface Campaign {
  id: number;
  name: string;
  commission: string; // Hoa hồng (VD: "5%" hoặc "10.000 VNĐ")
  conversion: number; // Số chuyển đổi
  locked: boolean; // true = đã bị khóa
  isRunning: boolean; // true = đang chạy
  isRegistered: boolean; // true = đã đăng ký
  industryGroup: string; // Nhóm ngành hàng (VD: "Thực phẩm & đồ uống")
  industryStatus: string; // "Đang chạy" hoặc "Chưa chạy"
  type: string; // Loại hình (CPC, CPA, CPS)
}

// Fake data cho demo
const fakeCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Chiến dịch A',
    commission: '5%',
    conversion: 123,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Đang chạy',
    type: 'CPC'
  },
  {
    id: 2,
    name: 'Chiến dịch B',
    commission: '10.000 VNĐ',
    conversion: 45,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 3,
    name: 'Chiến dịch C',
    commission: '5%',
    conversion: 78,
    locked: true,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Chưa chạy',
    type: 'CPS'
  },
  {
    id: 4,
    name: 'Chiến dịch D',
    commission: '5%',
    conversion: 90,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Đang chạy',
    type: 'CPS'
  },
  {
    id: 5,
    name: 'Chiến dịch E',
    commission: '8%',
    conversion: 10,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPC'
  },
  {
    id: 6,
    name: 'Chiến dịch F',
    commission: '5%',
    conversion: 120,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 7,
    name: 'Chiến dịch G',
    commission: '6%',
    conversion: 140,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Chưa chạy',
    type: 'CPC'
  },
  {
    id: 8,
    name: 'Chiến dịch H',
    commission: '7%',
    conversion: 11,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 9,
    name: 'Chiến dịch I',
    commission: '5%',
    conversion: 25,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Khác',
    industryStatus: 'Đang chạy',
    type: 'CPS'
  },
  {
    id: 10,
    name: 'Chiến dịch J',
    commission: '5%',
    conversion: 33,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Chưa chạy',
    type: 'CPC'
  },
  {
    id: 11,
    name: 'Chiến dịch K',
    commission: '8%',
    conversion: 99,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 12,
    name: 'Chiến dịch L',
    commission: '5%',
    conversion: 71,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Khác',
    industryStatus: 'Đang chạy',
    type: 'CPS'
  },
  {
    id: 14,
    name: 'Chiến dịch N',
    commission: '7%',
    conversion: 80,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPS'
  },
  {
    id: 15,
    name: 'Chiến dịch O',
    commission: '5%',
    conversion: 110,
    locked: false,
    isRunning: true,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Đang chạy',
    type: 'CPC'
  },
  {
    id: 16,
    name: 'Chiến dịch P',
    commission: '10.000 VNĐ',
    conversion: 60,
    locked: true,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 17,
    name: 'Chiến dịch Q',
    commission: '8%',
    conversion: 200,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Đang chạy',
    type: 'CPS'
  },
  {
    id: 18,
    name: 'Chiến dịch R',
    commission: '5%',
    conversion: 95,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Chưa chạy',
    type: 'CPC'
  },
  {
    id: 19,
    name: 'Chiến dịch S',
    commission: '6%',
    conversion: 120,
    locked: false,
    isRunning: true,
    isRegistered: false,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Đang chạy',
    type: 'CPA'
  },
  {
    id: 20,
    name: 'Chiến dịch T',
    commission: '7%',
    conversion: 75,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPS'
  },
  {
    id: 21,
    name: 'Chiến dịch U',
    commission: '5%',
    conversion: 85,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Khác',
    industryStatus: 'Đang chạy',
    type: 'CPC'
  },
  {
    id: 22,
    name: 'Chiến dịch V',
    commission: '10.000 VNĐ',
    conversion: 65,
    locked: true,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 23,
    name: 'Chiến dịch W',
    commission: '8%',
    conversion: 130,
    locked: false,
    isRunning: true,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Đang chạy',
    type: 'CPS'
  },
  {
    id: 24,
    name: 'Chiến dịch X',
    commission: '5%',
    conversion: 100,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Chưa chạy',
    type: 'CPC'
  },
  {
    id: 25,
    name: 'Chiến dịch Y',
    commission: '6%',
    conversion: 140,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Đang chạy',
    type: 'CPA'
  },
  {
    id: 26,
    name: 'Chiến dịch Z',
    commission: '7%',
    conversion: 90,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Chưa chạy',
    type: 'CPS'
  },
  {
    id: 27,
    name: 'Chiến dịch 27',
    commission: '5%',
    conversion: 110,
    locked: false,
    isRunning: true,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Đang chạy',
    type: 'CPC'
  },
  {
    id: 28,
    name: 'Chiến dịch 28',
    commission: '8%',
    conversion: 70,
    locked: true,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Thực phẩm & đồ uống',
    industryStatus: 'Chưa chạy',
    type: 'CPA'
  },
  {
    id: 29,
    name: 'Chiến dịch 29',
    commission: '10.000 VNĐ',
    conversion: 95,
    locked: false,
    isRunning: true,
    isRegistered: true,
    industryGroup: 'Du lịch & nghỉ dưỡng',
    industryStatus: 'Đang chạy',
    type: 'CPS'
  },
  {
    id: 30,
    name: 'Chiến dịch 30',
    commission: '6%',
    conversion: 85,
    locked: false,
    isRunning: false,
    isRegistered: false,
    industryGroup: 'Khác',
    industryStatus: 'Chưa chạy',
    type: 'CPC'
  }
];

const PAGE_SIZE = 8;

const CampaignsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [campaigns, setCampaigns] = useState<Campaign[]>(fakeCampaigns);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State để mở/đóng Modal xác nhận đăng ký
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

  const navigate = useNavigate();

  // Xử lý bấm nút "Đăng ký"
  const handleRegisterClick = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setIsModalVisible(true);
  };

  // Xác nhận đăng ký chiến dịch
  const handleConfirmRegister = () => {
    if (selectedCampaignId !== null) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === selectedCampaignId
            ? { ...c, isRegistered: true, isRunning: true }
            : c
        )
      );
    }
    setIsModalVisible(false);
    setSelectedCampaignId(null);
  };

  // Hủy đăng ký (đóng modal)
  const handleCancelRegister = () => {
    setIsModalVisible(false);
    setSelectedCampaignId(null);
  };

  // Lấy dữ liệu chiến dịch thuộc trang hiện tại
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  // Xử lý form filter
  const onFinish = (values: any) => {
    let filtered = [...fakeCampaigns];
    if (values.status === 'active') {
      filtered = filtered.filter((c) => !c.locked);
    } else if (values.status === 'locked') {
      filtered = filtered.filter((c) => c.locked);
    }
    if (values.group && values.group !== 'all') {
      filtered = filtered.filter((c) => c.industryGroup === values.group);
    }
    if (values.industryStatus === 'running') {
      filtered = filtered.filter((c) => c.isRunning === true);
    } else if (values.industryStatus === 'not_running') {
      filtered = filtered.filter((c) => c.isRunning === false);
    }
    if (values.type && values.type !== 'all') {
      filtered = filtered.filter((c) => c.type === values.type);
    }
    setCampaigns(filtered);
    setCurrentPage(1);
  };

  // Đặt lại form filter
  const onReset = () => {
    form.resetFields();
    setCampaigns(fakeCampaigns);
    setCurrentPage(1);
  };

  return (
    // BỎ overflow-auto ở đây
    <div className="bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Danh sách Chiến dịch
      </h1>

      {/* Form Lọc chiến dịch */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
        >
          <Form.Item name="status " label="Trạng thái">
            <Select placeholder="Chọn trạng thái" allowClear>
              <Option value="active">Đang hoạt động</Option>
              <Option value="locked">Đã bị khóa</Option>
            </Select>
          </Form.Item>
          <Form.Item name="group" label="Nhóm ngành hàng">
            <Select placeholder="Chọn nhóm ngành hàng" allowClear>
              <Option value="all">Tất cả</Option>
              <Option value="Thực phẩm & đồ uống">Thực phẩm & đồ uống</Option>
              <Option value="Du lịch & nghỉ dưỡng">Du lịch & nghỉ dưỡng</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="industryStatus" label="Trạng thái chạy">
            <Select placeholder="Chọn trạng thái chạy" allowClear>
              <Option value="running">Đang chạy</Option>
              <Option value="not_running">Chưa chạy</Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại hình">
            <Select placeholder="Chọn loại hình" allowClear>
              <Option value="all">Tất cả</Option>
              <Option value="CPC">CPC</Option>
              <Option value="CPA">CPA</Option>
              <Option value="CPS">CPS</Option>
            </Select>
          </Form.Item>
          <div className="col-span-1 flex items-end gap-2 sm:col-span-4">
            <Button
              className="hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]"
              onClick={onReset}
            >
              Đặt lại
            </Button>
            <Button
              className="bg-[#9B52BF] text-white hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]"
              htmlType="submit"
            >
              Áp dụng
            </Button>
          </div>
        </Form>
      </div>

      {/* Danh sách chiến dịch */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {currentCampaigns.map((campaign) => {
          const isLocked = campaign.locked;
          const isRegistered = campaign.isRegistered;
          const isRunning = campaign.isRunning;
          const rating = 4.28;
          const ratingCount = 323;
          const totalConversion = 577866;

          return (
            <div
              key={campaign.id}
              className={`flex flex-col items-center rounded-lg bg-white p-4 shadow transition-transform duration-300 
              ${!isLocked ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'pointer-events-none opacity-50'}`}
              onClick={() =>
                navigate(`/publisher/campaign-detail/${campaign.id}`)
              }
            >
              {/* Logo */}
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                <img
                  src="https://content.accesstrade.vn/adv/1735897487_avatar_1735897487.png"
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Tên chiến dịch */}
              <h3 className="mb-2 line-clamp-2 text-center text-sm font-semibold text-gray-800">
                {campaign.name}
              </h3>
              {/* Hoa hồng */}
              <div className="mb-1 text-sm text-gray-600">Hoa hồng</div>
              <div className="mb-2 text-lg font-bold text-[#8229B0]">
                {campaign.commission}
              </div>
              {/* Rating + conversions */}
              <div className="mb-3 flex items-center gap-1 text-sm text-gray-600">
                <span>{rating.toFixed(2).replace('.', ',')}</span>
                <svg
                  className="text-yellow-400 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.189 3.674a1 1 0 00.95.69h3.862c.969 0 1.37 1.24.588 1.81l-3.127 2.27a1 1 0 00-.363 1.118l1.2 3.697c.29.894-.755 1.63-1.54 1.081l-3.105-2.186a1 1 0 00-1.157 0l-3.105 2.186c-.785.55-1.83-.187-1.54-1.08l1.2-3.698a1 1 0 00-.363-1.118L2.5 9.1c-.781-.57-.38-1.81.589-1.81h3.862a1 1 0 00.95-.69l1.148-3.673z" />
                </svg>
                <span>({ratingCount})</span>
                <span className="mx-1 text-gray-400">|</span>
                <span>{totalConversion.toLocaleString('vi-VN')}</span>
              </div>
              {/* Nút hành động */}
              {isLocked ? (
                <p className="text-red-500 mt-2 font-medium">Đã bị khóa</p>
              ) : (
                <div className="w-full">
                  {isRegistered && isRunning ? (
                    <Button
                      type="default"
                      className="w-full bg-[#8229B0] text-white hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Tạo link
                    </Button>
                  ) : (
                    <Button
                      type="default"
                      className="w-full bg-[#8229B0] text-white hover:!border-[#9B52BF] hover:bg-white hover:!text-[#9B52BF]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegisterClick(campaign.id);
                      }}
                    >
                      Đăng ký
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Phân trang với component PaginationSection */}
      <div className="mb-8 mt-4">
        <PaginationSection
          totalPosts={campaigns.length}
          postsPerPage={PAGE_SIZE}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Modal xác nhận đăng ký */}
      <Modal
        title="Xác nhận đăng ký"
        visible={isModalVisible}
        onOk={handleConfirmRegister}
        onCancel={handleCancelRegister}
        okText="Đồng ý"
        cancelText="Hủy"
        //9B52BF
        okButtonProps={{
          className: 'bg-[#9B52BF] text-white border-[#9B52BF]'
        }}
      >
        <p>Bạn có chắc muốn đăng ký chiến dịch này không?</p>
      </Modal>
    </div>
  );
};

export default CampaignsPage;
