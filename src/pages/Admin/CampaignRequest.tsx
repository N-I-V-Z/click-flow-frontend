import React, { useState, useMemo } from 'react';
import { Modal } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useGetCampaign } from '@/queries/campaign.query';

// Khai báo interface cho 1 campaign (tuỳ vào structure API trả về)
interface RequestCampaign {
  id: number;
  name: string;
  createdAt: string; // hoặc Date
  endAt: string; // hoặc Date
  advertiser: string;
  status: string; // Pending, Approved, ...
}

const CampaignRequest: React.FC = () => {
  const navigate = useNavigate();

  // Gọi API lấy danh sách campaigns có status = "Pending"
  const {
    data, // tuỳ cấu trúc, có thể là { data: { ... } } hoặc { ... }
    isLoading,
    error
  } = useGetCampaign('Pending', 1, 10);

  // Giả sử backend trả về { result: [ {id, name, ...} ] } hoặc chỉ trả về mảng
  // Tuỳ theo API, bạn map đúng trường. Ví dụ:
  const campaigns: RequestCampaign[] = data?.result ?? [];
  // Nếu backend trả về { data: [ ... ] } thì bạn dùng data?.data ?? []

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(
    null
  );
  const [selectedCampaign, setSelectedCampaign] =
    useState<RequestCampaign | null>(null);

  // Xử lý xác nhận Modal
  const handleOk = () => {
    if (selectedCampaign && modalAction) {
      if (modalAction === 'accept') {
        alert(`Đã duyệt chiến dịch: ${selectedCampaign.name}`);
      } else {
        alert(`Đã từ chối chiến dịch: ${selectedCampaign.name}`);
      }
    }
    setIsModalVisible(false);
    setModalAction(null);
    setSelectedCampaign(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
    setSelectedCampaign(null);
  };

  // Định nghĩa cột theo chuẩn ColumnDef của tanstack/react-table
  const columns = useMemo<ColumnDef<RequestCampaign>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'TÊN CHIẾN DỊCH'
      },
      {
        accessorKey: 'createdAt',
        header: 'NGÀY TẠO'
      },
      {
        accessorKey: 'endAt',
        header: 'NGÀY KẾT THÚC'
      },
      {
        accessorKey: 'advertiser',
        header: 'NHÀ QUẢNG CÁO'
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => {
          // Nếu muốn hiển thị "Chờ duyệt" thay vì "Pending"
          return (
            <span className="text-orange-600 font-semibold">
              {row.original.status === 'Pending'
                ? 'Chờ duyệt'
                : row.original.status}
            </span>
          );
        }
      },
      {
        id: 'actions',
        header: 'HÀNH ĐỘNG',
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              {/* Duyệt */}
              <CheckCircleOutlined
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('accept');
                  setIsModalVisible(true);
                }}
                className="cursor-pointer rounded-full p-1 text-xl text-green-500 transition-colors hover:bg-green-500 hover:text-white"
              />
              {/* Từ chối */}
              <CloseCircleOutlined
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('reject');
                  setIsModalVisible(true);
                }}
                className="cursor-pointer rounded-full p-1 text-xl text-[#DC0E0E] transition-colors hover:bg-[#DC0E0E] hover:text-white"
              />
              {/* Chi tiết */}
              <EllipsisOutlined
                onClick={() =>
                  navigate(`/admin/campaign-request-detail/${record.id}`)
                }
                className="cursor-pointer rounded-full p-1 text-xl text-[#FFBF00] transition-colors hover:bg-[#FFBF00] hover:text-white"
              />
            </div>
          );
        }
      }
    ],
    [navigate]
  );

  // Trạng thái loading
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Nếu có lỗi
  if (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu!</div>;
  }

  // Hiển thị bảng
  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Yêu cầu chiến dịch</h2>

      <DataTable
        columns={columns}
        data={campaigns}
        pageCount={-1} // Để DataTable tự chia trang (client-side) nếu muốn
        pageSizeOptions={[10, 20, 30, 40, 50]}
        showAdd={false}
      />

      {/* Modal xác nhận Duyệt / Từ chối */}
      <Modal
        title={
          modalAction === 'accept'
            ? 'Duyệt chiến dịch'
            : modalAction === 'reject'
              ? 'Từ chối chiến dịch'
              : ''
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{
          className: 'bg-[#1570EF] text-white border-none'
        }}
        cancelButtonProps={{
          className: 'text-[#DC0E0E] border-[#DC0E0E] hover:text-white'
        }}
      >
        {modalAction === 'accept' && selectedCampaign && (
          <p>
            Bạn có chắc muốn <b className="text-green-600">duyệt</b> chiến dịch
            "{selectedCampaign.name}" không?
          </p>
        )}
        {modalAction === 'reject' && selectedCampaign && (
          <p>
            Bạn có chắc muốn <b className="text-[#DC0E0E]">từ chối</b> chiến
            dịch "{selectedCampaign.name}" không?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CampaignRequest;
