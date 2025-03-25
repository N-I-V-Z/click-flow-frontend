import { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';

import { TokenDecoded } from '@/types';
import helpers from '@/helpers';
import __helpers from '@/helpers';

import { useGetCampaignAdvertiser } from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);

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

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<CampaignApiResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
      header: 'STT',
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'name',
      header: 'Tên chiến dịch',
      cell: ({ row }) => {
        const name = row.original.name;
        const createdAt = row.original.startDate;
        const createdDate = createdAt
          ? new Date(createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : 'Chưa cập nhật';
        return (
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">Ngày tạo: {createdDate}</div>
          </div>
        );
      }
    },
    {
      accessorKey: 'advertiser.companyName',
      header: 'Nhà quảng cáo'
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.status;
        const option = statusOptions.find((opt) => opt.name === status);

        if (!option) {
          return (
            <span className="bg-gray rounded px-2 py-1 text-white">
              {status}
            </span>
          );
        }

        return (
          <span className={`rounded px-2 py-1 text-white ${option.color}`}>
            {option.displayName}
          </span>
        );
      }
    },

    {
      accessorKey: 'endDate',
      header: 'Ngày kết thúc',
      cell: ({ row }) => {
        const dateString = row.original.endDate;
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },

    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            className="-ml-8"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProject(row.original);
              setIsViewOpen(true);
            }}
          >
            <Eye size={18} className="text-blue" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProject(row.original);
              setIsEditOpen(true);
            }}
          >
            <Pencil size={18} className="text-yellow" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProject(row.original);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 size={18} className="text-red" />
          </Button>
        </div>
      )
    }
  ];

  const handleDeleteSingle = () => {
    if (selectedProject) {
      toast.success(`Xóa chiến dịch "${selectedProject.name}" thành công!`);
    }
    setIsDeleteOpen(false);
    setSelectedProject(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    toast.success(`Đã xóa ${selectedRows.length} chiến dịch thành công!`);
    setRowSelection({});
  };

  if (isLoading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  if (isError) {
    return <div className="p-6">Lỗi khi tải dữ liệu.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Danh sách yêu cầu</h2>
        {selectedRows.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            Xóa đã chọn ({selectedRows.length})
          </Button>
        )}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Trạng thái:</label>
          <select
            value={campaignStatus}
            onChange={(e) =>
              setCampaignStatus(e.target.value as AdvertiserCampaignStatus)
            }
            className="rounded border p-2"
          >
            {statusOptions.map((x) => (
              <option key={x.name} value={x.name}>
                {x.displayName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Tìm theo tên chiến dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pageCount={Math.ceil(filteredData.length / 10)}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onSelectedRowsChange={setSelectedRows}
      />

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
        <Modal
          title={`Chi tiết: ${selectedProject.name}`}
          onClose={() => setIsViewOpen(false)}
        >
          <div className="space-y-2 text-sm">
            <p>
              <strong>Nhà quảng cáo:</strong>{' '}
              {selectedProject.advertiser.companyName || 'Chưa cập nhật'}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedProject.status}
            </p>
            <p>
              <strong>Ngày bắt đầu:</strong>{' '}
              {new Date(selectedProject.startDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong>{' '}
              {new Date(selectedProject.endDate).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </div>
        </Modal>
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
  );
};

export default AdvertiserCampaigns;
