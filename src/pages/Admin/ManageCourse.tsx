import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Badge, Rate, Form, Input, InputNumber, message } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
import BasePages from '@/components/shared/base-pages';
import DataTable from '@/components/shared/data-table';
import { useGetCourseAdmin, useCreateCourse } from '@/queries/course.query';
import { CourseResponse } from '@/types';
import __helpers from '@/helpers';
import ToastNotification from '@/components/shared/toast-notification';
import { toast } from 'react-toastify';

const { TextArea } = Input;

export interface CreateCourseFormData {
  title: string;
  price: number;
  lessonLearned: string;
  description: string;
  content: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const ManageCourse: React.FC = () => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [keyWord, setKeyWord] = useState<string>('');
  const { pageIndex, pageSize } = __helpers.usePaginationParams();

  const {
    data: courses,
    isLoading,
    error,
    refetch
  } = useGetCourseAdmin(pageIndex, pageSize, keyWord);

  useEffect(() => {
    refetch();
  }, [keyWord, refetch]);

  const createCourseMutation = useCreateCourse();

  const handleView = (record: CourseResponse) => {
    setSelectedCourse(record);
    setIsViewModalVisible(true);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedCourse(null);
  };

  const handleDelete = (record: CourseResponse) => {
    setSelectedCourse(record);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    // if (selectedCourse) {
    //   // TODO: call delete API, then refetch or remove from dataSource
    //   setDataSource((prev) =>
    //     prev.filter((item) => item.id !== selectedCourse.id)
    //   );
    // }
    // setIsDeleteModalVisible(false);
    // setSelectedCourse(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedCourse(null);
  };

  // Create Course Modal handlers
  const handleCreateCourse = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  const handleCreateCourseSubmit = async (values: CreateCourseFormData) => {
    try {
      await createCourseMutation.mutateAsync(values);
      message.success('Tạo khóa học thành công!');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      // Refetch data to update the list
      refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại!');
      console.error('Create course error:', error);
    }
  };

  const columns = useMemo<ColumnDef<CourseResponse>[]>(
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
        accessorKey: 'title',
        header: () => (
          <div className="font-semibold text-gray-700">TIÊU ĐỀ KHÓA HỌC</div>
        ),
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p
              className="truncate font-medium text-gray-900"
              title={row.original.title}
            >
              {row.original.title}
            </p>
          </div>
        )
      },
      {
        accessorKey: 'createAt',
        header: () => (
          <div className="font-semibold text-gray-700">NGÀY TẠO</div>
        ),
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="text-gray-900">
              {formatDate(row.original.createAt)}
            </div>
          </div>
        )
      },
      {
        accessorKey: 'createById',
        header: () => (
          <div className="text-center font-semibold text-gray-700">
            NGƯỜI TẠO
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              count={`#${row.original.createById}`}
              style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a'
              }}
            />
          </div>
        ),
        size: 100
      },
      {
        accessorKey: 'avgRate',
        header: () => (
          <div className="text-center font-semibold text-gray-700">
            ĐÁNH GIÁ
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <div className="flex flex-col items-center gap-1">
              <Rate
                disabled
                defaultValue={row.original.avgRate}
                allowHalf
                className="text-xs"
              />
              <span className="text-xs text-gray-600">
                {row.original.avgRate?.toFixed(1)}/5
              </span>
            </div>
          </div>
        ),
        size: 120
      },
      {
        accessorKey: 'price',
        header: () => (
          <div className="text-right font-semibold text-gray-700">
            GIÁ KHÓA HỌC
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-semibold text-green-600">
              {formatPrice(row.original.price)}
            </span>
          </div>
        ),
        size: 140
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
                className="bg-blue-50 hover:bg-blue-100 rounded-full p-2 text-blue transition-colors duration-200"
                title="Xem chi tiết"
              >
                <EyeOutlined className="text-sm" />
              </button>
              <button
                onClick={() => toast(`Chỉnh sửa khóa học #${record.id}`)}
                className="rounded-full p-2 text-amber-600 transition-colors duration-200 hover:bg-amber-100"
                title="Chỉnh sửa"
              >
                <EditOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleDelete(record)}
                className="bg-red-50 hover:bg-red-100 rounded-full p-2 text-red transition-colors duration-200"
                title="Xóa khóa học"
              >
                <DeleteOutlined className="text-sm" />
              </button>
            </div>
          );
        },
        size: 140
      }
    ],
    []
  );

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Quản lý khóa học">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red">
              <svg
                className="text-red-600 h-8 w-8"
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
              Không thể tải dữ liệu khóa học. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </BasePages>
    );
  }

  return (
    <>
      <BasePages pageHead="ClickFlow - Quản lý khóa học">
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách khóa học
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({courses?.result?.totalItems} khóa học)
                    </span>
                  </h2>
                  <button
                    onClick={handleCreateCourse}
                    className="hover:bg-blue-700 focus:ring-blue-500 inline-flex items-center rounded-md border border-transparent bg-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <PlusOutlined className="mr-2" />
                    Thêm khóa học mới
                  </button>
                </div>
              </div>

              <div className="p-6">
                <DataTable
                  columns={columns}
                  data={courses?.result?.datas ?? []}
                  pageCount={courses?.result?.totalPages ?? 0}
                  isLoading={isLoading}
                  onSearchChange={setKeyWord}
                />
              </div>
            </div>
          </div>

          {/* Create Course Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <PlusOutlined className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tạo khóa học mới
                  </h3>
                  <p className="text-sm text-gray-500">
                    Nhập thông tin để tạo khóa học mới
                  </p>
                </div>
              </div>
            }
            open={isCreateModalVisible}
            onCancel={handleCreateModalCancel}
            footer={null}
            width={800}
            getContainer={false}
            className="create-course-modal"
            bodyStyle={{
              maxHeight: '70vh',
              overflowY: 'auto',
              padding: 0
            }}
            style={{
              top: 20
            }}
          >
            <div className="px-6 pb-6 pt-6">
              <Form
                form={createForm}
                layout="vertical"
                onFinish={handleCreateCourseSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Form.Item
                    name="title"
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Tiêu đề khóa học
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tiêu đề khóa học!'
                      }
                    ]}
                  >
                    <Input
                      placeholder="Nhập tiêu đề khóa học"
                      className="h-10"
                    />
                  </Form.Item>

                  <Form.Item
                    name="price"
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Giá khóa học (VND)
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập giá khóa học!'
                      },
                      {
                        type: 'number',
                        min: 0,
                        message: 'Giá phải lớn hơn hoặc bằng 0!'
                      }
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập giá khóa học"
                      className="h-10 w-full"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="lessonLearned"
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Bài học thu được
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập bài học thu được!'
                    }
                  ]}
                >
                  <TextArea
                    placeholder="Mô tả những gì học viên sẽ học được từ khóa học này"
                    rows={3}
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Mô tả khóa học
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mô tả khóa học!'
                    }
                  ]}
                >
                  <TextArea
                    placeholder="Mô tả tổng quan về khóa học"
                    rows={4}
                  />
                </Form.Item>

                <Form.Item
                  name="content"
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Nội dung khóa học
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập nội dung khóa học!'
                    }
                  ]}
                >
                  <TextArea
                    placeholder="Nội dung chi tiết của khóa học"
                    rows={6}
                  />
                </Form.Item>

                <div className="sticky bottom-0 flex justify-end gap-3 bg-white pb-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCreateModalCancel}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createCourseMutation.isPending ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <PlusOutlined className="mr-2" />
                        Tạo khóa học
                      </>
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </Modal>

          {/* View Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue">
                  <EyeOutlined className="text-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chi tiết khóa học
                  </h3>
                  <p className="text-sm text-gray-500">
                    Thông tin chi tiết về khóa học
                  </p>
                </div>
              </div>
            }
            open={isViewModalVisible}
            onCancel={closeViewModal}
            footer={null}
            width={800}
            className="course-detail-modal"
          >
            {selectedCourse && (
              <div className="pt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Mã khóa học
                      </label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        #{selectedCourse.id}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Tiêu đề khóa học
                      </label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {selectedCourse.title}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Người tạo
                      </label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        #{selectedCourse.createById}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Ngày tạo
                      </label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatDate(selectedCourse.createAt)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Ngày cập nhật
                      </label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatDate(selectedCourse.updateAt)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <label className="text-sm font-medium uppercase tracking-wide text-gray-500">
                        Đánh giá
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <Rate
                          disabled
                          defaultValue={selectedCourse.avgRate}
                          allowHalf
                        />
                        <span className="text-lg font-semibold text-gray-900">
                          {selectedCourse.avgRate?.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <label className="text-sm font-medium uppercase tracking-wide text-green-700">
                    Giá khóa học
                  </label>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(selectedCourse.price)}
                  </p>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3">
                <div className="bg-red-100 flex h-10 w-10 items-center justify-center rounded-full">
                  <DeleteOutlined className="text-red" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận xóa khóa học
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
            okText="Xóa khóa học"
            cancelText="Hủy bỏ"
            okButtonProps={{
              className:
                'bg-red hover:bg-red-700 border-red hover:border-red-700',
              size: 'large'
            }}
            cancelButtonProps={{
              size: 'large'
            }}
            width={500}
          >
            <div className="py-4">
              <div className="bg-red-50 mb-4 rounded-lg border border-red p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="text-red-400 h-5 w-5"
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
                    <h3 className="text-sm font-medium text-red">Cảnh báo</h3>
                    <div className="mt-2 text-sm text-red">
                      <p>
                        Việc xóa khóa học sẽ không thể hoàn tác và có thể ảnh
                        hưởng đến học viên đã đăng ký.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa khóa học{' '}
                <span className="font-semibold text-gray-900">
                  "{selectedCourse?.title}" (#{selectedCourse?.id})
                </span>{' '}
                không?
              </p>
            </div>
          </Modal>
        </div>
      </BasePages>
      <ToastNotification />
    </>
  );
};

export default ManageCourse;
