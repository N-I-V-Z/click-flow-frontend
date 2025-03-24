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
// Đây là hook đã sửa để nhận status qua query param (hoặc bỏ nếu = undefined).
import { useGetCampaignAdvertiser } from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';

const decodedToken: TokenDecoded | null = helpers.decodeTokens(
  __helpers.cookie_get('AT')
);

const editableStatusOptions = [
  { name: 'Paused', displayName: 'Tạm dừng', color: 'bg-orange-500' },
  { name: 'Completed', displayName: 'Hoàn thành', color: 'bg-gray-500' }
];
// Các trạng thái có thể chọn (cả "All" để lấy tất cả)
type AdvertiserCampaignStatus =
  | 'All'
  | 'Pending'
  | 'Approved'
  | 'Activing'
  | 'Paused'
  | 'Canceled'
  | 'Completed';

// Giao diện hiển thị
interface Project {
  id: number;
  name: string;
  createdDate: string;
  advertiser: string;
  status: string;
  deadline: string;
}

// Khai báo các cặp name/displayName/color
const statusOptions = [
  { name: 'All', displayName: 'Tất cả', color: 'bg-gray-400' },
  { name: 'Pending', displayName: 'Chờ duyệt', color: 'bg-yellow-400' },
  { name: 'Approved', displayName: 'Đã duyệt', color: 'bg-green-500' },
  { name: 'Activing', displayName: 'Đang chạy', color: 'bg-[#1BA6F9]' },
  { name: 'Paused', displayName: 'Tạm dừng', color: 'bg-orange-500' },
  { name: 'Canceled', displayName: 'Đã hủy', color: 'bg-red-500' },
  { name: 'Completed', displayName: 'Hoàn thành', color: 'bg-gray-500' }
];

// Hàm lấy CSS class theo displayName
const getStatusClass = (displayName: string) => {
  const option = statusOptions.find((opt) => opt.displayName === displayName);
  return option ? option.color : 'bg-gray-400';
};

const AdvertiserCampaigns = () => {
  // Chọn trạng thái (hoặc "All")
  const [campaignStatus, setCampaignStatus] =
    useState<AdvertiserCampaignStatus>('All');

  // pageIndex, pageSize (demo cứng)
  const { pageIndex, pageSize } = __helpers.usePaginationParams();
  const advertiserId =
    decodedToken?.Id !== undefined ? parseInt(decodedToken?.Id) : 0;
  // Gọi API: nếu = "All" thì không truyền status (undefined) => lấy tất cả
  const { data, isLoading, isError } = useGetCampaignAdvertiser(
    advertiserId, // advertiserId giả sử = 3
    campaignStatus === 'All' ? undefined : campaignStatus,
    pageIndex,
    pageSize
  );

  // Mảng items

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

  // Map dữ liệu trả về sang Project

  // Lọc dữ liệu theo search
  const filteredData = useMemo(() => {
    return campaigns.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

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
      accessorKey: 'advertiser.companyName',
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
      accessorKey: 'endDate',
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
            <Eye size={18} className="text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProject(row.original);
              setIsEditOpen(true);
            }}
          >
            <Pencil size={18} className="text-yellow-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProject(row.original);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 size={18} className="text-red-500" />
          </Button>
        </div>
      )
    }
  ];
  console.log('campaigns:   ', campaigns);

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
      {/* (1) Chọn status để gọi API */}
      <div className="mb-4 flex items-center gap-2">
        <label>Trạng thái:</label>
        <select
          value={campaignStatus}
          onChange={(e) =>
            setCampaignStatus(e.target.value as AdvertiserCampaignStatus)
          }
          className="rounded border p-2"
        >
          {statusOptions.map((x) => (
            <option value={x.name}>{x.displayName}</option>
          ))}
        </select>
      </div>

      {/* Thanh công cụ: xóa nhiều, v.v. */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách yêu cầu</h2>
        {selectedRows.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="hover:bg-red-600 bg-red-500 rounded px-4 py-2 text-white"
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

      {/* Bảng DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        // Nếu muốn server-side pagination thì cần xử lý pageCount & onPageChange
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
              {selectedProject.advertiser.companyName || 'Chưa cập nhật'}
            </p>
            <p>Trạng thái: {selectedProject.status}</p>
            <p>
              Ngày bắt đầu: {new Date(selectedProject.startDate).toUTCString()}
            </p>
            <p>
              Ngày kết thúc: {new Date(selectedProject.endDate).toUTCString()}
            </p>
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
                    prev ? { ...prev, status: e.target.value } : null
                  )
                }
                className="rounded border p-2"
              >
                {editableStatusOptions.map((option) => (
                  <option key={option.name} value={option.name}>
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
                  // Thường bạn sẽ gọi API cập nhật:
                  // let newApiStatus = statusOptions.find(
                  //   (o) => o.displayName === selectedProject.status
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
