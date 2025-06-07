import React, { useState, useMemo } from 'react';
import { Modal, notification } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
import { ColumnDef } from '@tanstack/react-table';
import {
  useGetCampaign,
  useUpdateCampaignStatus
} from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';
import BasePages from '@/components/shared/base-pages';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

interface RequestCampaign {
  id: number;
  name: string;
  createdAt: string;
  endAt: string;
  advertiser: string;
  status: string;
}

const CampaignRequest: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetCampaign('Pending', 1, 10);
  const rawCampaigns =
    (data as ApiResponse<PagingResponse<CampaignApiResponse>>)?.result?.datas ??
    [];
  const campaigns: RequestCampaign[] = rawCampaigns.map((item: any) => ({
    id: item.id,
    name: item.name,
    createdAt: formatDate(item.startDate),
    endAt: formatDate(item.endDate),
    advertiser: item.advertiser?.companyName ?? '',
    status: item.status
  }));
  const { mutate: updateCampaignStatus } = useUpdateCampaignStatus();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(
    null
  );
  const [selectedCampaign, setSelectedCampaign] =
    useState<RequestCampaign | null>(null);
  const handleOk = () => {
    if (selectedCampaign && modalAction) {
      const newStatus = modalAction === 'accept' ? 'Approved' : 'Canceled';
      updateCampaignStatus(
        { id: selectedCampaign.id, status: newStatus },
        {
          onSuccess: () => {
            notification.success({
              message: 'Cập nhật thành công',
              description: `Chiến dịch "${selectedCampaign.name}" đã được cập nhật thành "${newStatus}".`
            });
            refetch();
          },
          onError: (err: any) => {
            console.error(err);
            notification.error({
              message: 'Cập nhật thất bại',
              description: `Không thể cập nhật trạng thái của "${selectedCampaign.name}".`
            });
          }
        }
      );
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
          const record = row.original;
          return (
            <div className="flex gap-3">
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

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
        <div className="p-4">
          <Loading />
        </div>
      </BasePages>
    );
  }

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
        <div className="p-4">Đã có lỗi xảy ra khi tải dữ liệu!</div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Yêu cầu chiến dịch">
      <div className="mb-10 p-4">
        <h2 className="mb-4 text-xl font-semibold">Yêu cầu chiến dịch</h2>

        <DataTable
          columns={columns}
          data={campaigns}
          pageCount={-1}
          pageSizeOptions={[10, 20, 30, 40, 50]}
          showAdd={false}
        />

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
              Bạn có chắc muốn <b className="text-green-600">duyệt</b> chiến
              dịch "{selectedCampaign.name}" không?
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
    </BasePages>
  );
};

export default CampaignRequest;
