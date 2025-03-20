import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Modal } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';

// **Import hook** gọi API
import { useGetCampaignListExcpPending } from '@/queries/campaign.query';
// (tuỳ đường dẫn file bạn đặt)

interface Campaign {
  id: number;
  name: string;
  advertiserId: number;
  advertiserName: string;
  description: string;
  originUrl: string;
  budget: number;
  startDate: string;
  endDate: string;
  method: string;
  status: string;
  category: string;
  commissionType: string;
  commissionValue: number;
  imageUrl: string;
}

const CampaignList: React.FC = () => {
  // Quản lý tìm kiếm
  const [searchValue, setSearchValue] = useState('');
  // Mảng data hiển thị trên bảng (đã filter cục bộ)
  const [dataSource, setDataSource] = useState<Campaign[]>([]);

  // Modal xác nhận dừng chiến dịch
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  // Điều hướng router
  const navigate = useNavigate();

  // ---- (1) Gọi API ----
  // Giả sử ta muốn pageIndex=1, pageSize=10
  const { data, isLoading, error } = useGetCampaignListExcpPending(1, 10);

  /**
   * Khi data từ API trả về, ta lưu vào dataSource.
   * Giả sử backend trả về { result: [ {id, name, ...}, ... ] }
   * Tuỳ theo shape thật của response mà bạn chỉnh sửa.
   */
  useEffect(() => {
    if (data?.result.datas) {
      setDataSource(data?.result.datas);
    }
  }, [data]);

  /**
   * Filter cục bộ theo searchValue.
   * Nếu muốn filter server-side, bạn sẽ gọi API khác kèm query (tuỳ backend).
   */
  useEffect(() => {
    if (!data?.result.datas) return;
    const lower = searchValue.toLowerCase();
    const filtered = data.result.datas.filter(
      (item: Campaign) =>
        item.name.toLowerCase().includes(lower) ||
        item.advertiser.companyName.toLowerCase().includes(lower) // hoặc item.companyName nếu bạn đã map
    );
    setDataSource(filtered);
  }, [searchValue, data]);

  // Bấm "Xem" => điều hướng sang /admin/campaign-detail/:id
  const handleView = (record: Campaign) => {
    navigate(`/admin/campaign-detail/${record.id}`);
  };

  // Xác nhận "Dừng chiến dịch"
  const handleDelete = () => {
    if (selectedCampaign) {
      // Tạm thời xoá cục bộ. Nếu cần, bạn gọi API update status "Stopped"...
      setDataSource((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
    }
    setIsModalVisible(false);
    setSelectedCampaign(null);
  };

  // Định nghĩa cột
  const columns = useMemo<ColumnDef<Campaign>[]>(
    () => [
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
        header: 'NGÀY KẾT THÚC'
      },
      {
        accessorKey: 'advertiserName',
        header: 'NHÀ QUẢNG CÁO'
      },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) => (
          <span
            className={
              row.original.status === 'Hoạt động'
                ? 'font-semibold text-green-600'
                : 'text-red-600 font-semibold'
            }
          >
            {row.original.status}
          </span>
        )
      },
      {
        id: 'actions',
        header: 'HÀNH ĐỘNG',
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              {/* Xem */}
              <EyeOutlined
                className="cursor-pointer rounded-full p-1 text-xl text-[#1570EF] transition-colors hover:bg-[#1570EF] hover:text-white"
                onClick={() => handleView(record)}
              />
              {/* Sửa */}
              <EditOutlined
                className="cursor-pointer rounded-full p-1 text-xl text-[#FFBF00] transition-colors hover:bg-[#FFBF00] hover:text-white"
                onClick={() => alert(`Sửa: ${record.name}`)}
              />
              {/* Dừng chiến dịch */}
              <CloseCircleOutlined
                className="cursor-pointer rounded-full p-1 text-xl text-[#DC0E0E] transition-colors hover:bg-[#DC0E0E] hover:text-white"
                onClick={() => {
                  setSelectedCampaign(record);
                  setIsModalVisible(true);
                }}
              />
            </div>
          );
        }
      }
    ],
    []
  );

  // Xử lý trạng thái loading / error
  if (isLoading) {
    return <div>Đang tải danh sách chiến dịch...</div>;
  }
  if (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu!</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Danh sách chiến dịch</h2>

      <DataTable
        columns={columns}
        data={dataSource}
        // Nếu backend có totalPage, bạn có thể truyền vào pageCount
        pageCount={1}
        pageSizeOptions={[10, 20, 50, 100]}
        showAdd={false}
      />

      {/* Modal xác nhận dừng chiến dịch */}
      <Modal
        title="Dừng chiến dịch"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{
          className: 'bg-[#1570EF] text-white border-none'
        }}
        cancelButtonProps={{
          className: 'text-[#DC0E0E] border-[#DC0E0E] hover:text-white'
        }}
      >
        {selectedCampaign && (
          <p>
            Bạn có chắc muốn <b className="text-red-500">dừng</b> chiến dịch "
            {selectedCampaign.name}" không?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CampaignList;
