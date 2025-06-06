import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
import { ColumnDef } from '@tanstack/react-table';
import { useGetCampaignListExcpPending } from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';
import __helpers from '@/helpers';
import BasePages from '@/components/shared/base-pages';

const CampaignList: React.FC = () => {
  const [dataSource, setDataSource] = useState<CampaignApiResponse[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignApiResponse | null>(null);
  const navigate = useNavigate();
  const { pageIndex, pageSize } = __helpers.usePaginationParams();
  const { data, isLoading, error, isSuccess } = useGetCampaignListExcpPending(
    pageIndex,
    pageSize
  );

  useEffect(() => {
    if (isSuccess) {
      setDataSource(
        (data as ApiResponse<PagingResponse<CampaignApiResponse>>).result
          ?.datas ?? []
      );
    }
  }, [data, isSuccess]);

  const handleView = useCallback(
    (record: CampaignApiResponse) => {
      navigate(`/admin/campaign-detail/${record.id}`);
    },
    [navigate]
  );

  const handleDelete = () => {
    if (selectedCampaign) {
      setDataSource((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
    }
    setIsModalVisible(false);
    setSelectedCampaign(null);
  };

  const columns = useMemo<ColumnDef<CampaignApiResponse>[]>(
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
        accessorKey: 'advertiser.companyName',
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
        header: () => <div className="w-full text-center">HÀNH ĐỘNG</div>,
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              <EyeOutlined
                className="cursor-pointer rounded-full p-1 text-xl text-[#1570EF] transition-colors hover:bg-[#1570EF] hover:text-white"
                onClick={() => handleView(record)}
              />
              <EditOutlined
                className="cursor-pointer rounded-full p-1 text-xl text-[#FFBF00] transition-colors hover:bg-[#FFBF00] hover:text-white"
                onClick={() => alert(`Sửa: ${record.name}`)}
              />
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
    [handleView]
  );

  if (error) {
    return <div>Đã có lỗi xảy ra khi tải dữ liệu!</div>;
  }

  return (
    <BasePages pageHead="ClickFlow - Danh sách chiến dịch ">
      <div className="p-4">
        <h2 className="mb-4 text-xl font-semibold">Danh sách chiến dịch</h2>

        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={dataSource}
            pageCount={1}
            showAdd={false}
          />
        )}

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
    </BasePages>
  );
};

export default CampaignList;
