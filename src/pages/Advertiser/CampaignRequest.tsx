import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const projects = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Project ${String.fromCharCode(65 + (i % 26))}`,
  createdDate: `2025-0${(i % 9) + 1}-0${(i % 9) + 1}`,
  description: `Mô tả chiến dịch ${i + 1}`,
  executionTime: `2025-0${(i % 9) + 2}-0${(i % 9) + 1} to 2025-0${(i % 9) + 3}-1${(i % 9) + 1}`
}));

const PAGE_SIZE = 6;

const CampaignRequest = () => {
  const [allProjects, setAllProjects] = useState(projects);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // State cho modal chỉnh sửa
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // State cho modal xóa (nếu cần)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<any>(null);

  const filteredProjects = allProjects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const currentData = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Khi mở modal chỉnh sửa, tách executionTime thành executionStart & executionEnd
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

  const handleDeleteConfirm = () => {
    setAllProjects((prev) => prev.filter((p) => p.id !== deleteProject.id));
    toast.success(`Đã xóa chiến dịch ${deleteProject.name} thành công!`);
    closeDeleteModal();
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

  return (
    <div className="mb-20 rounded-xl bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách yêu cầu</h2>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="rounded-lg border px-3 py-2 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-hidden rounded-lg border bg-white shadow-md">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100 shadow">
              <tr>
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">
                  Tên chiến dịch & Ngày tạo
                </th>
                <th className="px-4 py-2 text-left">Mô tả</th>
                <th className="px-4 py-2 text-left">Thời gian thực hiện</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((project, index) => (
                <tr key={project.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="px-4 py-2">
                    <div>{project.name}</div>
                    <div className="text-sm text-gray-500">
                      Ngày tạo: {project.createdDate}
                    </div>
                  </td>
                  <td className="px-4 py-2">{project.description}</td>
                  <td className="px-4 py-2">{project.executionTime}</td>
                  <td className="mt-3 flex justify-center gap-3 px-4 py-2 text-center">
                    <button
                      className="text-yellow hover:text-gray-400"
                      onClick={() => openEditModal(project)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red hover:text-gray-400"
                      onClick={() => openDeleteModal(project)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-4 p-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-md rounded-lg bg-white px-4 py-2 font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal chỉnh sửa với layout nằm ngang */}
      {isEditOpen && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Chỉnh sửa chiến dịch</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Tên chiến dịch */}
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
              {/* Thời gian thực hiện: 2 lịch riêng cho bắt đầu & kết thúc */}
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
              {/* Mô tả */}
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

      {/* Modal xác nhận xóa */}
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
