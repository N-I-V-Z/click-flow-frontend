import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input } from 'antd';
import {
  EyeOutlined,
  CloseCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import Loading from '@/components/ui/loading';
import { ColumnDef } from '@tanstack/react-table';
import BasePages from '@/components/shared/base-pages';
import { useGetUsersByRole } from '@/queries/user.query';
import {
  ApiResponse,
  ApplicationUserApiResponse,
  PagingResponse
} from '@/types';

interface Publisher {
  id: number;
  code: string;
  name: string;
  phone: string;
  userName: string;
  email: string;
  status: string;
}

function mapApiUserToPublisher(apiUser: ApplicationUserApiResponse): Publisher {
  return {
    id: apiUser.id,
    code: `PL${apiUser.id}`,
    name: apiUser.fullName ?? 'No name',
    phone: apiUser.phoneNumber ?? '',
    userName: apiUser.userName ?? '',
    email: apiUser.email ?? '',
    status: apiUser.isDeleted ? 'Bị khóa' : 'Hoạt động'
  };
}

const PublisherList: React.FC = () => {
  const [dataSource, setDataSource] = useState<Publisher[]>([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const { data, isLoading, error } = useGetUsersByRole('Publisher', 1, 10);

  useEffect(() => {
    if (data?.result) {
      const mapped = (
        data as ApiResponse<PagingResponse<ApplicationUserApiResponse>>
      ).result?.datas.map((user: ApplicationUserApiResponse) =>
        mapApiUserToPublisher(user)
      );
      setDataSource(mapped ?? []);
    }
  }, [data]);

  const handleView = (record: Publisher) => {
    setSelectedPublisher(record);
    setIsViewModalVisible(true);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedPublisher(null);
  };

  const handleLockUnlock = (record: Publisher) => {
    setSelectedPublisher(record);
    setIsLockModalVisible(true);
  };

  const confirmLockUnlock = () => {
    if (selectedPublisher) {
      setDataSource((prev) =>
        prev.map((item) =>
          item.id === selectedPublisher.id
            ? {
                ...item,
                status: item.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động'
              }
            : item
        )
      );
    }
    setIsLockModalVisible(false);
    setSelectedPublisher(null);
  };

  const cancelLockUnlock = () => {
    setIsLockModalVisible(false);
    setSelectedPublisher(null);
  };

  const columns = useMemo<ColumnDef<Publisher>[]>(
    () => [
      {
        id: 'stt',
        header: () => <div className="w-full text-center">STT</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>
      },
      { accessorKey: 'name', header: 'TÊN NHÀ TIẾP THỊ' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'status',
        header: 'TRẠNG THÁI',
        cell: ({ row }) =>
          row.original.status === 'Hoạt động' ? (
            <span className="font-semibold text-green-600">
              {row.original.status}
            </span>
          ) : (
            <span className="font-semibold text-[#DC0E0E]">
              {row.original.status}
            </span>
          )
      },
      {
        id: 'action',
        header: () => <div className="w-full text-center">HÀNH ĐỘNG</div>,
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-3">
              <EyeOutlined
                onClick={() => handleView(record)}
                className="cursor-pointer rounded-full p-1 text-xl text-[#1570EF] transition-colors hover:bg-[#1570EF] hover:text-white"
              />
              <CloseCircleOutlined
                onClick={() => handleLockUnlock(record)}
                className="cursor-pointer rounded-full p-1 text-xl text-[#DC0E0E] transition-colors hover:bg-[#DC0E0E] hover:text-white"
              />
            </div>
          );
        }
      }
    ],
    []
  );

  if (isLoading) {
    return (
      <BasePages pageHead="ClickFlow - Nhà tiếp thị ">
        <div className="p-4">
          <Loading />
        </div>
      </BasePages>
    );
  }
  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Nhà tiếp thị ">
        <div className="p-4">Đã có lỗi xảy ra khi tải dữ liệu!</div>
      </BasePages>
    );
  }

  return (
    <BasePages pageHead="ClickFlow - Nhà tiếp thị ">
      <div className="mb-10 p-4">
        <h2 className="mb-4 text-xl font-semibold">Nhà tiếp thị</h2>
        <DataTable
          columns={columns}
          data={dataSource}
          pageCount={-1} //
          pageSizeOptions={[10, 20, 30, 40, 50]}
        />

        <Modal
          open={isViewModalVisible}
          onCancel={closeViewModal}
          footer={<Button onClick={closeViewModal}>Đóng</Button>}
          title={null}
        >
          {selectedPublisher && (
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-2xl text-gray-600">
                  <UserOutlined />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedPublisher.name}
                  </h3>
                  <p className="text-sm text-gray-500">Nhà tiếp thị</p>
                </div>
              </div>
              <hr className="my-4 border-gray-300" />
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-gray-600">
                    Số điện thoại
                  </label>
                  <Input readOnly value={selectedPublisher.phone} />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600">
                    Tên người dùng
                  </label>
                  <Input readOnly value={selectedPublisher.userName} />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600">
                    Email
                  </label>
                  <Input readOnly value={selectedPublisher.email} />
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title={
            selectedPublisher?.status === 'Hoạt động'
              ? 'Xác nhận khóa'
              : 'Xác nhận mở khóa'
          }
          open={isLockModalVisible}
          onOk={confirmLockUnlock}
          onCancel={cancelLockUnlock}
          okText="Xác nhận"
          cancelText="Hủy"
          okButtonProps={{
            className: 'bg-[#1570EF] text-white border-none'
          }}
          cancelButtonProps={{
            className: 'text-[#DC0E0E] border-[#DC0E0E] hover:text-white'
          }}
        >
          <p>
            Bạn có chắc chắn muốn{' '}
            {selectedPublisher?.status === 'Hoạt động' ? 'khóa' : 'mở khóa'} nhà
            tiếp thị <strong>{selectedPublisher?.name}</strong> không?
          </p>
        </Modal>
      </div>
    </BasePages>
  );
};

export default PublisherList;
