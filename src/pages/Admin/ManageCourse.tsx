import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Modal, Badge, Rate, Form, Input, InputNumber, message } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import BasePages from '@/components/shared/base-pages';
import DataTable from '@/components/shared/data-table';
import {
  useGetCourseAdmin,
  useCreateCourse,
  useDeleteCourse,
  useUpdateCourse
} from '@/queries/course.query';
import { CourseResponse, UpdateCourseFormData } from '@/types';
import __helpers from '@/helpers';
import ToastNotification from '@/components/shared/toast-notification';
import VideoManagement from '@/components/shared/video-management';
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isVideoManagementVisible, setIsVideoManagementVisible] =
    useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [keyWord, setKeyWord] = useState<string>('');
  const { pageIndex, pageSize } = __helpers.usePaginationParams();
  const queryClient = useQueryClient();

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

  const deleteCourseMutation = useDeleteCourse();
  const updateCourseMutation = useUpdateCourse();

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

  const confirmDelete = async () => {
    if (selectedCourse) {
      try {
        await deleteCourseMutation.mutateAsync(selectedCourse.id);
        toast.success('Xóa khóa học thành công!');

        // Invalidate and refetch courses data
        queryClient.invalidateQueries({ queryKey: ['get-courses'] });
        refetch();

        setIsDeleteModalVisible(false);
        setSelectedCourse(null);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa khóa học!');
        console.error('Delete course error:', error);
      }
    }
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

  // Edit Course Modal handlers
  const handleEditCourse = useCallback(
    (record: CourseResponse) => {
      setSelectedCourse(record);
      setIsEditModalVisible(true);
      // Pre-fill the form with current data
      editForm.setFieldsValue({
        title: record.title,
        description: record.description,
        content: record.content,
        lessonLearned: record.lessonLearned
      });
    },
    [editForm]
  );

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedCourse(null);
    editForm.resetFields();
  };

  const handleEditCourseSubmit = async (values: UpdateCourseFormData) => {
    if (!selectedCourse) return;

    try {
      await updateCourseMutation.mutateAsync({
        courseId: selectedCourse.id,
        ...values
      });
      message.success('Cập nhật khóa học thành công!');
      setIsEditModalVisible(false);
      setSelectedCourse(null);
      editForm.resetFields();
      // Refetch data to update the list
      refetch();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật khóa học. Vui lòng thử lại!');
      console.error('Update course error:', error);
    }
  };

  // Video Modal handlers
  const handleManageVideo = (record: CourseResponse) => {
    setSelectedCourse(record);
    setIsVideoManagementVisible(true);
  };

  const handleVideoManagementClose = () => {
    setIsVideoManagementVisible(false);
    setSelectedCourse(null);
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
                className="text-blue rounded-full bg-blue-50 p-2 transition-colors duration-200 hover:bg-blue-100"
                title="Xem chi tiết"
              >
                <EyeOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleManageVideo(record)}
                className="rounded-full bg-purple-50 p-2 text-purple-600 transition-colors duration-200 hover:bg-purple-100"
                title="Quản lý Video"
              >
                <VideoCameraOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleEditCourse(record)}
                className="rounded-full p-2 text-amber-600 transition-colors duration-200 hover:bg-amber-100"
                title="Chỉnh sửa"
              >
                <EditOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleDelete(record)}
                className="text-red rounded-full bg-red-50 p-2 transition-colors duration-200 hover:bg-red-100"
                title="Xóa khóa học"
              >
                <DeleteOutlined className="text-sm" />
              </button>
            </div>
          );
        },
        size: 180
      }
    ],
    [handleEditCourse]
  );

  if (error) {
    return (
      <BasePages pageHead="ClickFlow - Quản lý khóa học">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="bg-red mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
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
                    className="inline-flex items-center rounded-md border border-transparent bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2"
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
                    className="inline-flex items-center rounded-md border border-transparent bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="bg-blue flex h-10 w-10 items-center justify-center rounded-full">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <DeleteOutlined className="text-[#8B5CF6]" />
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
            confirmLoading={deleteCourseMutation.isPending}
            okButtonProps={{
              className:
                'bg-[#8B5CF6] hover:bg-[#7C3AED] border-[#8B5CF6] hover:border-[#7C3AED]',
              size: 'large'
            }}
            cancelButtonProps={{
              size: 'large'
            }}
            width={500}
          >
            <div className="py-4">
              <div className="mb-4 rounded-lg border border-[#8B5CF6] bg-purple-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-[#8B5CF6]"
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
                    <h3 className="text-sm font-medium text-[#8B5CF6]">
                      Cảnh báo
                    </h3>
                    <div className="mt-2 text-sm text-[#7C3AED]">
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

          {/* Edit Course Modal */}
          <Modal
            title={
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <EditOutlined className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chỉnh sửa khóa học
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cập nhật thông tin khóa học #{selectedCourse?.id}
                  </p>
                </div>
              </div>
            }
            open={isEditModalVisible}
            onCancel={handleEditModalCancel}
            footer={null}
            width={800}
            getContainer={false}
            className="edit-course-modal"
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
                form={editForm}
                layout="vertical"
                onFinish={handleEditCourseSubmit}
                className="space-y-4"
              >
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
                  <Input placeholder="Nhập tiêu đề khóa học" className="h-10" />
                </Form.Item>

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
                    onClick={handleEditModalCancel}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={updateCourseMutation.isPending}
                    className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateCourseMutation.isPending ? (
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
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <EditOutlined className="mr-2" />
                        Cập nhật khóa học
                      </>
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </Modal>
        </div>
      </BasePages>

      {/* Video Management Component */}
      {isVideoManagementVisible && selectedCourse && (
        <VideoManagement
          courseId={selectedCourse.id}
          courseName={selectedCourse.title}
          onClose={handleVideoManagementClose}
        />
      )}

      <ToastNotification />
    </>
  );
};

export default ManageCourse;
