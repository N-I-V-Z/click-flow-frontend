import { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';

// Import custom hook gọi API đúng tên
import { useGetCampaignsByAdvertiser } from '@/queries/campaign.query';

interface Project {
  id: number;
  name: string;
  createdDate: string;
  advertiser: string;
  status: 'Đã duyệt' | 'Đang hoạt động' | 'Tạm dừng' | 'Đã hủy' | 'Hoàn thành';
  deadline: string;
}

// Danh sách trạng thái cập nhật
const statusOptions = [
  { value: 0, name: 'Pending', displayName: 'Chờ duyệt', color: 'bg-yellow' },
  { value: 1, name: 'Approved', displayName: 'Đã duyệt', color: 'bg-purple' },
  {
    value: 2,
    name: 'Activing',
    displayName: 'Đang hoạt động',
    color: 'bg-blue'
  },
  { value: 3, name: 'Paused', displayName: 'Tạm dừng', color: 'bg-orange' },
  { value: 4, name: 'Canceled', displayName: 'Đã hủy', color: 'bg-red' },
  {
    value: 5,
    name: 'Completed',
    displayName: 'Hoàn thành',
    color: 'bg-[#00AE72]'
  }
];

// Hàm tìm màu theo trạng thái dựa vào displayName
const getStatusClass = (status: string) => {
  const option = statusOptions.find((opt) => opt.displayName === status);
  return option ? option.color : 'bg-gray';
};

const AdvertiserCampaigns = () => {
  // Giả sử advertiserId = 1, pageIndex = 1, pageSize = 10
  const advertiserId = 1;
  const pageIndex = 1;
  const pageSize = 10;

  // Gọi custom hook để lấy danh sách campaign theo advertiser
  const {
    data: campaigns, // Mảng campaign lấy từ API
    isLoading,
    isError
  } = useGetCampaignsByAdvertiser(advertiserId, pageIndex, pageSize);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Map dữ liệu API thành mảng Project cho bảng
  const mappedData: Project[] = useMemo(() => {
    if (!campaigns) return [];

    return campaigns.map((c: any) => {
      // Nếu API trả về status dưới dạng "Approved", "Activing",... thì chuyển sang displayName tương ứng.
      const foundStatus = statusOptions.find(
        (option) => option.name === c.status
      );
      return {
        id: c.id,
        name: c.name,
        createdDate: c.startDate ?? '',
        advertiser: c.advertiser?.companyName ?? '',
        status: foundStatus ? foundStatus.displayName : 'Đã duyệt',
        deadline: c.endDate ?? ''
      };
    });
  }, [campaigns]);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = useMemo(() => {
    return mappedData.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, mappedData]);

  // Định nghĩa cột cho DataTable
  const columns: ColumnDef<Project>[] = [
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
    // Có thể gọi refetch() để load lại dữ liệu nếu cần
  };

  // Xử lý xóa nhiều
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    toast.success(`Đã xóa ${selectedRows.length} chiến dịch thành công!`);
    setRowSelection({});
    // Có thể gọi refetch() để load lại dữ liệu nếu cần
  };

  if (isLoading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  if (isError) {
    return <div className="p-6">Lỗi khi tải dữ liệu.</div>;
  }

  return (
    <div className="p-6">
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
            <p>Nhà quảng cáo: {selectedProject.advertiser}</p>
            <p>Trạng thái: {selectedProject.status}</p>
            <p>Ngày tạo: {selectedProject.createdDate}</p>
            <p>Deadline: {selectedProject.deadline}</p>
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
                          status: e.target.value as Project['status']
                        }
                      : null
                  )
                }
                className="rounded border p-2"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.displayName}>
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
