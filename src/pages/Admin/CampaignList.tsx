import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Dùng Input & Modal của antd cho search + modal confirm
import { Input, Modal } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

// Dùng DataTable của bạn (đã gửi ở trên)
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';

// ------------------ Kiểu dữ liệu ------------------
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

// ------------------ Data fake ban đầu ------------------
const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Mùa Hè Xanh',
    advertiserId: 101,
    advertiserName: 'FPT',
    description: 'Chiến dịch quảng bá sản phẩm mùa hè xanh tươi mát',
    originUrl: 'https://example.com/mua-he-xanh',
    budget: 50000000,
    startDate: '10/10/2024',
    endDate: '10/12/2024',
    method: 'CPC',
    status: 'Hoạt động',
    category: 'Thực phẩm & Đồ uống',
    commissionType: 'VND',
    commissionValue: 30000,
    imageUrl: 'https://via.placeholder.com/300x200/cccccc?text=Mùa+Hè+Xanh'
  },
  {
    id: 2,
    name: 'Xuân Hy Vọng',
    advertiserId: 102,
    advertiserName: 'Viettel',
    description: 'Khuyến mãi mùa xuân với nhiều ưu đãi hấp dẫn',
    originUrl: 'https://example.com/xuan-hy-vong',
    budget: 100000000,
    startDate: '01/01/2024',
    endDate: '30/03/2024',
    method: 'CPA',
    status: 'Hoạt động',
    category: 'Du lịch & Nghỉ dưỡng',
    commissionType: '%',
    commissionValue: 10,
    imageUrl: 'https://via.placeholder.com/300x200/aaaaaa?text=Xuân+Hy+Vọng'
  },
  {
    id: 3,
    name: 'Thu Vàng',
    advertiserId: 103,
    advertiserName: 'VNPT',
    description: 'Chiến dịch giảm giá các sản phẩm mùa thu',
    originUrl: 'https://example.com/thu-vang',
    budget: 20000000,
    startDate: '15/08/2024',
    endDate: '15/10/2024',
    method: 'CPS',
    status: 'Bị từ chối',
    category: 'khác',
    commissionType: 'VND',
    commissionValue: 50000,
    imageUrl: 'https://via.placeholder.com/300x200/888888?text=Thu+Vàng'
  }
];

// ------------------ Component chính ------------------
const CampaignList: React.FC = () => {
  // State để quản lý dữ liệu và giá trị tìm kiếm
  const [searchValue, setSearchValue] = useState('');
  const [dataSource, setDataSource] = useState<Campaign[]>(initialCampaigns);

  // State cho Modal xác nhận dừng chiến dịch
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  // Điều hướng router
  const navigate = useNavigate();

  // Xử lý bấm "Xem"
  const handleView = (record: Campaign) => {
    // Chuyển sang đường dẫn /admin/campaign-detail/:id
    navigate(`/admin/campaign-detail/${record.id}`);
  };

  // Xử lý xoá (dừng chiến dịch)
  const handleDelete = () => {
    if (selectedCampaign) {
      setDataSource((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
    }
    setIsModalVisible(false);
    setSelectedCampaign(null);
  };

  // Lọc dữ liệu mỗi khi searchValue thay đổi
  useEffect(() => {
    const filtered = initialCampaigns.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setDataSource(filtered);
  }, [searchValue]);

  // ------------------ Định nghĩa cột cho DataTable ------------------
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
        // Tuỳ biến cell hiển thị status
        cell: ({ row }) => (
          <span className="font-semibold text-green-600">
            {row.original.status}
          </span>
        )
      },
      {
        // Cột hành động
        id: 'actions', // không có accessorKey vì đây là cột custom
        header: 'HÀNH ĐỘNG',
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              {/* Xem */}
              <EyeOutlined
                className="
                  cursor-pointer rounded-full p-1
                  text-xl text-[#1570EF]
                  transition-colors hover:bg-[#1570EF] hover:text-white
                "
                onClick={() => handleView(record)}
              />
              {/* Sửa */}
              <EditOutlined
                className="
                  cursor-pointer rounded-full p-1
                  text-xl text-[#FFBF00]
                  transition-colors hover:bg-[#FFBF00] hover:text-white
                "
                onClick={() => alert(`Sửa: ${record.name}`)}
              />
              {/* Xoá (dừng chiến dịch) */}
              <CloseCircleOutlined
                className="
                  cursor-pointer rounded-full p-1
                  text-xl text-[#DC0E0E]
                  transition-colors hover:bg-[#DC0E0E] hover:text-white
                "
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

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Danh sách chiến dịch</h2>

      {/* Bảng hiển thị bằng DataTable */}
      <DataTable
        columns={columns}
        data={dataSource}
        // Vì đang demo local data nên ta set pageCount=1
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
