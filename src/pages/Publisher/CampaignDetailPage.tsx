import React, { useState, useEffect } from 'react';
import { Button, Rate, Tabs, Collapse } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { LeftOutlined, RightOutlined, LockOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import helpers from '@/helpers';
import Feedback from './Feedback';
import ProductLink from './ProductLink';
import TrafficTable from './traffictable'; // Import component TrafficTable
import CustomConfirmModal from '@/components/shared/custom-confirm-modal';
import {
  useGetCampaignByIdd,
  useGetSimilarCampaigns,
  IApiCampaign,
  useRegisterCampaign
} from '@/queries/campaign.query';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';
import __helpers from '@/helpers';
import BasePages from '@/components/shared/base-pages';

// Decode token để lấy publisher id (giả sử trường Id có trong token)
const decodedToken = helpers.decodeTokens(__helpers.cookie_get('AT'));
const PUBLISHER_ID = decodedToken?.Id;

// ====== 1) Kiểu dữ liệu cho UI ======
interface Campaign {
  id: number;
  name: string;
  description: string;
  originUrl: string;
  budget: number;
  startDate: string;
  endDate: string;
  method: string; // map từ typePay
  status: string;
  category: string; // map từ typeCampaign
  commissionType: string; // "%" hoặc "VND"
  commissionValue: number;
  imageUrl?: string;
  averageStarRate?: number;
  advertiserId: number;
  advertiserName: string;
  publisherStatus?: string; // Nếu có giá trị => publisher đã tham gia
}

// ====== 2) Hàm map từ IApiCampaign -> Campaign ======
function mapApiCampaignToCampaign(apiCampaign: IApiCampaign): Campaign {
  return {
    id: apiCampaign.id,
    name: apiCampaign.name,
    description: apiCampaign.description,
    originUrl: apiCampaign.originURL,
    budget: apiCampaign.budget,
    startDate: apiCampaign.startDate,
    endDate: apiCampaign.endDate,
    method: apiCampaign.typePay,
    status: apiCampaign.status,
    category: apiCampaign.typeCampaign,
    commissionType: apiCampaign.percents ? '%' : 'VND',
    commissionValue: apiCampaign.percents || apiCampaign.commission,
    imageUrl: apiCampaign.image,
    averageStarRate: apiCampaign.averageStarRate,
    advertiserId: apiCampaign.advertiserId,
    advertiserName: apiCampaign.advertiser?.companyName ?? '',
    publisherStatus: apiCampaign.publisherStatus
  };
}

// ====== 3) Arrow custom cho Slider ======
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const SampleNextArrow: React.FC<ArrowProps> = (props) => {
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

const SamplePrevArrow: React.FC<ArrowProps> = (props) => {
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

// ====== 4) Component thông báo khi chưa tham gia ======
const RestrictedAccess: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        <LockOutlined className="text-4xl text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-700">
        Truy cập bị hạn chế
      </h3>
      <p className="max-w-md text-center text-gray-500">
        Bạn cần tham gia chiến dịch và được duyệt để có thể xem nội dung này.
        Vui lòng đăng ký tham gia chiến dịch trước.
      </p>
    </div>
  );
};

// ====== 5) Component chính ======
const { TabPane } = Tabs;
const { Panel } = Collapse;

const CampaignDetailPage: React.FC = () => {
  // Lấy ID từ URL
  const { id } = useParams();
  const campaignId = Number(id) || 0;

  // Hook điều hướng
  const navigate = useNavigate();

  // Query client để invalidate cache
  const queryClient = useQueryClient();

  // State cho custom modals
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false);

  // Clear state when campaignId changes
  useEffect(() => {
    setIsConfirmModalVisible(false);
  }, [campaignId]);

  // a) Gọi API chi tiết campaign
  // CHÚ Ý: Lấy thêm refetch từ useGetCampaignByIdd
  const {
    data: apiCampaign,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    refetch
  } = useGetCampaignByIdd(campaignId);

  // b) Gọi API lấy danh sách campaign tương tự
  const {
    data: similarResponse,
    isLoading: isLoadingSimilar,
    isError: isErrorSimilar
  } = useGetSimilarCampaigns(campaignId, 1, 5);

  // c) Mảng campaign tương tự
  const similarCampaigns =
    (similarResponse as ApiResponse<PagingResponse<CampaignApiResponse>>)
      ?.result?.datas || [];

  // d) Map dữ liệu sang UI
  let campaign: Campaign | null = null;
  if (apiCampaign) {
    campaign = mapApiCampaignToCampaign(apiCampaign);
  }

  // e) Lấy mutation để đăng ký campaign
  const { mutate: registerCampaign, isPending: isRegisterLoading } =
    useRegisterCampaign();

  // Xử lý loading/error
  if (isLoadingDetail) {
    return <p className="p-4">Đang tải dữ liệu chiến dịch...</p>;
  }
  if (isErrorDetail || !campaign) {
    return (
      <p className="p-4">Có lỗi khi gọi API hoặc không tìm thấy campaign.</p>
    );
  }

  // ====== 6) Kiểm tra quyền truy cập ======
  const hasParticipatedAccess = campaign.publisherStatus === 'Participated';

  // ====== 7) Các hàm xử lý ======
  // Hàm đăng ký
  const handleRegister = () => {
    setIsConfirmModalVisible(true);
  };

  // Xử lý xác nhận đăng ký
  const handleConfirmRegister = () => {
    registerCampaign(
      { campaignId },
      {
        onSuccess: () => {
          showToast.success('Đăng ký thành công!');
          // Gọi lại API để lấy dữ liệu mới (publisherStatus có thể đổi thành "Pending")
          refetch();
          // Invalidate cache cho campaigns list để đảm bảo data fresh khi navigate back
          queryClient.invalidateQueries({
            queryKey: ['get-all-campaign-for-publisher/']
          });
          setIsConfirmModalVisible(false);
        },
        onError: () => {
          showToast.error('Đăng ký thất bại!');
          setIsConfirmModalVisible(false);
        }
      }
    );
  };

  // Hàm xử lý khi click vào campaign tương tự
  const handleSimilarClick = (similarId: number) => {
    navigate(`/publisher/campaign-detail/${similarId}`);
  };

  // Hàm xử lý khi bấm "Lấy link"
  const handleCopyLink = (e: React.MouseEvent, campaignId: number) => {
    e.stopPropagation();
    const link = `${window.location.origin}/link?publisherId=${PUBLISHER_ID}&campaignId=${campaignId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showToast.success('Copy link thành công!');
      })
      .catch(() => {
        showToast.error('Copy link thất bại!');
      });
  };

  // ====== 8) Tùy theo publisherStatus hiển thị nút ======
  const renderButton = () => {
    if (!campaign.publisherStatus) {
      // Chưa tham gia => Hiển thị nút "Đăng ký"
      return (
        <Button
          type="primary"
          onClick={handleRegister}
          loading={isRegisterLoading}
          className="mt-4 rounded-full border-none bg-[#9B52BF] 
                     bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                     hover:!border-[#9B52BF] hover:!bg-white hover:!text-[#9B52BF]"
        >
          Đăng ký
        </Button>
      );
    } else if (campaign.publisherStatus === 'Pending') {
      // Đã đăng ký nhưng chờ duyệt => Bấm sẽ hiện popup cảnh báo
      return (
        <Button
          type="default"
          disabled
          className="mt-4 cursor-not-allowed rounded-full border-none bg-gray-400 text-white opacity-75"
        >
          Đang chờ duyệt
        </Button>
      );
    } else if (campaign.publisherStatus === 'Participated') {
      // Đã được duyệt => Có thể lấy link
      return (
        <Button
          type="default"
          onClick={(e) => handleCopyLink(e, campaign.id)}
          className="mt-4 rounded-full border-none bg-[#9B52BF] 
                     bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                     hover:!border-[#9B52BF] hover:!bg-white hover:!text-[#9B52BF]"
        >
          Lấy link
        </Button>
      );
    }
    // Tuỳ ý xử lý các trạng thái khác (Rejected, v.v...) nếu có
    return null;
  };

  // ====== 9) Cấu hình slider ======
  const sliderSettings = {
    dots: false,
    infinite: similarCampaigns.length > 1,
    speed: 500,
    slidesToShow: Math.min(similarCampaigns.length, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    vertical: false
  };

  return (
    <BasePages pageHead="ClickFlow - Chi tiết chiến dịch">
      <style>
        {`
          .purple-tabs .ant-tabs-tab {
            color: #6B7280 !important;
          }
          .purple-tabs .ant-tabs-tab:hover {
            color: #8B5CF6 !important;
          }
          .purple-tabs .ant-tabs-tab.ant-tabs-tab-active {
            color: #8B5CF6 !important;
          }
          .purple-tabs .ant-tabs-ink-bar {
            background: #8B5CF6 !important;
          }
          .purple-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #8B5CF6 !important;
            font-weight: 600 !important;
          }
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* Nút Back về danh sách chiến dịch */}
        <Button
          type="default"
          icon={<LeftOutlined />}
          onClick={() => navigate('/publisher/campaign?page=1&limit=12')}
          className="mb-4 flex items-center gap-2 rounded-full border-none bg-white px-4 py-2 text-[#8229B0] shadow hover:bg-purple-50"
        >
          Quay lại
        </Button>
        <motion.div>
          {/* PHẦN TRÊN: Thông tin campaign & Chiến dịch tương tự */}
          <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg md:flex-row">
            {/* Cột trái: Thông tin campaign */}
            <div className="flex flex-col items-center border-r pr-6 md:w-1/3">
              {/* Logo */}
              <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-xl">
                <img
                  src={
                    campaign.imageUrl ||
                    'https://via.placeholder.com/150?text=No+Image'
                  }
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
                  value={campaign.averageStarRate || 0}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {campaign.averageStarRate?.toFixed(1)}
                </span>
              </div>

              {/* Nút tuỳ theo trạng thái */}
              {renderButton()}

              {/* Thông tin tóm tắt */}
              <div className="mt-6 w-full space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Hoa hồng:</span>{' '}
                  {campaign.commissionValue}
                  {campaign.commissionType}
                </div>
                <div>
                  <span className="font-semibold">Ngày mở:</span>{' '}
                  {campaign.startDate}
                </div>
                <div>
                  <span className="font-semibold">Loại:</span> {campaign.method}
                </div>
              </div>
            </div>

            {/* Cột phải: Chiến dịch tương tự */}
            <div className="w-full p-4 md:w-2/3">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                Chiến dịch tương tự
              </h3>
              {isLoadingSimilar ? (
                <p>Đang tải...</p>
              ) : isErrorSimilar ? (
                <p>Có lỗi khi tải danh sách tương tự.</p>
              ) : similarCampaigns.length === 0 ? (
                <p>Không có chiến dịch tương tự.</p>
              ) : (
                <Slider {...sliderSettings}>
                  {similarCampaigns.map((item: CampaignApiResponse) => (
                    <div key={item.id} className="px-2">
                      <motion.div
                        className="flex cursor-pointer flex-col items-center justify-center 
                                 rounded-xl bg-white p-4 shadow transition-all duration-300 
                                 hover:scale-105"
                        onClick={() => handleSimilarClick(item.id)}
                      >
                        <div className="relative h-[100px] w-[150px]">
                          <img
                            src={
                              item.image ||
                              'https://via.placeholder.com/150?text=No+Image'
                            }
                            alt={item.name}
                            className="h-full w-full rounded-md object-cover"
                          />
                        </div>
                        <p className="mt-2 text-center text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                      </motion.div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>

          {/* PHẦN DƯỚI: Tabs mô tả, feedback, etc. */}
          <div className="mb-10 mt-6 rounded-2xl bg-white p-6 shadow-lg">
            <Tabs
              defaultActiveKey="information"
              size="large"
              tabBarGutter={32}
              style={
                {
                  '--ant-primary-color': '#8B5CF6',
                  '--ant-primary-color-hover': '#A855F7'
                } as React.CSSProperties
              }
              className="purple-tabs"
            >
              <TabPane tab="Information" key="information">
                <Collapse
                  bordered={false}
                  expandIconPosition="end"
                  className="mt-4"
                >
                  <Panel header="Giới thiệu" key="1">
                    <p className="text-gray-700">
                      {campaign.description || 'Nội dung giới thiệu...'}
                    </p>
                  </Panel>
                  <Panel header="Điều kiện ghi nhận" key="2">
                    <p className="text-gray-700">
                      Chi tiết điều kiện ghi nhận...
                    </p>
                  </Panel>
                  <Panel header="Chính sách Commission" key="3">
                    <p className="text-gray-700">
                      Thông tin chính sách hoa hồng, thanh toán...
                    </p>
                  </Panel>
                </Collapse>
              </TabPane>

              <TabPane tab="Product link" key="product-link">
                {hasParticipatedAccess ? (
                  <ProductLink
                    campaignId={campaignId}
                    originUrl={campaign.originUrl}
                  />
                ) : (
                  <RestrictedAccess />
                )}
              </TabPane>

              <TabPane tab="Traffic" key="traffic">
                {hasParticipatedAccess ? (
                  <TrafficTable selectedCampaignId={campaignId} />
                ) : (
                  <RestrictedAccess />
                )}
              </TabPane>

              <TabPane tab="Feedbacks" key="feedbacks">
                <Feedback
                  campaignId={campaignId}
                  publisherStatus={campaign.publisherStatus}
                />
              </TabPane>
            </Tabs>
          </div>
        </motion.div>

        {/* Custom Confirm Modal */}
        {isConfirmModalVisible && (
          <CustomConfirmModal
            title="Xác nhận đăng ký chiến dịch"
            content="Bạn có chắc chắn muốn đăng ký chiến dịch này?"
            okText="Đồng ý"
            cancelText="Hủy"
            loading={isRegisterLoading}
            onOk={handleConfirmRegister}
            onCancel={() => setIsConfirmModalVisible(false)}
          />
        )}
      </div>
    </BasePages>
  );
};

export default CampaignDetailPage;
