import React, { useState } from 'react';
import { Input, Button, Table, Tag, Space, Modal, message, Select } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import BasePages from '@/components/shared/base-pages';

interface PublisherRequest {
  key: string;
  stt: number;
  publisher: string;
  campaign: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  publisherInfo: {
    name: string;
    email: string;
    website: string;
    traffic: number;
    description: string;
  };
}

const PublisherRequests: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedRequest, setSelectedRequest] =
    useState<PublisherRequest | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('pending'); // Default to pending

  // Dữ liệu mẫu - trong thực tế sẽ lấy từ API
  const mockData: PublisherRequest[] = [
    {
      key: '1',
      stt: 1,
      publisher: 'Publisher ABC',
      campaign: 'Chiến dịch Marketing Q4',
      status: 'pending',
      requestDate: '2024-01-15',
      publisherInfo: {
        name: 'Publisher ABC',
        email: 'abc@publisher.com',
        website: 'https://publisher-abc.com',
        traffic: 50000,
        description: 'Website chuyên về công nghệ với lượng truy cập ổn định'
      }
    },
    {
      key: '2',
      stt: 2,
      publisher: 'Publisher XYZ',
      campaign: 'Chiến dịch Giáng sinh',
      status: 'approved',
      requestDate: '2024-01-10',
      publisherInfo: {
        name: 'Publisher XYZ',
        email: 'xyz@publisher.com',
        website: 'https://publisher-xyz.com',
        traffic: 80000,
        description: 'Website tin tức với độ phủ rộng'
      }
    },
    {
      key: '3',
      stt: 3,
      publisher: 'Publisher DEF',
      campaign: 'Chiến dịch Black Friday',
      status: 'rejected',
      requestDate: '2024-01-12',
      publisherInfo: {
        name: 'Publisher DEF',
        email: 'def@publisher.com',
        website: 'https://publisher-def.com',
        traffic: 30000,
        description: 'Website thương mại điện tử'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const handleApprove = (record: PublisherRequest) => {
    Modal.confirm({
      title: 'Xác nhận duyệt',
      content: `Bạn có chắc chắn muốn duyệt yêu cầu từ ${record.publisher}?`,
      onOk() {
        message.success('Đã duyệt yêu cầu thành công!');
        // TODO: Call API to approve request
      }
    });
  };

  const handleReject = (record: PublisherRequest) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: `Bạn có chắc chắn muốn từ chối yêu cầu từ ${record.publisher}?`,
      onOk() {
        message.success('Đã từ chối yêu cầu!');
        // TODO: Call API to reject request
      }
    });
  };

  const showDetail = (record: PublisherRequest) => {
    setSelectedRequest(record);
    setIsDetailModalVisible(true);
  };

  const columns: ColumnsType<PublisherRequest> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 60,
      align: 'center'
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.publisher
          .toLowerCase()
          .includes(value.toString().toLowerCase()) ||
        record.campaign.toLowerCase().includes(value.toString().toLowerCase())
    },
    {
      title: 'Chiến dịch',
      dataIndex: 'campaign',
      key: 'campaign'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Đã từ chối', value: 'rejected' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'requestDate',
      key: 'requestDate',
      sorter: (a, b) =>
        new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
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
          {record.status === 'pending' && (
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
        </div>
      )
    }
  ];

  const filteredData = mockData.filter((item) => {
    // Text search filter
    const matchesSearch =
      !searchText ||
      item.publisher.toLowerCase().includes(searchText.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchText.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                  onChange={setStatusFilter}
                  className="w-48"
                  placeholder="Lọc theo trạng thái"
                >
                  <Select.Option value="all">Tất cả trạng thái</Select.Option>
                  <Select.Option value="pending">Chờ duyệt</Select.Option>
                  <Select.Option value="approved">Đã duyệt</Select.Option>
                  <Select.Option value="rejected">Đã từ chối</Select.Option>
                </Select>
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
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`
              }}
              loading={false}
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
              selectedRequest?.status === 'pending' && (
                <Space key="actions">
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
              )
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
                      {selectedRequest.publisherInfo.name}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {selectedRequest.publisherInfo.email}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Website
                  </label>
                  <a
                    href={selectedRequest.publisherInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {selectedRequest.publisherInfo.website}
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Lượng truy cập tháng
                    </label>
                    <p className="text-xl font-bold text-orange-600">
                      {selectedRequest.publisherInfo.traffic.toLocaleString()}{' '}
                      lượt
                    </p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Ngày yêu cầu
                    </label>
                    <p className="text-lg font-medium text-gray-800">
                      {selectedRequest.requestDate}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Chiến dịch
                  </label>
                  <p className="text-lg font-medium text-gray-800">
                    {selectedRequest.campaign}
                  </p>
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

                <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Mô tả
                  </label>
                  <p className="leading-relaxed text-gray-700">
                    {selectedRequest.publisherInfo.description}
                  </p>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </BasePages>
  );
};

export default PublisherRequests;
