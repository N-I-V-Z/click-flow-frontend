import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Modal, message, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TokenDecoded } from '@/types';
import PaginationSection from '@/components/shared/pagination-section';
import {
  useGetAllCampaignForPublisher,
  useRegisterCampaign
} from '@/queries/campaign.query';
import helpers from '@/helpers';
import __helpers from '@/helpers';

const { Option } = Select;
const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
// PublisherId lấy từ token (hoặc từ context, store,...)
const PUBLISHER_ID = decodedToken?.Id;

// Số item mỗi trang (client side)
const PAGE_SIZE = 10;

const CampaignsPage: React.FC = () => {
  const [form] = Form.useForm();

  // State lưu danh sách campaign hiển thị (để lọc, phân trang phía client)
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // State trang hiện tại (client side)
  const [currentPage, setCurrentPage] = useState<number>(1);

  // State cho Modal đăng ký
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

  // Hook lấy dữ liệu campaigns từ server, bao gồm refetch để làm mới sau đăng ký
  const {
    data: campaignsResponse,
    isLoading,
    isError,
    refetch: refetchCampaigns
  } = useGetAllCampaignForPublisher(currentPage, PAGE_SIZE);

  // Hook mutation đăng ký
  const { mutate: registerCampaign, isLoading: isRegisterLoading } =
    useRegisterCampaign();

  const navigate = useNavigate();

  // Mỗi khi có data mới từ server, cập nhật danh sách campaign
  useEffect(() => {
    if (campaignsResponse?.result?.datas) {
      setCampaigns(campaignsResponse.result.datas);
    }
  }, [campaignsResponse]);

  // Mở Modal xác nhận đăng ký
  const handleRegisterClick = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setIsModalVisible(true);
  };

  // Khi người dùng bấm "Đồng ý" trong Modal → gọi mutation đăng ký
  const handleConfirmRegister = () => {
    if (selectedCampaignId !== null) {
      registerCampaign(
        { campaignId: selectedCampaignId },
        {
          onSuccess: () => {
            message.success('Đăng ký thành công!');
            // Sau khi đăng ký thành công, làm mới danh sách campaigns
            refetchCampaigns();
          },
          onError: () => {
            message.error('Đăng ký thất bại!');
          }
        }
      );
    }
    setIsModalVisible(false);
    setSelectedCampaignId(null);
  };

  // Khi người dùng bấm "Hủy" trong Modal
  const handleCancelRegister = () => {
    setIsModalVisible(false);
    setSelectedCampaignId(null);
  };

  // Hàm hiển thị cảnh báo khi publisherStatus === "Pending"
  const handlePendingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.warning({
      title: 'Chờ duyệt chiến dịch',
      content: 'Vui lòng chờ nhà quảng cáo duyệt chiến dịch.'
    });
  };

  // Lọc phía client khi submit form
  const onFinish = (values: any) => {
    if (!campaignsResponse?.result?.datas) return;

    let filtered = [...campaignsResponse.result.datas];

    // Lọc trạng thái khóa (demo)
    if (values.status === 'active') {
      filtered = filtered.filter((c) => !c.locked);
    } else if (values.status === 'locked') {
      filtered = filtered.filter((c) => c.locked);
    }

    // Lọc nhóm ngành (demo)
    if (values.group && values.group !== 'all') {
      filtered = filtered.filter((c) => c.industryGroup === values.group);
    }

    // Lọc trạng thái chạy (demo)
    if (values.industryStatus === 'running') {
      filtered = filtered.filter((c) => c.isRunning === true);
    } else if (values.industryStatus === 'not_running') {
      filtered = filtered.filter((c) => c.isRunning === false);
    }

    // Lọc loại hình (demo)
    if (values.type && values.type !== 'all') {
      filtered = filtered.filter((c) => c.typePay === values.type);
    }

    setCampaigns(filtered);
    setCurrentPage(1);
  };

  // Reset form filter
  const onReset = () => {
    form.resetFields();
    if (campaignsResponse?.result?.datas) {
      setCampaigns(campaignsResponse.result.datas);
    }
    setCurrentPage(1);
  };

  // Phân trang client side
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  // Loading state
  if (isLoading) {
    return <div className="p-6">Đang tải dữ liệu ...</div>;
  }

  // Error state
  if (isError) {
    return <div className="p-6">Có lỗi xảy ra khi gọi API.</div>;
  }

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Danh sách Chiến dịch
      </h1>

      {/* Form Lọc */}
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
          // Demo cứng "locked" = false
          const isLocked = false;
          // Kiểm tra xem campaign đã tham gia chưa (nếu publisherStatus có giá trị)
          const hasPublisherStatus = !!campaign.publisherStatus;

          return (
            <div
              key={campaign.id}
              className={`flex flex-col items-center rounded-lg bg-white p-4 shadow transition-transform duration-300 
                ${!isLocked ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : 'pointer-events-none opacity-50'}`}
              // Khi click vào campaign ở CampaignsPage:
              onClick={() =>
                navigate(`/publisher/campaign-detail/${campaign.id}`)
              }
            >
              {/* Logo */}
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                <img
                  src={
                    campaign.image ||
                    'https://via.placeholder.com/150?text=No+Image'
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
                {campaign.percents
                  ? `${campaign.percents}%`
                  : `${campaign.commission?.toLocaleString()} đ`}
              </div>

              {/* Hiển thị rating dựa trên averageStarRate */}
              <div className="mb-3 items-center gap-2  text-gray-600">
                <Rate
                  disabled
                  allowHalf
                  defaultValue={campaign.averageStarRate}
                />
                <span className="block w-full text-center">
                  {'('}
                  {campaign.averageStarRate.toFixed(2).replace('.', ',')}
                  {')'}
                </span>
              </div>

              {/* Nút hành động */}
              {isLocked ? (
                <p className="text-red-500 mt-2 font-medium">Đã bị khóa</p>
              ) : hasPublisherStatus ? (
                // Nếu campaign đã tham gia, phân biệt 2 trường hợp:
                campaign.publisherStatus === 'Participated' ? (
                  // Khi Activing thì cho phép copy link
                  <Button
                    type="default"
                    className="w-full bg-white text-[#8229B0] hover:!border-[#9B52BF] hover:!bg-[#9B52BF] hover:!text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = `${window.location.origin}/link/${PUBLISHER_ID}/${campaign.id}`;
                      navigator.clipboard
                        .writeText(link)
                        .then(() => {
                          message.success('Copy link thành công!');
                        })
                        .catch(() => {
                          message.error('Copy link thất bại!');
                        });
                    }}
                  >
                    Lấy link
                  </Button>
                ) : (
                  // Nếu publisherStatus khác Activing (ví dụ: Pending)
                  <Button
                    type="default"
                    className="w-full bg-white text-[#8229B0] hover:!border-[#9B52BF] hover:!bg-[#8229B0] hover:!text-white"
                    onClick={handlePendingClick}
                  >
                    Lấy link
                  </Button>
                )
              ) : (
                // Nếu chưa tham gia => Nút "Đăng ký"
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
          );
        })}
      </div>

      {/* Phân trang (client side) */}
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
        open={isModalVisible}
        onOk={handleConfirmRegister}
        onCancel={handleCancelRegister}
        okText="Đồng ý"
        cancelText="Hủy"
        confirmLoading={isRegisterLoading}
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
