import { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
// Thư viện Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
// Thư viện Toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Tạo nhiều dữ liệu giả
const initialProjects = Array.from({ length: 50 }, (_, i) => ({
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
  ][i % 5],
  deadline: `2025-0${(i % 9) + 2}-1${(i % 9) + 1}`
}));

// Đổi màu dựa theo trạng thái
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Cần phê duyệt':
      return 'bg-yellow';
    case 'Đang thực hiện':
      return 'bg-blue';
    case 'Hoàn thành':
      return 'bg-green-500';
    case 'Tạm dừng':
      return 'bg-orange';
    case 'Đã từ chối':
      return 'bg-red';
    default:
      return 'bg-gray';
  }
};

// Số item mỗi trang
const PAGE_SIZE = 7;

// Data demo cho biểu đồ
const chartData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 240 },
  { name: 'Mar', value: 180 },
  { name: 'Apr', value: 300 },
  { name: 'May', value: 250 },
  { name: 'Jun', value: 400 }
];

const AdvertiserCampaigns = () => {
  // Dữ liệu gốc (dùng state để có thể xóa)
  const [allProjects, setAllProjects] = useState(initialProjects);

  // Phân trang, tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal sửa
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Modal xem chi tiết
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewProject, setViewProject] = useState<any>(null);

  // Modal xóa
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProject, setDeleteProject] = useState<any>(null);

  // Lọc theo tên
  const filteredProjects = allProjects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const currentData = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Mở modal edit
  const openEditModal = (project: any) => {
    setSelectedProject({ ...project });
    setIsOpen(true);
  };

  // Đóng modal edit
  const closeEditModal = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };

  // Mở modal xem chi tiết
  const openViewModal = (project: any) => {
    setViewProject(project);
    setIsViewOpen(true);
  };

  // Đóng modal xem chi tiết
  const closeViewModal = () => {
    setViewProject(null);
    setIsViewOpen(false);
  };

  // Mở modal xóa
  const openDeleteModal = (project: any) => {
    setDeleteProject(project);
    setIsDeleteOpen(true);
  };

  // Đóng modal xóa
  const closeDeleteModal = () => {
    setDeleteProject(null);
    setIsDeleteOpen(false);
  };

  // Xác nhận xóa
  const handleDelete = () => {
    if (deleteProject) {
      setAllProjects((prev) =>
        prev.filter((item) => item.id !== deleteProject.id)
      );
      toast.success(`Xóa chiến dịch "${deleteProject.name}" thành công!`);
    }
    closeDeleteModal();
  };

  // Xử lý khi thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSelectedProject({ ...selectedProject, [e.target.name]: e.target.value });
  };

  // Lưu dữ liệu
  const handleSave = () => {
    console.log('Lưu dữ liệu:', selectedProject);

    // Cập nhật trong mảng (nếu cần)
    if (selectedProject) {
      setAllProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? selectedProject : p))
      );
    }
    toast.success(`Cập nhật chiến dịch "${selectedProject.name}" thành công!`);
    closeEditModal();
  };

  return (
    <div className="p-6">
      {/* Thanh tìm kiếm */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quản lí chiến dịch</h2>
        <input
          type="text"
          placeholder="Tìm kiếm chiến dịch..."
          className="rounded-lg border px-3 py-2 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-md">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100 shadow">
              <tr>
                <th className="px-4 py-2 text-left">STT</th>
                <th className="px-4 py-2 text-left">Tên chiến dịch</th>
                <th className="px-4 py-2 text-left">Nhà quảng cáo</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Ngày kết thúc</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((project, index) => (
                <tr key={project.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="px-4 py-2">{project.name}</td>
                  <td className="px-4 py-2">{project.advertiser}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded px-2 py-1 text-sm text-white ${getStatusClass(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{project.deadline}</td>
                  <td className="flex justify-center gap-3 px-4 py-2 text-center">
                    {/* Nút xem chi tiết */}
                    <button
                      className="text-blue hover:text-gray-400"
                      onClick={() => openViewModal(project)}
                    >
                      <Eye size={18} />
                    </button>
                    {/* Nút edit */}
                    <button
                      onClick={() => openEditModal(project)}
                      className="text-yellow hover:text-gray-400"
                    >
                      <Pencil size={18} />
                    </button>
                    {/* Nút xóa */}
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

          {/* Phân trang */}
          <div className="flex items-center justify-center gap-4 bg-gray-100 p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-md rounded-lg bg-white px-4 py-2 font-medium">
              Page {currentPage} of {totalPages}
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
      </div>

      {/* Modal xem chi tiết (View Detail) */}
      {isViewOpen && viewProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mt-7 w-full max-w-4xl rounded-lg bg-white p-5 shadow-lg">
            {/* Tiêu đề */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Tên chiến dịch: {viewProject.name}
              </h2>
              <button
                onClick={closeViewModal}
                className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>

            {/* Các chỉ số */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              {/* Visits */}
              <div className="rounded-lg bg-gray-100 p-4 text-center">
                <div className="text-2xl font-bold">3,671</div>
                <div className="text-sm">Visits</div>
                <div className="text-xs text-green-500">+0.3%</div>
              </div>
              {/* New Users */}
              <div className="rounded-lg bg-gray-100 p-4 text-center">
                <div className="text-2xl font-bold">256</div>
                <div className="text-sm">New Users</div>
                <div className="text-xs text-green-500">+15.3%</div>
              </div>
              {/* Active Users */}
              <div className="rounded-lg bg-gray-100 p-4 text-center">
                <div className="text-2xl font-bold">2,318</div>
                <div className="text-sm">Active Users</div>
                <div className="text-xs text-green-500">+0.8%</div>
              </div>
            </div>

            {/* Biểu đồ đường (Line Chart) */}
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold">Users</h3>
              {/* Bộ chọn (tuần, tháng,...) chỉ là ví dụ tĩnh */}
              <select className="rounded border px-2 py-1 text-sm">
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <LineChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa (Edit) */}
      {isOpen && selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Chỉnh sửa chiến dịch</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Tên chiến dịch
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-lg border p-2"
                  value={selectedProject.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Nhà quảng cáo
                </label>
                <input
                  type="text"
                  name="advertiser"
                  className="w-full rounded-lg border p-2"
                  value={selectedProject.advertiser}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Ngày tạo</label>
                <input
                  type="date"
                  name="createdDate"
                  className="w-full rounded-lg border p-2"
                  value={selectedProject.createdDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Trạng thái</label>
                <select
                  name="status"
                  className="w-full rounded-lg border p-2"
                  value={selectedProject.status}
                  onChange={handleChange}
                >
                  <option value="Cần phê duyệt">Cần phê duyệt</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                  <option value="Đã từ chối">Đã từ chối</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="deadline"
                  className="w-full rounded-lg border p-2"
                  value={selectedProject.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
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
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Xác nhận xóa</h2>
            <p className="mb-6 text-sm">
              Bạn có chắc chắn muốn xóa chiến dịch{' '}
              <span className="font-medium">{deleteProject.name}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="hover:bg-red-600 rounded bg-red px-4 py-2 text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
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

export default AdvertiserCampaigns;
