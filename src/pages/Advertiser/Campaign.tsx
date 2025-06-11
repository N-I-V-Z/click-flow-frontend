import { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from 'antd';
import { usePageTitle } from '@/hooks/use-pagetitle';
import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';
import { useGetCampaignAdvertiser } from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';
import BasePages from '@/components/shared/base-pages';
import Loading from '@/components/ui/loading';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);

function formatDate(dateString?: string | Date): string {
  if (!dateString) return '';

  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    Pending: {
      color: '#fbbf24',
      bgColor: '#fef3c7',
      borderColor: '#fde68a',
      text: 'Chờ duyệt'
    },
    Approved: {
      color: '#10b981',
      bgColor: '#d1fae5',
      borderColor: '#a7f3d0',
      text: 'Đã duyệt'
    },
    Activing: {
      color: '#1BA6F9',
      bgColor: '#dbeafe',
      borderColor: '#bfdbfe',
      text: 'Đang chạy'
    },
    Paused: {
      color: '#f97316',
      bgColor: '#fed7aa',
      borderColor: '#fdba74',
      text: 'Tạm dừng'
    },
    Canceled: {
      color: '#ef4444',
      bgColor: '#fee2e2',
      borderColor: '#fecaca',
      text: 'Đã hủy'
    },
    Completed: {
      color: '#6b7280',
      bgColor: '#f3f4f6',
      borderColor: '#d1d5db',
      text: 'Hoàn thành'
    }
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <Badge
      count={config.text}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`
      }}
    />
  );
};

const editableStatusOptions = [
  { name: 'Paused', displayName: 'Tạm dừng', color: 'bg-orange' },
  { name: 'Completed', displayName: 'Hoàn thành', color: 'bg-gray' }
];

type AdvertiserCampaignStatus =
  | 'All'
  | 'Pending'
  | 'Approved'
  | 'Activing'
  | 'Paused'
  | 'Canceled'
  | 'Completed';

const statusOptions = [
  { name: 'All', displayName: 'Tất cả', color: 'bg-gray' },
  { name: 'Pending', displayName: 'Chờ duyệt', color: 'bg-yellow' },
  { name: 'Approved', displayName: 'Đã duyệt', color: 'bg-green' },
  { name: 'Activing', displayName: 'Đang chạy', color: 'bg-[#1BA6F9]' },
  { name: 'Paused', displayName: 'Tạm dừng', color: 'bg-orange' },
  { name: 'Canceled', displayName: 'Đã hủy', color: 'bg-red' },
  { name: 'Completed', displayName: 'Hoàn thành', color: 'bg-gray' }
];

const Modal = ({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-2xl leading-none text-gray-500"
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);

const AdvertiserCampaigns = () => {
  usePageTitle('Chiến dịch | Click Flow');
  const [campaignStatus, setCampaignStatus] =
    useState<AdvertiserCampaignStatus>('All');
  const { pageIndex, pageSize } = __helpers.usePaginationParams();
  const advertiserId =
    decodedToken?.Id !== undefined ? parseInt(decodedToken?.Id) : 0;
  const { data, isLoading, isError } = useGetCampaignAdvertiser(
    advertiserId,
    campaignStatus === 'All' ? undefined : campaignStatus,
    pageIndex,
    pageSize
  );
  const [searchTerm] = useState('');
  const [selectedProject, setSelectedProject] =
    useState<CampaignApiResponse | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const campaigns = useMemo(() => {
    return (
      (data as ApiResponse<PagingResponse<CampaignApiResponse>>)?.result
        ?.datas || []
    );
  }, [data]);

  const filteredData = useMemo(() => {
    return campaigns.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

  const columns: ColumnDef<CampaignApiResponse>[] = [
    {
      id: 'stt',
      header: () => (
        <div className="text-center font-semibold text-gray-700">STT</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            count={row.index + 1}
            style={{
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              border: '1px solid #e0f2fe'
            }}
          />
        </div>
      ),
      size: 60
    },
    {
      accessorKey: 'name',
      header: () => (
        <div className="font-semibold text-gray-700">TÊN CHIẾN DỊCH</div>
      ),
      cell: ({ row }) => {
        const name = row.original.name;
        const createdAt = row.original.startDate;
        const createdDate = formatDate(createdAt);
        return (
          <div className="max-w-xs">
            <p className="truncate font-medium text-gray-900" title={name}>
              {name}
            </p>
            <p className="text-sm text-gray-500">
              Ngày tạo: {createdDate || 'Chưa cập nhật'}
            </p>
          </div>
        );
      }
    },
    {
      accessorKey: 'advertiser.companyName',
      header: () => (
        <div className="font-semibold text-gray-700">NHÀ QUẢNG CÁO</div>
      ),
      cell: ({ row }) => {
        const companyName = row.original?.advertiser?.companyName || '-';
        return (
          <div className="max-w-xs">
            <p
              className="truncate font-medium text-gray-900"
              title={companyName}
            >
              {companyName}
            </p>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="text-center font-semibold text-gray-700">
          TRẠNG THÁI
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {getStatusBadge(row.original?.status || 'Pending')}
        </div>
      ),
      size: 120
    },
    {
      accessorKey: 'budget',
      header: () => (
        <div className="text-right font-semibold text-gray-700">NGÂN SÁCH</div>
      ),
      cell: ({ row }) => {
        const budget = row.original?.budget;
        return (
          <div className="text-center">
            <span className="font-semibold text-green-600">
              {budget
                ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(budget)
                : '-'}
            </span>
          </div>
        );
      },
      size: 140
    },
    {
      id: 'actions',
      header: () => (
        <div className="ml-8 text-center font-semibold text-gray-700">
          THAO TÁC
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setSelectedProject(row.original);
              setIsViewOpen(true);
            }}
            className="bg-blue-50 hover:bg-blue-100 rounded-full p-2 text-blue transition-colors duration-200"
            title="Xem chi tiết"
          >
            <Eye className="text-sm" size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedProject(row.original);
              setIsEditOpen(true);
            }}
            className="bg-yellow-50 hover:bg-yellow-100 rounded-full p-2 text-yellow transition-colors duration-200"
            title="Chỉnh sửa"
          >
            <Pencil className="text-sm" size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedProject(row.original);
              setIsDeleteOpen(true);
            }}
            className="bg-red-50 hover:bg-red-100 rounded-full p-2 text-red transition-colors duration-200"
            title="Xóa chiến dịch"
          >
            <Trash2 className="text-sm" size={16} />
          </button>
        </div>
      ),
      size: 140
    }
  ];

  const handleDeleteSingle = () => {
    if (selectedProject) {
      toast.success(`Xóa chiến dịch "${selectedProject.name}" thành công!`);
    }
    setIsDeleteOpen(false);
    setSelectedProject(null);
  };

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (isError) {
    return (
      <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="bg-red-100 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                className="text-red-600 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Oops! Có lỗi xảy ra
            </h3>
            <p className="text-gray-600">
              Không thể tải dữ liệu chiến dịch. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Danh sách chiến dịch">
      <div className="-ml-6 mt-2 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl py-2 sm:px-6 lg:px-1">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-10 py-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Danh sách chiến dịch
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredData?.length || 0} chiến dịch)
                  </span>
                </h2>
              </div>
            </div>

            <div className="px-10 py-4">
              <div className="-mb-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="font-medium text-gray-700">
                    Trạng thái:
                  </label>
                  <select
                    value={campaignStatus}
                    onChange={(e) =>
                      setCampaignStatus(
                        e.target.value as AdvertiserCampaignStatus
                      )
                    }
                    className="focus:border-blue-500 focus:ring-blue-500 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  >
                    {statusOptions.map((x) => (
                      <option key={x.name} value={x.name}>
                        {x.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="-mb-10 p-8">
              <DataTable
                columns={columns}
                data={filteredData}
                pageCount={Math.ceil(filteredData.length / 10)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {isDeleteOpen && selectedProject && (
          <Modal title="Xác nhận xóa" onClose={() => setIsDeleteOpen(false)}>
            <p className="mb-6 text-sm">
              Bạn có chắc chắn muốn xóa chiến dịch{' '}
              <span className="font-medium">{selectedProject.name}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteSingle}>
                Xóa
              </Button>
            </div>
          </Modal>
        )}

        {isViewOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative -top-4 max-h-[85vh] w-full max-w-2xl rounded-lg bg-white shadow-xl">
              {/* Header */}
              <div className="from-blue-600 bg-gradient-to-r to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <Eye className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-black">
                        Chi tiết chiến dịch
                      </h1>
                      <p className="text-sm text-black">
                        {selectedProject.name || 'Untitled Campaign'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsViewOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-black hover:bg-white/30"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] p-6">
                {/* Campaign Image & Basic Info */}
                <div className="mb-6 rounded-lg bg-gradient-to-r from-gray-50 to-white p-4">
                  <div className="-mt-10 flex items-start space-x-4 ">
                    <div className="h-32 w-40 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 ">
                      {selectedProject.image ? (
                        <img
                          src={selectedProject.image}
                          alt={selectedProject.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <Eye className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {selectedProject.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">
                        {selectedProject.description || 'Chưa có mô tả'}
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          {getStatusBadge(selectedProject.status || 'Pending')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="border-blue-500 bg-blue-50 rounded-lg border-l-4 p-4">
                    <label className="text-blue-600 text-xs font-medium uppercase tracking-wide">
                      NHÀ QUẢNG CÁO
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedProject.advertiser.companyName ||
                        'Chưa cập nhật'}
                    </p>
                  </div>

                  <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                    <label className="text-xs font-medium uppercase tracking-wide text-green-600">
                      NGÂN SÁCH
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedProject.budget
                        ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(selectedProject.budget)
                        : 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div className="border-orange-500 bg-orange-50 rounded-lg border-l-4 p-4">
                    <label className="text-orange-600 text-xs font-medium uppercase tracking-wide">
                      NGÀY BẮT ĐẦU
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(selectedProject.startDate) || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div className="border-red-500 bg-red-50 rounded-lg border-l-4 p-4">
                    <label className="text-red-600 text-xs font-medium uppercase tracking-wide">
                      NGÀY KẾT THÚC
                    </label>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(selectedProject.endDate) || 'Chưa cập nhật'}
                    </p>
                  </div>

                  {selectedProject.typeCampaign && (
                    <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
                      <label className="text-xs font-medium uppercase tracking-wide text-purple-600">
                        LOẠI CHIẾN DỊCH
                      </label>
                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {selectedProject.typeCampaign}
                      </p>
                    </div>
                  )}

                  {selectedProject.originURL && (
                    <div className="rounded-lg border-l-4 border-gray-500 bg-gray-50 p-4">
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-600">
                        URL GỐC
                      </label>
                      <p
                        className="mt-1 truncate font-mono text-sm text-gray-800"
                        title={selectedProject.originURL}
                      >
                        {selectedProject.originURL}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="rounded-lg border-t bg-gray-50 px-6 py-4">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsViewOpen(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditOpen && selectedProject && (
          <Modal
            title={`Sửa: ${selectedProject.name}`}
            onClose={() => setIsEditOpen(false)}
          >
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block font-medium">Tên chiến dịch</label>
                <input
                  type="text"
                  value={selectedProject.name}
                  onChange={(e) =>
                    setSelectedProject((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">Trạng thái</label>
                <select
                  value={selectedProject.status}
                  onChange={(e) =>
                    setSelectedProject((prev) =>
                      prev ? { ...prev, status: e.target.value } : null
                    )
                  }
                  className="w-full rounded border p-2"
                >
                  {editableStatusOptions.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  toast.success(`Đã cập nhật "${selectedProject.name}"!`);
                  setIsEditOpen(false);
                }}
              >
                Lưu
              </Button>
            </div>
          </Modal>
        )}

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
        />
      </div>
    </BasePages>
  );
};

export default AdvertiserCampaigns;
