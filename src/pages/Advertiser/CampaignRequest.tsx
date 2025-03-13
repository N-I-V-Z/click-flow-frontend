import { useState, useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '@/components/shared/data-table';

// Dữ liệu mẫu
const projects = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Project ${String.fromCharCode(65 + (i % 26))}`,
  createdDate: `2025-0${(i % 9) + 1}-0${(i % 9) + 1}`,
  description: `Mô tả chiến dịch ${i + 1}`,
  executionTime: `2025-0${(i % 9) + 2}-0${(i % 9) + 1} to 2025-0${(i % 9) + 3}-1${(i % 9) + 1}`
}));

const CampaignRequest = () => {
  const [allProjects, setAllProjects] = useState(projects);

  // State cho modal chỉnh sửa
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // State cho modal xóa đơn
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<any>(null);

  // State quản lý row selection của DataTable (được truyền từ DataTable)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  // State chứa danh sách các dòng được chọn (dữ liệu gốc)
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // Mở modal chỉnh sửa: tách executionTime thành executionStart & executionEnd
  const openEditModal = (project: any) => {
    let executionStart = '';
    let executionEnd = '';
    if (project.executionTime) {
      const parts = project.executionTime.split(' to ');
      executionStart = parts[0];
      executionEnd = parts[1];
    }
    setSelectedProject({ ...project, executionStart, executionEnd });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProject(null);
    setIsEditOpen(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedProject({ ...selectedProject, [e.target.name]: e.target.value });
  };

  // Khi lưu, kết hợp executionStart & executionEnd thành executionTime
  const handleEditSave = () => {
    const updatedProject = {
      ...selectedProject,
      executionTime: `${selectedProject.executionStart} to ${selectedProject.executionEnd}`
    };
    setAllProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    toast.success(`Cập nhật chiến dịch ${updatedProject.name} thành công!`);
    closeEditModal();
  };

  const openDeleteModal = (project: any) => {
    setDeleteProject(project);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteProject(null);
    setIsDeleteOpen(false);
  };

  const handleDeleteConfirm = () => {
    setAllProjects((prev) => prev.filter((p) => p.id !== deleteProject.id));
    toast.success(`Đã xóa chiến dịch ${deleteProject.name} thành công!`);
    closeDeleteModal();
  };

  // Định nghĩa các cột cho DataTable
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: any) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
          />
        ),
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
          />
        )
      },
      {
        // Cột số thứ tự (STT): tính theo trang hiện tại
        header: 'STT',
        cell: ({ row, table }: any) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        }
      },
      {
        header: 'Tên chiến dịch & Ngày tạo',
        cell: ({ row }: any) => (
          <div>
            <div>{row.original.name}</div>
            <div className="text-sm text-gray-500">
              Ngày tạo: {row.original.createdDate}
            </div>
          </div>
        )
      },
      {
        header: 'Mô tả',
        accessorKey: 'description'
      },
      {
        header: 'Thời gian thực hiện',
        accessorKey: 'executionTime'
      },
      {
        header: 'Thao tác',
        cell: ({ row }: any) => (
          <div className="flex gap-3">
            <button
              onClick={() => openEditModal(row.original)}
              className="text-yellow hover:text-gray-400"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => openDeleteModal(row.original)}
              className="text-red hover:text-gray-400"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )
      }
    ],
    [openEditModal, openDeleteModal]
  );

  // Hàm xóa các dòng được chọn (bulk delete)
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
    <div className="mb-20 rounded-xl bg-white p-6">
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
      <DataTable
        columns={columns}
        data={allProjects}
        pageCount={Math.ceil(allProjects.length / 10)}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        heightTable="80dvh"
        // Cho DataTable nhận rowSelection và callback cập nhật rowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        // Callback để DataTable gửi về danh sách các dòng được chọn (dữ liệu gốc)
        onSelectedRowsChange={setSelectedRows}
      />

      {/* Modal chỉnh sửa */}
      {isEditOpen && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Chỉnh sửa chiến dịch</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <label className="w-40 text-sm font-medium">
                  Tên chiến dịch
                </label>
                <input
                  type="text"
                  name="name"
                  className="flex-1 rounded-lg border p-2"
                  value={selectedProject.name}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Bắt đầu</label>
                  <input
                    type="date"
                    name="executionStart"
                    className="flex-1 rounded-lg border p-2"
                    value={selectedProject.executionStart}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-40 text-sm font-medium">Kết thúc</label>
                  <input
                    type="date"
                    name="executionEnd"
                    className="flex-1 rounded-lg border p-2"
                    value={selectedProject.executionEnd}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center space-x-4">
                <label className="w-40 text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  className="flex-1 rounded-lg border p-2"
                  value={selectedProject.description}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSave}
                className="hover:bg-blue-600 rounded bg-blue px-4 py-2 text-white"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa đơn */}
      {isDeleteOpen && deleteProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Xác nhận xóa</h2>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa chiến dịch{' '}
              <strong>{deleteProject.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="hover:bg-red-600 rounded bg-red px-4 py-2 text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default CampaignRequest;
