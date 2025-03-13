import { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColumnDef } from '@tanstack/react-table';

import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  name: string;
  createdDate: string;
  advertiser: string;
  status:
    | 'Cần phê duyệt'
    | 'Đang thực hiện'
    | 'Hoàn thành'
    | 'Tạm dừng'
    | 'Đã từ chối';
  deadline: string;
}

const initialProjects: Project[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Project ${String.fromCharCode(65 + (i % 26))}`,
  createdDate: `2025-0${(i % 9) + 1}-0${(i % 9) + 1}`,
  advertiser: `Advertiser ${i + 1}`,
  status: [
    'Cần phê duyệt',
    'Đang thực hiện',
    'Hoàn thành',
    'Tạm dừng',
    'Đã từ chối'
  ][i % 5] as Project['status'],
  deadline: `2025-0${(i % 9) + 2}-1${(i % 9) + 1}`
}));

const AdvertiserCampaigns = () => {
  const [allProjects, setAllProjects] = useState(initialProjects);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // Từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Lưu trạng thái chọn nhiều dòng (rowSelection) của bảng
  // Dạng: { '1': true, '2': false, ... } => true nghĩa là dòng đó được chọn
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Modal states (xem, sửa, xóa đơn lẻ)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = useMemo(() => {
    return allProjects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProjects]);

  // Cột cho DataTable
  const columns: ColumnDef<Project>[] = [
    // Cột checkbox để chọn nhiều
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
    // Cột STT (tự tính theo chỉ số dòng)
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
          {/* Xem chi tiết */}
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
          {/* Sửa */}
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
          {/* Xóa đơn lẻ */}
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

  // Xử lý xóa đơn lẻ (trong modal xác nhận)
  const handleDeleteSingle = () => {
    if (selectedProject) {
      setAllProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      toast.success(`Xóa chiến dịch "${selectedProject.name}" thành công!`);
    }
    setIsDeleteOpen(false);
    setSelectedProject(null);
  };

  // Xử lý xóa nhiều (bằng checkbox)
  const handleDeleteMulti = () => {
    // Lấy các id dòng đã chọn
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    if (selectedIds.length === 0) {
      toast.info('Không có chiến dịch nào được chọn!');
      return;
    }
    // Xóa các project có id trong selectedIds
    setAllProjects((prev) =>
      prev.filter((p) => !selectedIds.includes(p.id.toString()))
    );
    toast.success(`Đã xóa ${selectedIds.length} chiến dịch thành công!`);
    // Reset rowSelection
    setRowSelection({});
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    setAllProjects((prev) =>
      prev.filter(
        (project) =>
          !selectedRows.some((selected: any) => selected.id === project.id)
      )
    );
    toast.success(`Đã xóa ${selectedRows.length} chiến dịch thành công!`);
    // Reset row selection
    setRowSelection({});
  };

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
        // Quan trọng: Truyền rowSelection và callback
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

      {/* Modal Xem chi tiết (demo) */}
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

      {/* Modal Sửa (demo) */}
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
                <option value="Cần phê duyệt">Cần phê duyệt</option>
                <option value="Đang thực hiện">Đang thực hiện</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
                <option value="Đã từ chối">Đã từ chối</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  // Lưu thay đổi vào allProjects
                  if (selectedProject) {
                    setAllProjects((prev) =>
                      prev.map((p) =>
                        p.id === selectedProject.id ? selectedProject : p
                      )
                    );
                    toast.success(`Đã cập nhật "${selectedProject.name}"!`);
                  }
                  setIsEditOpen(false);
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

// Hàm đổi màu trạng thái
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Cần phê duyệt':
      return 'bg-yellow';
    case 'Đang thực hiện':
      return 'bg-blue';
    case 'Hoàn thành':
      return 'bg-[#00AE72]';
    case 'Tạm dừng':
      return 'bg-orange';
    case 'Đã từ chối':
      return 'bg-red';
    default:
      return 'bg-gray';
  }
};

export default AdvertiserCampaigns;
