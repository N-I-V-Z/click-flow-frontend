import React, { useState, useMemo, useEffect } from 'react';
import { Input, Button, Table, Tag, Space, Modal, Select } from 'antd';
import { useLocation } from 'react-router-dom';
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  StopOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import BasePages from '@/components/shared/base-pages';
import CustomConfirmPopup from '@/components/shared/custom-confirm-popup';
import {
  useGetPublisherParticipationByStatusForAdvertiser,
  useUpdateParticipationStatus
} from '@/queries/campaign.query';
import { CampaignParticipationApiResponse } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Extended type for API response that includes additional fields
interface ExtendedParticipationResponse
  extends CampaignParticipationApiResponse {
  totalCampaigns?: number;
  dailyTraffic?: number;
}

const PublisherRequests: React.FC = () => {
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedRequest, setSelectedRequest] =
    useState<CampaignParticipationApiResponse | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    'Pending' | 'Participated' | 'Rejected'
  >('Pending'); // Default to pending
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Custom popup state
  const [confirmPopup, setConfirmPopup] = useState({
    isVisible: false,
    title: '',
    message: '',
    type: 'confirm' as 'confirm' | 'warning' | 'info',
    onConfirm: () => {},
    loading: false
  }); // API calls
  const {
    data: participationData,
    isLoading,
    refetch
  } = useGetPublisherParticipationByStatusForAdvertiser(
    currentPage,
    pageSize,
    statusFilter
  );
  const { mutateAsync: updateParticipationStatus } =
    useUpdateParticipationStatus();

  // Refetch API when component mounts or when navigating to this page
  useEffect(() => {
    console.log('PublisherRequests: Component mounted, refetching data...');
    refetch();
  }, [refetch]);

  // Refetch API when location/route changes (when clicking sidebar)
  useEffect(() => {
    console.log('PublisherRequests: Route changed to:', location.pathname);
    refetch();
  }, [location.pathname, refetch]);

  // Refetch API when status filter changes
  useEffect(() => {
    refetch();
  }, [statusFilter, refetch]);

  // Lấy dữ liệu từ API
  const publisherRequests = useMemo(() => {
    if (!participationData?.result?.datas) return [];

    return participationData.result.datas.map((item, index) => ({
      ...item,
      key: item.id.toString(),
      stt: (currentPage - 1) * pageSize + index + 1
    }));
  }, [participationData, currentPage, pageSize]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Participated':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ duyệt';
      case 'Participated':
        return 'Đã tham gia';
      case 'Rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const handleApprove = (record: CampaignParticipationApiResponse) => {
    setConfirmPopup({
      isVisible: true,
      title: 'Phê duyệt yêu cầu',
      message: `Bạn có chắc chắn muốn phê duyệt yêu cầu từ ${record.publisher?.applicationUser?.fullName}?`,
      type: 'confirm',
      loading: false,
      onConfirm: async () => {
        setConfirmPopup((prev) => ({ ...prev, loading: true }));
        try {
          await updateParticipationStatus({
            publisherId: record.publisherId!,
            campaignParticipationId: record.id,
            newStatus: 'Participated'
          });

          // Đóng popup trước
          setConfirmPopup((prev) => ({
            ...prev,
            isVisible: false,
            loading: false
          }));

          // Refresh dữ liệu
          await refetch();

          // Hiển thị toast thành công
          toast.success('Đã duyệt yêu cầu thành công!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { zIndex: 10000 }
          });
        } catch (error) {
          setConfirmPopup((prev) => ({ ...prev, loading: false }));
          toast.error('Có lỗi xảy ra khi duyệt yêu cầu!', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { zIndex: 10000 }
          });
        }
      }
    });
  };

  const handleReject = (record: CampaignParticipationApiResponse) => {
    setConfirmPopup({
      isVisible: true,
      title: 'Từ chối yêu cầu',
      message: `Bạn có chắc chắn muốn từ chối yêu cầu từ ${record.publisher?.applicationUser?.fullName}?`,
      type: 'warning',
      loading: false,
      onConfirm: async () => {
        setConfirmPopup((prev) => ({ ...prev, loading: true }));
        try {
          await updateParticipationStatus({
            publisherId: record.publisherId!,
            campaignParticipationId: record.id,
            newStatus: 'Rejected'
          });

          // Đóng popup trước
          setConfirmPopup((prev) => ({
            ...prev,
            isVisible: false,
            loading: false
          }));

          // Refresh dữ liệu
          await refetch();

          // Hiển thị toast thành công
          toast.success('Đã từ chối yêu cầu!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { zIndex: 10000 }
          });
        } catch (error) {
          setConfirmPopup((prev) => ({ ...prev, loading: false }));
          toast.error('Có lỗi xảy ra khi từ chối yêu cầu!', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { zIndex: 10000 }
          });
        }
      }
    });
  };

  // Chức năng: Chỉ cho phép từ chối publisher đang tham gia
  const handleStopParticipation = (
    record: CampaignParticipationApiResponse
  ) => {
    const actionText = 'ngừng tham gia chiến dịch';

    setConfirmPopup({
      isVisible: true,
      title: `Xác nhận ${actionText}`,
      message: `Bạn có chắc chắn muốn ${actionText} Publisher ${record.publisher?.applicationUser?.fullName}?`,
      type: 'warning',
      loading: false,
      onConfirm: async () => {
        setConfirmPopup((prev) => ({ ...prev, loading: true }));
        try {
          await updateParticipationStatus({
            publisherId: record.publisherId!,
            campaignParticipationId: record.id,
            newStatus: 'Rejected'
          });

          // Đóng popup trước
          setConfirmPopup((prev) => ({
            ...prev,
            isVisible: false,
            loading: false
          }));

          // Refresh dữ liệu
          await refetch();

          // Hiển thị toast thành công
          toast.success(`Đã ${actionText} thành công!`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { zIndex: 10000 }
          });
        } catch (error) {
          setConfirmPopup((prev) => ({ ...prev, loading: false }));
          toast.error(`Có lỗi xảy ra khi ${actionText}!`, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: { zIndex: 10000 }
          });
        }
      }
    });
  };

  const showDetail = (record: CampaignParticipationApiResponse) => {
    setSelectedRequest(record);
    setIsDetailModalVisible(true);
  };

  const columns: ColumnsType<
    CampaignParticipationApiResponse & { key: string; stt: number }
  > = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      align: 'center'
    },
    {
      title: 'Publisher',
      key: 'publisher',
      render: (_, record) =>
        record.publisher?.applicationUser?.fullName || 'N/A',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        const publisherName = record.publisher?.applicationUser?.fullName || '';
        const campaignName = record.campaign?.name || '';
        const searchValue = value.toString().toLowerCase();
        return (
          publisherName.toLowerCase().includes(searchValue) ||
          campaignName.toLowerCase().includes(searchValue)
        );
      }
    },
    {
      title: 'Chiến dịch',
      key: 'campaign',
      render: (_, record) => record.campaign?.name || 'N/A'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Đã tham gia', value: 'Participated' },
        { text: 'Đã từ chối', value: 'Rejected' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date: string) => {
        const utcDate = new Date(date);
        const vietnamTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
        return vietnamTime.toLocaleDateString('vi-VN');
      },
      sorter: (a, b) =>
        new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => showDetail(record)}
            className="rounded-full bg-blue-50 p-2 text-blue-500 transition-colors duration-200 hover:bg-blue-100"
            title="Xem chi tiết"
          >
            <EyeOutlined className="text-sm" size={16} />
          </button>

          {record.status === 'Pending' && (
            <>
              <button
                onClick={() => handleApprove(record)}
                className="rounded-full bg-green-50 p-2 text-green-500 transition-colors duration-200 hover:bg-green-100"
                title="Duyệt"
              >
                <CheckOutlined className="text-sm" size={16} />
              </button>
              <button
                onClick={() => handleReject(record)}
                className="rounded-full bg-red-50 p-2 text-red-500 transition-colors duration-200 hover:bg-red-100"
                title="Từ chối"
              >
                <CloseOutlined className="text-sm" size={16} />
              </button>
            </>
          )}

          {record.status === 'Participated' && (
            <button
              onClick={() => handleStopParticipation(record)}
              className="rounded-full bg-red-50 p-2 text-red-500 transition-colors duration-200 hover:bg-red-100"
              title="Ngừng tham gia"
            >
              <StopOutlined className="text-sm" size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  const filteredData = useMemo(() => {
    if (!publisherRequests) return [];

    return publisherRequests.filter((item) => {
      // Text search filter
      const publisherName = item.publisher?.applicationUser?.fullName || '';
      const campaignName = item.campaign?.name || '';
      const matchesSearch =
        !searchText ||
        publisherName.toLowerCase().includes(searchText.toLowerCase()) ||
        campaignName.toLowerCase().includes(searchText.toLowerCase());

      return matchesSearch;
    });
  }, [publisherRequests, searchText]);

  return (
    <BasePages pageHead="ClickFlow - Yêu cầu tham gia Publisher">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold text-gray-800">
              Yêu cầu tham gia từ Publisher
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý và duyệt các yêu cầu tham gia chiến dịch từ Publisher
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                placeholder="Tìm kiếm theo Publisher hoặc Chiến dịch..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-96"
              />

              <div className="flex items-center gap-2">
                <FilterOutlined className="text-gray-500" />
                <Select
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className="w-48"
                  placeholder="Lọc theo trạng thái"
                >
                  <Select.Option value="Pending">Chờ duyệt</Select.Option>
                  <Select.Option value="Participated">
                    Đã tham gia
                  </Select.Option>
                  <Select.Option value="Rejected">Đã từ chối</Select.Option>
                </Select>

                {/* Refresh Button */}
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => refetch()}
                  loading={isLoading}
                  className="border-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Làm mới
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Hiển thị:</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 font-semibold text-purple-700">
                {filteredData.length} yêu cầu
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-white/80 shadow-xl backdrop-blur-sm">
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: participationData?.result?.totalItems || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
                onChange: (page) => setCurrentPage(page)
              }}
              loading={isLoading}
              className="rounded-xl"
            />
          </div>

          {/* Enhanced Detail Modal */}
          <Modal
            title={
              <div className="-m-6 mb-6 flex items-center gap-3 rounded-t-xl bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                <EyeOutlined className="text-lg" />
                <span className="text-lg font-semibold">
                  Chi tiết yêu cầu tham gia
                </span>
              </div>
            }
            open={isDetailModalVisible}
            onCancel={() => setIsDetailModalVisible(false)}
            footer={[
              <Button
                key="close"
                onClick={() => setIsDetailModalVisible(false)}
                className="h-10 rounded-lg border-gray-300 hover:border-gray-400"
              >
                Đóng
              </Button>,

              // Actions for Pending status
              selectedRequest?.status === 'Pending' && (
                <Space key="pending-actions">
                  <button
                    onClick={() => {
                      if (selectedRequest) {
                        handleReject(selectedRequest);
                        setIsDetailModalVisible(false);
                      }
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                  >
                    <CloseOutlined />
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      if (selectedRequest) {
                        handleApprove(selectedRequest);
                        setIsDetailModalVisible(false);
                      }
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                  >
                    <CheckOutlined />
                    Duyệt yêu cầu
                  </button>
                </Space>
              ),

              // Actions for Participated status
              selectedRequest?.status === 'Participated' && (
                <button
                  key="participated-action"
                  onClick={() => {
                    if (selectedRequest) {
                      handleStopParticipation(selectedRequest);
                      setIsDetailModalVisible(false);
                    }
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                >
                  <StopOutlined />
                  Ngừng tham gia
                </button>
              ),

              // Actions for Pending status
              selectedRequest?.status === 'Pending' && [
                <button
                  key="approve-action"
                  onClick={() => {
                    if (selectedRequest) {
                      handleApprove(selectedRequest);
                      setIsDetailModalVisible(false);
                    }
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                >
                  <CheckOutlined />
                  Phê duyệt
                </button>,
                <button
                  key="reject-action"
                  onClick={() => {
                    if (selectedRequest) {
                      handleReject(selectedRequest);
                      setIsDetailModalVisible(false);
                    }
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                >
                  <CloseOutlined />
                  Từ chối
                </button>
              ]
            ]}
            width={700}
            className="rounded-xl"
          >
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Publisher
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {selectedRequest.publisher?.applicationUser?.fullName ||
                        'N/A'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {selectedRequest.publisher?.applicationUser?.email ||
                        'N/A'}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Short Link
                  </label>
                  {selectedRequest.shortLink ? (
                    <a
                      href={selectedRequest.shortLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {selectedRequest.shortLink}
                    </a>
                  ) : (
                    <p className="text-lg font-medium text-gray-500">
                      Chưa có link
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Tổng số chiến dịch
                    </label>
                    <p className="text-xl font-bold text-orange-600">
                      {(selectedRequest as ExtendedParticipationResponse)
                        .totalCampaigns || 0}{' '}
                      chiến dịch
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {(() => {
                        const utcDate = new Date(selectedRequest.createAt);
                        const vietnamTime = new Date(
                          utcDate.getTime() + 7 * 60 * 60 * 1000
                        );
                        return vietnamTime.toLocaleDateString('vi-VN');
                      })()}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Chiến dịch
                  </label>
                  <p className="text-lg font-medium text-gray-800">
                    {selectedRequest.campaign?.name || 'N/A'}
                  </p>
                  {selectedRequest.campaign?.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedRequest.campaign.description}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-gradient-to-br from-slate-50 to-gray-50 p-4">
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Trạng thái
                  </label>
                  <Tag
                    color={getStatusColor(selectedRequest.status)}
                    className="px-3 py-1 text-sm font-medium"
                  >
                    {getStatusText(selectedRequest.status)}
                  </Tag>
                </div>

                {selectedRequest.campaign?.budget && (
                  <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Ngân sách chiến dịch
                    </label>
                    <p className="text-xl font-bold text-emerald-600">
                      {selectedRequest.campaign.budget.toLocaleString('vi-VN')}{' '}
                      VNĐ
                    </p>
                    <p className="text-sm text-gray-600">
                      Hoa hồng:{' '}
                      {selectedRequest.campaign.commission?.toLocaleString(
                        'vi-VN'
                      )}{' '}
                      VNĐ ({selectedRequest.campaign.percents}%)
                    </p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>

      {/* Custom Confirmation Popup */}
      <CustomConfirmPopup
        isVisible={confirmPopup.isVisible}
        title={confirmPopup.title}
        message={confirmPopup.message}
        type={confirmPopup.type}
        confirmLoading={confirmPopup.loading}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() =>
          setConfirmPopup((prev) => ({ ...prev, isVisible: false }))
        }
        onClose={() =>
          setConfirmPopup((prev) => ({ ...prev, isVisible: false }))
        }
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="colored"
        style={{ zIndex: 10000 }}
      />
    </BasePages>
  );
};

export default PublisherRequests;
