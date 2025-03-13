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

interface RequestCampaign {
  id: number;
  name: string;
  createdAt: string;
  endAt: string;
  advertiser: string;
  status: string;
}

// Dữ liệu mẫu
const initialRequests: RequestCampaign[] = [
  {
    id: 1,
    name: 'Mùa Hè Xanh',
    createdAt: '10/10/2024',
    endAt: '10/12/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  },
  {
    id: 2,
    name: 'Xuân Hy Vọng',
    createdAt: '01/01/2024',
    endAt: '30/03/2024',
    advertiser: 'Viettel',
    status: 'Chờ duyệt'
  },
  {
    id: 3,
    name: 'Thu Vàng',
    createdAt: '15/08/2024',
    endAt: '15/10/2024',
    advertiser: 'VNPT',
    status: 'Chờ duyệt'
  },
  {
    id: 4,
    name: 'Tết 2024',
    createdAt: '25/12/2023',
    endAt: '10/02/2024',
    advertiser: 'Shopee',
    status: 'Chờ duyệt'
  },
  {
    id: 5,
    name: 'Ngày Hội Mua Sắm',
    createdAt: '05/05/2024',
    endAt: '15/05/2024',
    advertiser: 'Lazada',
    status: 'Chờ duyệt'
  },
  {
    id: 6,
    name: 'Black Friday',
    createdAt: '20/11/2024',
    endAt: '01/12/2024',
    advertiser: 'Tiki',
    status: 'Chờ duyệt'
  },
  {
    id: 7,
    name: 'Siêu Sale 11/11',
    createdAt: '01/11/2024',
    endAt: '12/11/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  },
  {
    id: 8,
    name: 'Noel 2024',
    createdAt: '01/12/2024',
    endAt: '31/12/2024',
    advertiser: 'VinID',
    status: 'Chờ duyệt'
  },
  {
    id: 9,
    name: 'Hè Rực Rỡ',
    createdAt: '01/06/2024',
    endAt: '31/07/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  },
  {
    id: 10,
    name: 'Du Lịch Biển',
    createdAt: '10/06/2024',
    endAt: '31/08/2024',
    advertiser: 'VN Airlines',
    status: 'Chờ duyệt'
  },
  {
    id: 11,
    name: 'Tri Ân Khách Hàng',
    createdAt: '05/09/2024',
    endAt: '15/09/2024',
    advertiser: 'FPT',
    status: 'Chờ duyệt'
  }
];

const CampaignRequest: React.FC = () => {
  const [dataSource, setDataSource] =
    useState<RequestCampaign[]>(initialRequests);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(
    null
  );
  const [selectedCampaign, setSelectedCampaign] =
    useState<RequestCampaign | null>(null);

  const navigate = useNavigate();

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
        cell: ({ row }) => (
          <span className="text-orange-600 font-semibold">
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
              <CheckCircleOutlined
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('accept');
                  setIsModalVisible(true);
                }}
                className="cursor-pointer rounded-full p-1 text-xl text-green-500 transition-colors hover:bg-green-500 hover:text-white"
              />
              <CloseCircleOutlined
                onClick={() => {
                  setSelectedCampaign(record);
                  setModalAction('reject');
                  setIsModalVisible(true);
                }}
                className="cursor-pointer rounded-full p-1 text-xl text-[#DC0E0E] transition-colors hover:bg-[#DC0E0E] hover:text-white"
              />
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

  return (
    <div className="mb-10 p-4">
      <h2 className="mb-4 text-xl font-semibold">Yêu cầu chiến dịch</h2>

      {/* DataTable có sẵn chức năng search và phân trang */}
      <DataTable
        columns={columns}
        data={dataSource}
        pageCount={1}
        pageSizeOptions={[10, 20, 50, 100]}
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
