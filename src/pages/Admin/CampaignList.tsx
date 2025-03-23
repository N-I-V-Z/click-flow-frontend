import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';

// **Import hook** gọi API
import { useGetCampaignListExcpPending } from '@/queries/campaign.query';
import { ApiResponse, CampaignApiResponse, PagingResponse } from '@/types';
import __helpers from '@/helpers';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
// (tuỳ đường dẫn file bạn đặt)

const CampaignList: React.FC = () => {
  // Mảng data hiển thị trên bảng (đã filter cục bộ)
  const [dataSource, setDataSource] = useState<CampaignApiResponse[]>([]);

  // Modal xác nhận dừng chiến dịch
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignApiResponse | null>(null);

  // Điều hướng router
  const navigate = useNavigate();

  // ---- (1) Gọi API ----
  const { pageIndex, pageSize } = __helpers.usePaginationParams();

  // Giả sử ta muốn pageIndex=1, pageSize=10
  const { data, isLoading, error, isSuccess } = useGetCampaignListExcpPending(
    pageIndex,
    pageSize
  );

  /**
   * Khi data từ API trả về, ta lưu vào dataSource.
   * Giả sử backend trả về { result: [ {id, name, ...}, ... ] }
   * Tuỳ theo shape thật của response mà bạn chỉnh sửa.
   */
  useEffect(() => {
    if (isSuccess) {
      setDataSource(
        (data as ApiResponse<PagingResponse<CampaignApiResponse>>).result
          ?.datas ?? []
      );
    }
  }, [data, isSuccess]);

  // Bấm "Xem" => điều hướng sang /admin/campaign-detail/:id
  const handleView = useCallback(
    (record: CampaignApiResponse) => {
      navigate(`/admin/campaign-detail/${record.id}`);
    },
    [navigate]
  );

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
        accessorKey: 'advertiser.companyName', // Sử dụng companyName thay cho advertiserName
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
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Danh sách chiến dịch</h2>

      {isLoading ? (
        <DataTableSkeleton columnCount={6} rowCount={pageSize} />
      ) : (
        <DataTable
          columns={columns}
          data={dataSource}
          // Nếu backend có totalPage, bạn có thể truyền vào pageCount
          pageCount={1}
          showAdd={false}
        />
      )}

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
