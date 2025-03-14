import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCampaignAdvertiser } from '@/queries/campaign.query';

// Interface cho 1 chiến dịch
interface RequestCampaign {
  id: number;
  name: string;
  createdAt: string; // hoặc Date
  endAt: string; // hoặc Date
  advertiserName: string;
  status: string; // Pending, Approved, ...
}

const CampaignRequest: React.FC = () => {
  const navigate = useNavigate();

  // Gọi API lấy danh sách campaigns có status = "Pending"
  const { data, isLoading, error } = useGetCampaignAdvertiser(1, 1, 10);

  // Giả sử backend trả về { result: [ {id, name, ...} ] }
  const campaigns: RequestCampaign[] = data?.result ?? [];
  // Lưu dữ liệu vào state cục bộ để có thể chỉnh sửa, xóa
  const [localCampaigns, setLocalCampaigns] = useState<RequestCampaign[]>([]);
  useEffect(() => {
    setLocalCampaigns(campaigns);
  }, [campaigns]);

  // State cho modal chỉnh sửa
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // State cho modal xóa
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  // Campaign được chọn cho chỉnh sửa/xóa
  const [selectedCampaign, setSelectedCampaign] =
    useState<RequestCampaign | null>(null);
  // State lưu thông tin chỉnh sửa (copy của selectedCampaign)
  const [editedCampaign, setEditedCampaign] = useState<RequestCampaign | null>(
    null
  );

  // Mở modal chỉnh sửa: copy dữ liệu chiến dịch được chọn
  const openEditModal = (campaign: RequestCampaign) => {
    setSelectedCampaign(campaign);
    setEditedCampaign({ ...campaign });
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedCampaign(null);
    setEditedCampaign(null);
    setIsEditModalVisible(false);
  };

  // Xử lý thay đổi input trong modal chỉnh sửa
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedCampaign) {
      setEditedCampaign({
        ...editedCampaign,
        [e.target.name]: e.target.value
      });
    }
  };

  // Lưu thông tin chỉnh sửa
  const handleEditSave = () => {
    if (editedCampaign) {
      setLocalCampaigns((prev) =>
        prev.map((camp) =>
          camp.id === editedCampaign.id ? editedCampaign : camp
        )
      );
      toast.success(`Cập nhật chiến dịch ${editedCampaign.name} thành công!`);
      closeEditModal();
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (campaign: RequestCampaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedCampaign(null);
    setIsDeleteModalVisible(false);
  };

  // Xác nhận xóa chiến dịch
  const handleDeleteConfirm = () => {
    if (selectedCampaign) {
      setLocalCampaigns((prev) =>
        prev.filter((camp) => camp.id !== selectedCampaign.id)
      );
      toast.success(`Đã xóa chiến dịch ${selectedCampaign.name} thành công!`);
      closeDeleteModal();
    }
  };

  // Định nghĩa các cột cho DataTable, bao gồm cột STT
  const columns = useMemo<ColumnDef<RequestCampaign>[]>(
    () => [
      {
        header: 'STT',
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'name',
        header: 'TÊN CHIẾN DỊCH'
      },
      {
        accessorKey: 'startDate',
        header: 'NGÀY TẠO'
      },
      {
        accessorKey: 'endDate',
        header: 'NGÀY KẾT THC'
      },
      {
        accessorKey: 'advertiserName',
        header: 'NHÀ QUẢNG CÁO'
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => (
          <span className="rounded bg-yellow px-2 py-1 text-white">
            {row.original.status === 'Pending'
              ? 'Chờ duyệt'
              : row.original.status}
          </span>
        )
      },
      {
        id: 'actions',
        header: 'HÀNH ĐỘNG',
        cell: ({ row }) => {
          const campaign = row.original;
          return (
            <div className="-ml-20 flex justify-center gap-3">
              {/* Nút chỉnh sửa */}
              <Pencil
                onClick={() => openEditModal(campaign)}
                className="hover:text-blue-700 cursor-pointer text-blue transition-colors"
                size={18}
              />
              {/* Nút xóa */}
              <Trash2
                onClick={() => openDeleteModal(campaign)}
                className="hover:text-red-700 cursor-pointer text-red transition-colors"
                size={18}
              />
            </div>
          );
        }
      }
    ],
    []
  );

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu!</div>;
  }

  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Yêu cầu chiến dịch</h2>

      <DataTable
        columns={columns}
        data={localCampaigns}
        pageCount={-1} // Sử dụng phân trang phía client nếu cần
        pageSizeOptions={[10, 20, 30, 40, 50]}
        showAdd={false}
      />

      {/* Modal chỉnh sửa chiến dịch */}
      <Modal
        title="Chỉnh sửa chiến dịch"
        open={isEditModalVisible}
        onOk={handleEditSave}
        onCancel={closeEditModal}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          className: 'bg-[#1570EF] text-white border-none'
        }}
        cancelButtonProps={{
          className: 'text-[#DC0E0E] border-[#DC0E0E] hover:text-white'
        }}
      >
        {editedCampaign && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium">
                Tên chiến dịch
              </label>
              <input
                type="text"
                name="name"
                value={editedCampaign.name}
                onChange={handleEditChange}
                className="w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ngày tạo</label>
              <input
                type="text"
                name="createdAt"
                value={editedCampaign.createdAt}
                onChange={handleEditChange}
                className="w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ngày kết thúc</label>
              <input
                type="text"
                name="endAt"
                value={editedCampaign.endAt}
                onChange={handleEditChange}
                className="w-full rounded border p-2"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Modal xác nhận xóa chiến dịch */}
      <Modal
        title="Xác nhận xóa chiến dịch"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={closeDeleteModal}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          className: 'bg-red-600 text-white border-none'
        }}
        cancelButtonProps={{
          className: 'text-gray-600 border-gray-600 hover:text-white'
        }}
      >
        {selectedCampaign && (
          <p>
            Bạn có chắc chắn muốn xóa chiến dịch <b>{selectedCampaign.name}</b>{' '}
            không?
          </p>
        )}
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
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
