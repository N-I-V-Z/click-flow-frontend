import React, { useState } from 'react';
import { Form, Select, Button, Pagination, Modal } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;

interface Campaign {
  id: number;
  name: string;
  commission: string; // Hoa hồng (VD: "5%" hoặc "10.000 VNĐ")
  conversion: number; // Số chuyển đổi
  locked: boolean; // true = đã bị khóa
  isRunning: boolean; // true = đang chạy
  isRegistered: boolean; // true = đã đăng ký
  industryGroup: string; // nhóm ngành hàng (VD: "Thực phẩm & đồ uống")
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
    locked: true, // Bị khóa
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
  }
  // ...có thể thêm nhiều hơn để test phân trang
];

const PAGE_SIZE = 18; // 3 dòng x 6 cột

const CampaignsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [campaigns, setCampaigns] = useState<Campaign[]>(fakeCampaigns);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State để mở/đóng Modal xác nhận đăng ký
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

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

  // Xử lý phân trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Lấy dữ liệu chiến dịch thuộc trang hiện tại
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  // Xử lý form filter
  const onFinish = (values: any) => {
    // values: { status, group, industry, type }
    let filtered = [...fakeCampaigns];

    // Trạng thái (đang hoạt động hoặc bị khóa)
    if (values.status === 'active') {
      filtered = filtered.filter((c) => !c.locked);
    } else if (values.status === 'locked') {
      filtered = filtered.filter((c) => c.locked);
    }

    // Nhóm ngành hàng
    if (values.group && values.group !== 'all') {
      filtered = filtered.filter((c) => c.industryGroup === values.group);
    }

    // Ngành hàng (đang chạy / chưa chạy)
    if (values.industryStatus === 'running') {
      filtered = filtered.filter((c) => c.isRunning === true);
    } else if (values.industryStatus === 'not_running') {
      filtered = filtered.filter((c) => c.isRunning === false);
    }

    // Loại hình
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
    <div className="p-4">
      {/* Form Lọc chiến dịch */}
      <div className="mb-4 rounded-lg border bg-white p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          {/* Trạng thái */}
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Đang hoạt động</Option>
              <Option value="locked">Đã bị khóa</Option>
            </Select>
          </Form.Item>

          {/* Nhóm ngành hàng */}
          <Form.Item name="group" label="Nhóm ngành hàng">
            <Select placeholder="Chọn nhóm ngành hàng">
              <Option value="all">Tất cả</Option>
              <Option value="Thực phẩm & đồ uống">Thực phẩm & đồ uống</Option>
              <Option value="Du lịch & nghỉ dưỡng">Du lịch & nghỉ dưỡng</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          {/* Ngành hàng (Đang chạy / Chưa chạy) */}
          <Form.Item name="industryStatus" label="Ngành hàng">
            <Select placeholder="Chọn trạng thái chạy">
              <Option value="running">Đang chạy</Option>
              <Option value="not_running">Chưa chạy</Option>
            </Select>
          </Form.Item>

          {/* Loại hình */}
          <Form.Item name="type" label="Loại hình">
            <Select placeholder="Chọn loại hình">
              <Option value="all">Tất cả</Option>
              <Option value="CPC">CPC</Option>
              <Option value="CPA">CPA</Option>
              <Option value="CPS">CPS</Option>
            </Select>
          </Form.Item>

          <div className="col-span-1 flex gap-2 md:col-span-4">
            <Button onClick={onReset}>Đặt lại</Button>
            <Button type="primary" htmlType="submit">
              Áp dụng
            </Button>
          </div>
        </Form>
      </div>

      {/* Danh sách chiến dịch (3 dòng x 6 cột = 18 item/trang) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {currentCampaigns.map((campaign) => {
          const isLocked = campaign.locked;
          const isRegistered = campaign.isRegistered;
          const isRunning = campaign.isRunning;

          // Giả lập rating, ratingCount, conversions hiển thị như ảnh mẫu
          // (4,28 ★ (323) | 577.866)
          // Bạn có thể thay logic này bằng data thật nếu có
          const rating = 4.28;
          const ratingCount = 323;
          const totalConversion = 577866;

          return (
            <div
              key={campaign.id}
              className={`flex flex-col items-center rounded-lg border bg-white p-4 
                ${isLocked ? 'pointer-events-none opacity-50' : ''}`}
            >
              {/* Logo 4x4 */}
              <div className="h-40 w-40 overflow-hidden rounded-full">
                <img
                  src="https://content.accesstrade.vn/adv/1735897487_avatar_1735897487.png"
                  alt="logo"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Tên chiến dịch */}
              <h3 className="mt-2 line-clamp-2 text-center text-sm font-semibold text-gray-800">
                {campaign.name}
              </h3>

              {/* Hoa hồng */}
              <div className="mt-2 text-sm text-gray-600">Hoa hồng</div>
              <div className="text-lg font-bold text-[#8229B0]">
                {campaign.commission}
              </div>

              {/* Rating + conversions (4,28 ★ (323) | 577.866) */}
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                <span>{rating.toFixed(2).replace('.', ',')}</span>
                {/* Icon ngôi sao */}
                <svg
                  className="text-yellow-400 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.189 3.674a1 1 0 00.95.69h3.862c.969 0 1.37 1.24.588 1.81l-3.127 2.27a1 1 0 00-.363 1.118l1.2 3.697c.29.894-.755 1.63-1.54 1.081l-3.105-2.186a1 1 0 00-1.157 0l-3.105 2.186c-.785.55-1.83-.187-1.54-1.08l1.2-3.698a1 1 0 00-.363-1.118L2.5 9.1c-.781-.57-.38-1.81.589-1.81h3.862a1 1 0 00.95-.69l1.148-3.673z" />
                </svg>
                <span>({ratingCount})</span>
                <span className="mx-1 text-gray-400">|</span>
                <span>
                  {totalConversion.toLocaleString('vi-VN')} {/* 577.866 */}
                </span>
              </div>

              {/* Nút hành động */}
              {isLocked ? (
                <p className="text-red-500 mt-3">Đã bị khóa</p>
              ) : (
                <div className="mt-3 w-full">
                  {isRegistered && isRunning ? (
                    <Button
                      type="default"
                      className="w-full border-none bg-[#8229B0] text-white hover:bg-[#6f2395]"
                    >
                      Tạo link
                    </Button>
                  ) : (
                    <Button
                      type="default"
                      className="w-full border-none bg-[#8229B0] text-white hover:bg-[#6f2395]"
                      onClick={() => handleRegisterClick(campaign.id)}
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

      {/* Phân trang */}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={campaigns.length}
          onChange={handlePageChange}
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
      >
        <p>Bạn có chắc muốn đăng ký chiến dịch này không?</p>
      </Modal>
    </div>
  );
};

export default CampaignsPage;
