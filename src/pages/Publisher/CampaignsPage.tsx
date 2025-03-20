import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

import PaginationSection from '@/components/shared/pagination-section';
import { useGetCampaignsJoinedByPublisher } from '@/queries/campaign.query'; // HOOK bạn vừa sửa/viết

const { Option } = Select;

// Page size mặc định
const PAGE_SIZE = 8;

const CampaignsPage: React.FC = () => {
  const [form] = Form.useForm();
  // Thay vì lưu campaigns cứng, ta sẽ lưu state để filter phía client
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // State trang hiện tại
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State cho Modal
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

  // Giả sử publisherId = 1
  const publisherId = 1;

  // Gọi hook lấy data từ API
  const {
    data: campaignsResponse,
    isLoading,
    isError
  } = useGetCampaignsJoinedByPublisher(publisherId, currentPage, PAGE_SIZE);

  const navigate = useNavigate();

  // Mỗi khi gọi API xong, set lại campaigns
  useEffect(() => {
    if (campaignsResponse?.result.datas) {
      // campaignsResponse.result là mảng campaign
      setCampaigns(campaignsResponse.result.datas);
    }
  }, [campaignsResponse]);

  // Xử lý nút "Đăng ký"
  const handleRegisterClick = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setIsModalVisible(true);
  };

  // Xác nhận đăng ký
  const handleConfirmRegister = () => {
    if (selectedCampaignId !== null) {
      // Ví dụ update tạm phía client: set isRegistered = true
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

  // Hủy đăng ký
  const handleCancelRegister = () => {
    setIsModalVisible(false);
    setSelectedCampaignId(null);
  };

  // Lọc (filter) phía client
  const onFinish = (values: any) => {
    if (!campaignsResponse?.result.datas) return;
    let filtered = [...campaignsResponse.result.datas];

    // 1) Lọc trạng thái khoá
    if (values.status === 'active') {
      filtered = filtered.filter((c) => c.locked === false);
    } else if (values.status === 'locked') {
      filtered = filtered.filter((c) => c.locked === true);
    }

    // 2) Lọc nhóm ngành
    if (values.group && values.group !== 'all') {
      filtered = filtered.filter((c) => c.industryGroup === values.group);
    }

    // 3) Lọc trạng thái chạy
    if (values.industryStatus === 'running') {
      filtered = filtered.filter((c) => c.isRunning === true);
    } else if (values.industryStatus === 'not_running') {
      filtered = filtered.filter((c) => c.isRunning === false);
    }

    // 4) Lọc loại hình
    if (values.type && values.type !== 'all') {
      filtered = filtered.filter((c) => c.type === values.type);
    }

    // set lại campaigns hiển thị
    setCampaigns(filtered);
    setCurrentPage(1);
  };

  const onReset = () => {
    form.resetFields();
    if (campaignsResponse?.result.datas) {
      setCampaigns(campaignsResponse.result.datas);
    }
    setCurrentPage(1);
  };

  // Tính ra dữ liệu trang hiện tại (phía client)
  // Nếu bạn muốn phân trang server-side, hãy bỏ đoạn slice() này
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  if (isLoading) {
    return <div className="p-6">Đang tải dữ liệu ...</div>;
  }

  if (isError) {
    return <div className="p-6">Có lỗi xảy ra khi gọi API.</div>;
  }

  return (
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
          <Form.Item name="status" label="Trạng thái">
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
          // Tuỳ cấu trúc campaign thực tế, bạn điều chỉnh cho phù hợp
          const isLocked = campaign.locked; // server trả về?
          const isRegistered = campaign.isRegistered; // server trả về?
          const isRunning = campaign.isRunning; // server trả về?
          const rating = 4.28;
          const ratingCount = 323;
          const totalConversion = 577866;

          return (
            <div
              key={campaign.id}
              className={`flex flex-col items-center rounded-lg bg-white p-4 shadow transition-transform duration-300 
                ${
                  !isLocked
                    ? 'cursor-pointer hover:scale-105 hover:shadow-xl'
                    : 'pointer-events-none opacity-50'
                }`}
              onClick={() =>
                navigate(`/publisher/campaign-detail/${campaign.id}`)
              }
            >
              {/* Logo */}
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                <img
                  src={
                    campaign.image ||
                    'https://content.accesstrade.vn/adv/1735897487_avatar_1735897487.png'
                  }
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

              {/* Rating + conversions (demo cứng) */}
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

      {/* Phân trang */}
      <div className="mb-8 mt-4">
        <PaginationSection
          totalPosts={campaigns.length} // hoặc campaignsResponse?.result?.length
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
