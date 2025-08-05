import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Badge } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
import { toast, ToastContainer } from 'react-toastify';
import BasePages from '@/components/shared/base-pages';
import DataTable from '@/components/shared/data-table';
import CreatePlanModal from './CreatePlan';
import EditPlanModal from './UpdatePlanModal';
import { useGetPlan, useDeletePlan } from '@/queries/plan.query';
import { Plans } from '@/types';
import __helpers from '@/helpers';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

const ManagePlansPage: React.FC = () => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plans | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const { pageIndex, pageSize } = __helpers.usePaginationParams();

  const {
    data: plans,
    isLoading,
    error,
    refetch
  } = useGetPlan(true, pageIndex, pageSize);

  const deletePlanMutation = useDeletePlan();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Listen for create plan trigger from dashboard
  useEffect(() => {
    const createPlanTrigger = localStorage.getItem('admin-trigger-create-plan');
    if (createPlanTrigger === 'true') {
      setIsCreateModalVisible(true);
      localStorage.removeItem('admin-trigger-create-plan');
    }
  }, []);

  const handleView = (record: Plans) => {
    setSelectedPlan(record);
    setIsViewModalVisible(true);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedPlan(null);
  };

  const handleEdit = (record: Plans) => {
    setSelectedPlan(record);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedPlan(null);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleDelete = (record: Plans) => {
    setSelectedPlan(record);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;

    try {
      await deletePlanMutation.mutateAsync(selectedPlan.id);

      // Show success toast
      toast.success('Xóa gói dịch vụ thành công!');

      // Close modal and reset state
      setIsDeleteModalVisible(false);
      setSelectedPlan(null);

      // Refresh data
      refetch();
    } catch (error) {
      // Show error toast
      toast.error('Có lỗi xảy ra khi xóa gói dịch vụ. Vui lòng thử lại!');
      console.error('Delete plan error:', error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedPlan(null);
  };

  // Create Plan Modal handlers
  const handleCreatePlan = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreatePlanSuccess = () => {
    refetch();
  };

  const columns = useMemo<ColumnDef<Plans>[]>(
    () => [
      {
        id: 'stt',
        header: () => (
          <div className="text-center font-semibold text-gray-700">STT</div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={row.index + 1}
              style={{
                backgroundColor: '#f0f9ff',
                color: '#0284c7',
                border: '1px solid #e0f2fe'
              }}
            />
          </div>
        ),
        size: 60
      },
      {
        accessorKey: 'name',
        header: () => <div className="font-semibold text-gray-700">TÊN</div>,
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p
              className="truncate font-medium text-gray-900"
              title={row.original.name}
            >
              {row.original.name}
            </p>
          </div>
        )
      },
      {
        accessorKey: 'maxCampaigns',
        header: () => (
          <div className="text-center text-xs font-semibold text-gray-700">
            CHIẾN DỊCH TỐI ĐA
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={formatNumber(row.original.maxCampaigns)}
              style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                border: '1px solid #d1fae5'
              }}
            />
          </div>
        ),
        size: 120
      },
      {
        accessorKey: 'maxClicksPerMonth',
        header: () => (
          <div className="text-center text-xs font-semibold text-gray-700">
            CLICK TỐI ĐA
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={formatNumber(row.original.maxClicksPerMonth)}
              overflowCount={Number.MAX_SAFE_INTEGER}
              style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a'
              }}
            />
          </div>
        ),
        size: 120
      },
      {
        accessorKey: 'maxConversionsPerMonth',
        header: () => (
          <div className="text-center text-xs font-semibold text-gray-700">
            CHUYỂN ĐỔI TỐI ĐA
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={formatNumber(row.original.maxConversionsPerMonth)}
              style={{
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                border: '1px solid #e9d5ff'
              }}
            />
          </div>
        ),
        size: 140
      },
      {
        accessorKey: 'price',
        header: () => (
          <div className="text-center font-semibold text-gray-700">
            GIÁ GÓI DỊCH VỤ
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span className="font-semibold text-green-600">
              {formatPrice(row.original.price)}
            </span>
          </div>
        ),
        size: 140
      },
      {
        accessorKey: 'isActive',
        header: () => (
          <div className="text-center font-semibold text-gray-700">
            TRẠNG THÁI
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={row.original.isActive ? 'Hoạt động' : 'Không hoạt động'}
              style={{
                backgroundColor: row.original.isActive ? '#ecfdf5' : '#fef2f2',
                color: row.original.isActive ? '#059669' : '#dc2626',
                border: row.original.isActive
                  ? '1px solid #d1fae5'
                  : '1px solid #fecaca'
              }}
            />
          </div>
        ),
        size: 120
      },
      {
        id: 'action',
        header: () => (
          <div className="text-center font-semibold text-gray-700">
            THAO TÁC
          </div>
        ),
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleView(record)}
                className="rounded-full bg-blue-50 p-2 text-blue-600 transition-colors duration-200 hover:bg-blue-100"
                title="Xem chi tiết"
              >
                <EyeOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleEdit(record)}
                className="rounded-full bg-amber-50 p-2 text-amber-600 transition-colors duration-200 hover:bg-amber-100"
                title="Chỉnh sửa"
              >
                <EditOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleDelete(record)}
                className="rounded-full bg-red-50 p-2 text-red-600 transition-colors duration-200 hover:bg-red-100"
                title="Xóa gói dịch vụ"
                disabled={deletePlanMutation.isPending}
              >
                <DeleteOutlined className="text-sm" />
              </button>
            </div>
          );
        },
        size: 140
      }
    ],
    [deletePlanMutation.isPending]
  );

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Quản lý gói dịch vụ">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Oops! Có lỗi xảy ra
            </h3>
            <p className="text-gray-600">
              Không thể tải dữ liệu gói dịch vụ. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <>
      <BasePages pageHead="ClickFlow - Quản lý gói dịch vụ">
        <div className="min-h-screen bg-gray-50">
          <div className="w-full px-6 py-8">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách gói dịch vụ
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({plans?.result?.totalItems} gói dịch vụ)
                    </span>
                  </h2>
                  <button
                    onClick={handleCreatePlan}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <PlusOutlined className="mr-2" />
                    Thêm gói dịch vụ mới
                  </button>
                </div>
              </div>

              <div className="p-6">
                <DataTable
                  columns={columns}
                  data={plans?.result?.datas ?? []}
                  pageCount={plans?.result?.totalPages ?? 0}
                  isLoading={isLoading}
                  onRefresh={refetch}
                />
              </div>
            </div>
          </div>

          {/* Create Plan Modal */}
          <CreatePlanModal
            isVisible={isCreateModalVisible}
            onClose={handleCreateModalClose}
            onSuccess={handleCreatePlanSuccess}
          />

          {/* Edit Plan Modal */}
          <EditPlanModal
            isVisible={isEditModalVisible}
            plan={selectedPlan}
            onClose={closeEditModal}
            onSuccess={handleEditSuccess}
          />

          {/* View Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <EyeOutlined className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chi tiết gói dịch vụ
                  </h3>
                  <p className="text-sm text-gray-500">
                    Thông tin chi tiết về gói dịch vụ
                  </p>
                </div>
              </div>
            }
            open={isViewModalVisible}
            onCancel={closeViewModal}
            footer={null}
            width={800}
            height="100vh"
            className="plan-detail-modal"
            bodyStyle={{
              height: 'calc(100vh - 140px)',
              padding: 0,
              overflow: 'hidden'
            }}
            style={{
              top: 0,
              height: '100vh',
              maxWidth: '100vw',
              margin: 0,
              marginLeft: 380,
              paddingBottom: 10,
              paddingTop: 10
            }}
            getContainer={false}
          >
            {selectedPlan && (
              <div className="h-full overflow-hidden p-6">
                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Mã gói dịch vụ
                          </label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            #{selectedPlan.id}
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Tên gói dịch vụ
                          </label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {selectedPlan.name}
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Số chiến dịch tối đa
                          </label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {formatNumber(selectedPlan.maxCampaigns)} chiến dịch
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Click/tháng tối đa
                          </label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {formatNumber(selectedPlan.maxClicksPerMonth)} click
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Chuyển đổi/tháng tối đa
                          </label>
                          <p className="mt-1 text-lg font-semibold text-gray-900">
                            {formatNumber(selectedPlan.maxConversionsPerMonth)}{' '}
                            chuyển đổi
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Trạng thái
                          </label>
                          <div className="mt-2">
                            <Badge
                              count={
                                selectedPlan.isActive
                                  ? 'Hoạt động'
                                  : 'Không hoạt động'
                              }
                              style={{
                                backgroundColor: selectedPlan.isActive
                                  ? '#ecfdf5'
                                  : '#fef2f2',
                                color: selectedPlan.isActive
                                  ? '#059669'
                                  : '#dc2626',
                                border: selectedPlan.isActive
                                  ? '1px solid #d1fae5'
                                  : '1px solid #fecaca'
                              }}
                            />
                          </div>
                        </div>

                        <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                          <label className="text-sm font-medium uppercase tracking-wide text-green-700">
                            Giá gói dịch vụ
                          </label>
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrice(selectedPlan.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Mô tả gói dịch vụ
                      </label>
                      <p className="mt-2 leading-relaxed text-gray-900">
                        {selectedPlan.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <DeleteOutlined className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận xóa gói dịch vụ
                  </h3>
                  <p className="text-sm text-gray-500">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>
            }
            open={isDeleteModalVisible}
            onOk={confirmDelete}
            onCancel={cancelDelete}
            okText={
              deletePlanMutation.isPending ? 'Đang xóa...' : 'Xóa gói dịch vụ'
            }
            cancelText="Hủy bỏ"
            confirmLoading={deletePlanMutation.isPending}
            okButtonProps={{
              className:
                'bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700',
              size: 'large',
              danger: true
            }}
            cancelButtonProps={{
              size: 'large',
              disabled: deletePlanMutation.isPending
            }}
            width={500}
            closable={!deletePlanMutation.isPending}
            maskClosable={!deletePlanMutation.isPending}
          >
            <div className="py-4">
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Cảnh báo
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Việc xóa gói dịch vụ sẽ không thể hoàn tác và có thể ảnh
                        hưởng đến người dùng đã đăng ký.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa gói dịch vụ{' '}
                <span className="font-semibold text-gray-900">
                  "{selectedPlan?.name}" (#{selectedPlan?.id})
                </span>{' '}
                không?
              </p>
            </div>
          </Modal>
        </div>
      </BasePages>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default ManagePlansPage;
