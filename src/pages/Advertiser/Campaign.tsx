import { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';

import { useGetPublisherParticipationByStatusForAdvertiser } from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';

// Kiểu gốc API
type CampaignParticipationStatus = 'Pending' | 'Participated' | 'Rejected';

const statusOptions = [
  { name: 'Pending', displayName: 'Chờ duyệt', color: 'bg-yellow' },
  { name: 'Participated', displayName: 'Đã tham gia', color: 'bg-purple' },
  { name: 'Rejected', displayName: 'Đã từ chối', color: 'bg-red' }
];

const getStatusClass = (displayName: string) => {
  const option = statusOptions.find((opt) => opt.displayName === displayName);
  return option ? option.color : 'bg-gray';
};

const AdvertiserCampaigns = () => {
  // Chọn 1 trong 3 status để call API
  const [campaignStatus, setCampaignStatus] =
    useState<CampaignParticipationStatus>('Pending');

  // pageIndex, pageSize
  const pageIndex = 1;
  const pageSize = 10;

  // Lấy data
  const { data, isLoading, isError } =
    useGetPublisherParticipationByStatusForAdvertiser(
      pageIndex,
      pageSize,
      campaignStatus
    );

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<CampaignApiResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [selectedProject, setSelectedProject] =
    useState<CampaignApiResponse | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const campaigns =
    (data as ApiResponse<PagingResponse<CampaignApiResponse>>)?.result?.datas ||
    [];

  // Lọc dữ liệu theo search
  const filteredData = () => {
    return campaigns.filter((campaign) =>
      campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Cột cho DataTable
  const columns: ColumnDef<CampaignApiResponse>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
        />
      )
    },
    {
      id: 'stt',
      header: 'STT',
      cell: ({ row }) => row.index + 1
    },
    {
      accessorKey: 'name',
      header: 'Tên chiến dịch'
    },
    {
      accessorKey: 'advertiser',
      header: 'Nhà quảng cáo'
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`rounded px-2 py-1 text-white ${getStatusClass(status)}`}
          >
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: 'deadline',
      header: 'Ngày kết thúc'
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <div className="-ml-6 flex">
          <Button
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

  // Xử lý xóa đơn lẻ
  const handleDeleteSingle = () => {
    if (selectedProject) {
      toast.success(`Xóa chiến dịch "${selectedProject.name}" thành công!`);
    }
    setIsDeleteOpen(false);
    setSelectedProject(null);
  };

  // Xử lý xóa nhiều
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
      {/* Chọn status (Pending/Participated/Rejected) để call API */}
      <div className="mb-4 flex items-center gap-2">
        <label>Trạng thái:</label>
        <select
          value={campaignStatus}
          onChange={(e) =>
            setCampaignStatus(e.target.value as CampaignParticipationStatus)
          }
          className="rounded border p-2"
        >
          {statusOptions.map((x) => (
            <option value={x.name}>{x.displayName}</option>
          ))}
        </select>
      </div>

      {/* Tiêu đề & thanh công cụ */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách yêu cầu</h2>
        {selectedRows.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="hover:bg-red-600 rounded bg-red px-4 py-2 text-white"
          >
            Xóa đã chọn ({selectedRows.length})
          </button>
        )}
      </div>

      {/* Thanh search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên chiến dịch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded border p-2"
        />
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={filteredData}
        pageCount={Math.ceil(filteredData.length / 10)}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onSelectedRowsChange={setSelectedRows}
      />

      {/* Modal Xóa (đơn lẻ) */}
      {isDeleteOpen && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Xác nhận xóa</h2>
            <p className="mb-6 text-sm">
              Bạn có chắc chắn muốn xóa chiến dịch{' '}
              <span className="font-medium">{selectedProject.name}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteSingle}>
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết */}
      {isViewOpen && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Chi tiết: {selectedProject.name}
            </h2>
            <p>
              Nhà quảng cáo:{' '}
              {selectedProject.advertiser.applicationUser.fullName}
            </p>
            <p>Trạng thái: {selectedProject.status}</p>
            <p>Ngày bắt đầu: {selectedProject.startDate.toUTCString()}</p>
            <p>Ngày kết thúc: {selectedProject.endDate.toUTCString()}</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sửa */}
      {isEditOpen && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Sửa: {selectedProject.name}
            </h2>
            <div className="flex flex-col gap-2">
              <label>Tên chiến dịch</label>
              <input
                type="text"
                value={selectedProject.name}
                onChange={(e) =>
                  setSelectedProject((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="rounded border p-2"
              />
              <label>Trạng thái</label>
              <select
                value={selectedProject.status}
                onChange={(e) =>
                  setSelectedProject((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: e.target
                            .value as CampaignApiResponse['status']
                        }
                      : null
                  )
                }
                className="rounded border p-2"
              >
                {statusOptions.map((option) => (
                  <option key={option.name} value={option.displayName}>
                    {option.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  // Nếu cần gọi API cập nhật, ta lấy name gốc:
                  // const originalStatus = statusOptions.find(
                  //   (opt) => opt.displayName === selectedProject.status
                  // )?.name;
                  toast.success(`Đã cập nhật "${selectedProject.name}"!`);
                  setIsEditOpen(false);
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
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
