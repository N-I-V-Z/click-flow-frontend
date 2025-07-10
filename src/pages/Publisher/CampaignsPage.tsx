import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Rate } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { TokenDecoded, CampaignApiResponse } from '@/types';
import {
  useGetAllCampaignForPublisher,
  useRegisterCampaign
} from '@/queries/campaign.query';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import BasePages from '@/components/shared/base-pages';
import {
  TargetIcon,
  MoneyIcon,
  BuildingIcon,
  FoodIcon,
  BookIcon,
  ToolIcon,
  ClickIcon,
  BoltIcon,
  DiamondIcon,
  RefreshIcon,
  SparkleIcon,
  RocketIcon,
  CheckCircleIcon,
  ClockIcon,
  LockIcon,
  NewIcon,
  LinkIcon,
  XIcon
} from '@/components/shared/custom-icons';

const { Option } = Select;
const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);
const PUBLISHER_ID = decodedToken?.Id;

const CampaignsPage: React.FC = () => {
  const [form] = Form.useForm();

  // --- Pagination state from URL ---
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialLimit = parseInt(searchParams.get('limit') || '12', 10);

  const [campaigns, setCampaigns] = useState<CampaignApiResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialLimit);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );

  // Hook lấy dữ liệu campaigns từ server, bao gồm refetch để làm mới sau đăng ký
  const {
    data: campaignsResponse,
    isError,
    refetch: refetchCampaigns
  } = useGetAllCampaignForPublisher(currentPage, pageSize);

  // Hook mutation đăng ký
  const { mutate: registerCampaign, isPending: isRegisterLoading } =
    useRegisterCampaign();

  const navigate = useNavigate();

  // Mỗi khi có data mới từ server, cập nhật danh sách campaign
  useEffect(() => {
    if (campaignsResponse?.result?.datas) {
      setCampaigns(campaignsResponse.result.datas);
    }
  }, [campaignsResponse]);

  // Refetch data khi component mount lại hoặc navigate back từ detail page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchCampaigns();
      }
    };

    const handleFocus = () => {
      refetchCampaigns();
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Refetch when component mounts
    refetchCampaigns();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetchCampaigns]);

  // Refetch data khi location change (navigate back từ detail page)
  useEffect(() => {
    if (location.pathname === '/publisher/campaigns') {
      refetchCampaigns();
    }
  }, [location.pathname, refetchCampaigns]);

  // Sync URL when currentPage or pageSize changes - use simple approach
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams({ page: String(currentPage), limit: String(pageSize) });
    }, 50); // Small delay to batch updates

    return () => clearTimeout(timer);
  }, [currentPage, pageSize, setSearchParams]);

  // Sync state if URL changes (only on mount/navigation, not during our own updates)
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlLimit = parseInt(searchParams.get('limit') || '12', 10);

    // Use functional updates to prevent dependency issues
    setCurrentPage((prevPage) => {
      const shouldUpdate = urlPage !== prevPage && urlPage >= 1;
      return shouldUpdate ? urlPage : prevPage;
    });

    setPageSize((prevSize) => {
      const shouldUpdate =
        urlLimit !== prevSize && [8, 12, 16, 24].includes(urlLimit);
      return shouldUpdate ? urlLimit : prevSize;
    });
  }, [searchParams]);

  // Auto-adjust currentPage when it exceeds totalPages due to data changes
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(campaigns.length / pageSize));
    setCurrentPage((prevPage) => {
      if (prevPage > newTotalPages && campaigns.length > 0) {
        return newTotalPages;
      }
      return prevPage;
    });
  }, [campaigns.length, pageSize]);

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
            showToast.success('Đăng ký thành công!');
            // Sau khi đăng ký thành công, làm mới danh sách campaigns
            refetchCampaigns();
          },
          onError: () => {
            showToast.error('Đăng ký thất bại!');
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

  // Hàm xử lý khi click vào nút pending (không làm gì, chỉ để disabled)
  const handlePendingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Không làm gì, nút đã disabled và có text rõ ràng
  };

  // Lọc phía client khi submit form
  const onFinish = (values: {
    status?: string;
    group?: string;
    industryStatus?: string;
    type?: string;
  }) => {
    if (!campaignsResponse?.result?.datas) return;

    let filtered = [...campaignsResponse.result.datas];

    // Lọc theo status campaign
    if (values.status === 'active') {
      filtered = filtered.filter(
        (c) => c.status === 'Activing' || c.status === 'Hoạt động'
      );
    } else if (values.status === 'locked') {
      filtered = filtered.filter(
        (c) => c.status === 'Paused' || c.status === 'Rejected'
      );
    }

    // Lọc theo advertiser industry
    if (values.group && values.group !== 'all') {
      filtered = filtered.filter(
        (c) => c.advertiser?.industry === values.group
      );
    }

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
    setPageSize(12);
  };

  // Phân trang client side cho filtered data với kiểm tra an toàn
  const totalPages = Math.max(1, Math.ceil(campaigns.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  // Error state
  if (isError) {
    return (
      <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="max-w-md text-center">
            <div className="relative mb-8">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-100 via-pink-100 to-rose-100">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-200 via-pink-200 to-rose-200">
                  <XIcon className="text-red-500" size={32} />
                </div>
              </div>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              Oops! Có lỗi xảy ra
            </h3>
            <p className="mb-6 leading-relaxed text-gray-600">
              Không thể tải dữ liệu chiến dịch. Vui lòng kiểm tra kết nối
              internet và thử lại.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 rounded-2xl border-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg"
            >
              <RefreshIcon size={20} />
              Thử lại
            </Button>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
      <style>{`
        .register-campaign-modal .ant-modal-content {
          overflow: visible !important;
          max-height: 90vh !important;
          border-radius: 24px !important;
        }
        
        .register-campaign-modal .ant-modal-body {
          overflow: visible !important;
          max-height: 85vh !important;
          padding: 0 !important;
        }
        
        .register-campaign-modal {
          z-index: 1050 !important;
        }
        
        /* Đảm bảo modal không bị che */
        .ant-modal-mask {
          z-index: 1049 !important;
        }
        
        .ant-modal-wrap {
          z-index: 1050 !important;
        }
        
        /* Fix responsive cho mobile */
        @media (max-width: 768px) {
          .register-campaign-modal .ant-modal {
            margin: 16px !important;
            max-width: calc(100vw - 32px) !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                Khám phá Chiến dịch
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-purple-100">
                Tham gia các chiến dịch hấp dẫn và tối ưu hóa thu nhập của bạn
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-purple-100">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span className="text-sm">
                    {campaigns.length} chiến dịch khả dụng
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">Hoa hồng hấp dẫn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute right-20 top-20 h-12 w-12 rounded-full bg-white/15 backdrop-blur-sm"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Enhanced Filter Section */}
          <div className="mb-12">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Bộ lọc thông minh
                </h2>
                <p className="text-gray-600">
                  Tìm kiếm chiến dịch phù hợp với nhu cầu của bạn
                </p>
              </div>

              <div className="p-8">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
                >
                  <Form.Item
                    name="group"
                    label={
                      <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Nhóm ngành hàng
                      </span>
                    }
                  >
                    <Select
                      placeholder="Chọn nhóm ngành hàng"
                      allowClear
                      className="h-12"
                      suffixIcon={<div className="text-purple-400">▼</div>}
                    >
                      <Option value="all">
                        <div className="flex items-center gap-2">
                          <BuildingIcon size={16} className="text-gray-500" />
                          <span>Tất cả ngành</span>
                        </div>
                      </Option>
                      <Option value="FoodAndBeverage">
                        <div className="flex items-center gap-2">
                          <FoodIcon size={16} className="text-orange-500" />
                          <span>Thực phẩm & đồ uống</span>
                        </div>
                      </Option>
                      <Option value="Education">
                        <div className="flex items-center gap-2">
                          <BookIcon size={16} className="text-blue-500" />
                          <span>Giáo dục</span>
                        </div>
                      </Option>
                      <Option value="Other">
                        <div className="flex items-center gap-2">
                          <ToolIcon size={16} className="text-gray-500" />
                          <span>Khác</span>
                        </div>
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="type"
                    label={
                      <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                        Loại hình thanh toán
                      </span>
                    }
                  >
                    <Select
                      placeholder="Chọn loại hình"
                      allowClear
                      className="h-12"
                      suffixIcon={<div className="text-purple-400">▼</div>}
                    >
                      <Option value="all">
                        <div className="flex items-center gap-2">
                          <MoneyIcon size={16} className="text-green-500" />
                          <span>Tất cả loại hình</span>
                        </div>
                      </Option>
                      <Option value="CPC">
                        <div className="flex items-center gap-2">
                          <ClickIcon size={16} className="text-blue-500" />
                          <span>CPC - Trả theo click</span>
                        </div>
                      </Option>
                      <Option value="CPA">
                        <div className="flex items-center gap-2">
                          <BoltIcon size={16} className="text-yellow-500" />
                          <span>CPA - Trả theo hành động</span>
                        </div>
                      </Option>
                      <Option value="CPS">
                        <div className="flex items-center gap-2">
                          <DiamondIcon size={16} className="text-purple-500" />
                          <span>CPS - Trả theo bán hàng</span>
                        </div>
                      </Option>
                    </Select>
                  </Form.Item>

                  <div className="col-span-1 flex items-end gap-4 md:col-span-2 lg:col-span-2">
                    <Button
                      onClick={onReset}
                      className="flex h-12 items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 font-semibold text-gray-700"
                    >
                      <RefreshIcon size={18} />
                      Đặt lại
                    </Button>
                    <Button
                      htmlType="submit"
                      className="flex h-12 items-center gap-2 rounded-xl border-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-8 font-semibold text-white shadow-lg"
                    >
                      <SparkleIcon size={18} />
                      Áp dụng bộ lọc
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          {/* Enhanced Campaign Grid */}
          <div className="mb-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  Chiến dịch nổi bật
                </h2>
                <p className="text-gray-600">
                  Danh sách các chiến dịch có sẵn cho bạn
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Tổng cộng</div>
                <div className="text-2xl font-bold text-purple-600">
                  {campaigns.length} chiến dịch
                </div>
              </div>
            </div>

            {campaigns.length === 0 ? (
              <div className="flex h-96 items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="relative mb-8">
                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200">
                        <TargetIcon className="text-purple-600" size={32} />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    Không tìm thấy chiến dịch
                  </h3>
                  <p className="mb-6 leading-relaxed text-gray-600">
                    Hiện tại không có chiến dịch nào phù hợp với bộ lọc của bạn.
                    Hãy thử điều chỉnh bộ lọc hoặc quay lại sau.
                  </p>
                  <Button
                    onClick={onReset}
                    className="flex items-center gap-2 rounded-2xl border-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg"
                  >
                    <RefreshIcon size={20} />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentCampaigns.map((campaign) => {
                  const isLocked =
                    campaign.status === 'Paused' ||
                    campaign.status === 'Rejected';
                  const hasPublisherStatus = !!campaign.publisherStatus;

                  return (
                    <div
                      key={campaign.id}
                      className={`group relative flex min-h-[500px] flex-col overflow-hidden rounded-3xl bg-white shadow-lg ${
                        !isLocked
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-60'
                      }`}
                      onClick={() =>
                        !isLocked &&
                        navigate(`/publisher/campaign-detail/${campaign.id}`)
                      }
                    >
                      {/* Gradient Border Effect */}
                      {!isLocked && (
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 p-[2px] opacity-0">
                          <div className="h-full w-full rounded-3xl bg-white"></div>
                        </div>
                      )}

                      <div className="relative flex h-full flex-col p-6">
                        {/* Status Badge */}
                        <div className="absolute right-4 top-4 z-10">
                          {isLocked ? (
                            <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                              <LockIcon size={12} />
                              <span>Đã khóa</span>
                            </div>
                          ) : hasPublisherStatus ? (
                            campaign.publisherStatus === 'Participated' ? (
                              <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                                <CheckCircleIcon size={12} />
                                <span>Đã tham gia</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-600">
                                <ClockIcon size={12} />
                                <span>Chờ duyệt</span>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                              <NewIcon size={12} />
                              <span>Mới</span>
                            </div>
                          )}
                        </div>

                        {/* Campaign Logo */}
                        <div className="mb-6 flex justify-center">
                          <div className="relative">
                            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg ring-4 ring-white">
                              <img
                                src={
                                  campaign.image ||
                                  'https://via.placeholder.com/150?text=No+Image'
                                }
                                alt="logo"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {!isLocked && (
                              <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                                <TargetIcon size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Campaign Name */}
                        <h3 className="mb-4 line-clamp-2 flex min-h-[56px] items-center justify-center text-center text-lg font-bold leading-tight text-gray-900">
                          {campaign.name}
                        </h3>

                        {/* Commission Section */}
                        <div className="mb-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
                          <div className="text-center">
                            <div className="mb-1 flex items-center justify-center gap-1 text-sm font-medium text-gray-600">
                              <MoneyIcon size={16} className="text-green-500" />
                              <span>Hoa hồng</span>
                            </div>
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
                              {campaign.percents
                                ? `${campaign.percents}%`
                                : `${campaign.commission?.toLocaleString()} đ`}
                            </div>
                          </div>
                        </div>

                        {/* Rating Section */}
                        <div className="mb-6 text-center">
                          <Rate
                            disabled
                            allowHalf
                            defaultValue={campaign.averageStarRate || 0}
                            className="mb-2 text-sm"
                          />
                          <div className="text-sm text-gray-500">
                            Đánh giá:{' '}
                            {campaign.averageStarRate?.toFixed(1) || '0.0'}/5
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto pt-4">
                          {isLocked ? (
                            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-center font-semibold text-red-600">
                              <LockIcon size={16} />
                              <span>Chiến dịch đã bị khóa</span>
                            </div>
                          ) : hasPublisherStatus ? (
                            campaign.publisherStatus === 'Participated' ? (
                              <Button
                                type="default"
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-green-500 to-emerald-500 font-semibold text-white shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const link = `${window.location.origin}/link?publisherId=${PUBLISHER_ID}&campaignId=${campaign.id}`;
                                  navigator.clipboard
                                    .writeText(link)
                                    .then(() => {
                                      showToast.success(
                                        'Copy link thành công!'
                                      );
                                    })
                                    .catch(() => {
                                      showToast.error('Copy link thất bại!');
                                    });
                                }}
                              >
                                <LinkIcon size={16} />
                                <span>Lấy link ngay</span>
                              </Button>
                            ) : (
                              <Button
                                type="default"
                                disabled
                                className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-gray-400 to-gray-500 font-semibold text-white opacity-75 shadow-lg"
                                onClick={handlePendingClick}
                              >
                                <ClockIcon size={16} />
                                <span>Đang chờ duyệt</span>
                              </Button>
                            )
                          ) : (
                            <Button
                              type="default"
                              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegisterClick(campaign.id);
                              }}
                            >
                              <RocketIcon size={16} />
                              <span>Đăng ký ngay</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enhanced Pagination - Always Visible */}

          <div className="mb-8 py-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              {/* Page Info */}
              <div className="rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                {campaigns.length > 0 ? (
                  <>
                    Hiển thị {''}
                    <span className="font-bold text-purple-600">
                      {campaigns.length}
                    </span>{' '}
                    kết quả
                  </>
                ) : (
                  <>
                    <span className="font-bold text-purple-600">0</span> kết quả
                  </>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-3">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                  disabled={safePage === 1 || campaigns.length === 0}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-sm transition-all duration-200 ${
                    safePage === 1 || campaigns.length === 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Trước</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {campaigns.length > 0 ? (
                    (() => {
                      const pages: React.ReactNode[] = [];
                      const maxVisiblePages = 5;
                      let startPage = Math.max(
                        1,
                        safePage - Math.floor(maxVisiblePages / 2)
                      );
                      const endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1
                      );

                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      // First page
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-gray-200 bg-white font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span
                              key="dots1"
                              className="flex h-11 w-11 items-center justify-center font-bold text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                      }

                      // Visible pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold shadow-sm transition-all duration-200 ${
                              i === safePage
                                ? 'scale-110 transform border-2 border-purple-600 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      // Last page
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span
                              key="dots2"
                              className="flex h-11 w-11 items-center justify-center font-bold text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-gray-200 bg-white font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()
                  ) : (
                    <button
                      disabled
                      className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-100 font-bold text-gray-400"
                    >
                      1
                    </button>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, safePage + 1))
                  }
                  disabled={safePage === totalPages || campaigns.length === 0}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-sm transition-all duration-200 ${
                    safePage === totalPages || campaigns.length === 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <span className="hidden sm:inline">Sau</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2 text-sm">
                <span className="font-medium text-gray-700">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = Number(e.target.value);
                    setPageSize(newPageSize);
                    // Reset to page 1 when changing page size to avoid confusion
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border-2 border-gray-300 bg-white px-3 py-2 font-semibold text-gray-700 transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
                <span className="font-medium text-gray-700">mục</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Modal thay thế Antd Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCancelRegister}
            ></div>

            {/* Modal Content */}
            <div className="relative z-[10000] mx-4 w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95">
              {/* Beautiful Header */}
              <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <RocketIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Xác nhận đăng ký</h2>
                    <p className="text-purple-100">Tham gia chiến dịch này</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 pb-6">
                <div className="mb-6 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
                  <div className="flex items-center justify-center gap-3 text-center">
                    <TargetIcon
                      size={24}
                      className="flex-shrink-0 text-purple-600"
                    />
                    <div>
                      <p className="text-gray-700">
                        Bạn có chắc muốn đăng ký chiến dịch này không?
                      </p>
                      <span className="mt-2 block text-sm text-gray-500">
                        Sau khi đăng ký, bạn sẽ cần chờ nhà quảng cáo phê duyệt
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleCancelRegister}
                    disabled={isRegisterLoading}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <XIcon size={16} />
                    <span>Hủy</span>
                  </button>
                  <button
                    onClick={handleConfirmRegister}
                    disabled={isRegisterLoading}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-0 bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                  >
                    {isRegisterLoading ? (
                      <>
                        <ClockIcon size={16} className="animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon size={16} />
                        <span>Đồng ý</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BasePages>
  );
};

export default CampaignsPage;
