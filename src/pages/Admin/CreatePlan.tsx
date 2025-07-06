import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { PlusOutlined } from '@ant-design/icons';
import { useCreatePlan } from '@/queries/plan.query';
import { PlanRequest } from '@/types';

const { TextArea } = Input;

interface CreatePlanModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isVisible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm<PlanRequest>();
  const createPlanMutation = useCreatePlan();

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: PlanRequest) => {
    try {
      await createPlanMutation.mutateAsync(values);
      showToast.success('Tạo gói dịch vụ thành công!');
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      showToast.error('Có lỗi xảy ra khi tạo gói dịch vụ. Vui lòng thử lại!');
      console.error('Create plan error:', error);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <PlusOutlined className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tạo gói dịch vụ mới
            </h3>
            <p className="text-sm text-gray-500">
              Nhập thông tin để tạo gói dịch vụ mới
            </p>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      getContainer={false}
      className="create-plan-modal"
      bodyStyle={{
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: 0
      }}
      style={{
        top: 20
      }}
      destroyOnClose
    >
      <div className="px-6 pb-6 pt-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item
              name="name"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Tên gói dịch vụ
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên gói dịch vụ!'
                },
                {
                  max: 100,
                  message: 'Tên gói dịch vụ không được vượt quá 100 ký tự!'
                }
              ]}
            >
              <Input
                placeholder="Nhập tên gói dịch vụ"
                className="h-10"
                disabled={createPlanMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="price"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Giá gói dịch vụ (VND)
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá gói dịch vụ!'
                },
                {
                  type: 'number',
                  min: 0,
                  message: 'Giá phải lớn hơn hoặc bằng 0!'
                }
              ]}
            >
              <InputNumber
                placeholder="Nhập giá gói dịch vụ"
                className="h-10 w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                disabled={createPlanMutation.isPending}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item
              name="durationDays"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Thời hạn gói (ngày)
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập thời hạn gói dịch vụ!'
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Thời hạn phải lớn hơn 0!'
                }
              ]}
            >
              <InputNumber
                placeholder="Nhập số ngày"
                className="h-10 w-full"
                min={1}
                disabled={createPlanMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="maxCampaigns"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Số chiến dịch tối đa
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số chiến dịch tối đa!'
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Số chiến dịch phải lớn hơn 0!'
                }
              ]}
            >
              <InputNumber
                placeholder="Nhập số chiến dịch"
                className="h-10 w-full"
                min={1}
                disabled={createPlanMutation.isPending}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item
              name="maxClicksPerMonth"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Click/tháng tối đa
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số click tối đa!'
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Số click phải lớn hơn 0!'
                }
              ]}
            >
              <InputNumber
                placeholder="Nhập số click"
                className="h-10 w-full"
                min={1}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                disabled={createPlanMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="maxConversionsPerMonth"
              label={
                <span className="text-sm font-medium text-gray-700">
                  Chuyển đổi/tháng tối đa
                </span>
              }
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số chuyển đổi tối đa!'
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Số chuyển đổi phải lớn hơn 0!'
                }
              ]}
            >
              <InputNumber
                placeholder="Nhập số chuyển đổi"
                className="h-10 w-full"
                min={1}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                disabled={createPlanMutation.isPending}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={
              <span className="text-sm font-medium text-gray-700">
                Mô tả gói dịch vụ
              </span>
            }
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mô tả gói dịch vụ!'
              },
              {
                max: 500,
                message: 'Mô tả không được vượt quá 500 ký tự!'
              }
            ]}
          >
            <TextArea
              placeholder="Mô tả chi tiết về gói dịch vụ"
              rows={6}
              disabled={createPlanMutation.isPending}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <div className="sticky bottom-0 flex justify-end gap-3 bg-white pb-2 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={createPlanMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={createPlanMutation.isPending}
              className="hover:bg-blue inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createPlanMutation.isPending ? (
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang tạo...
                </>
              ) : (
                <>
                  <PlusOutlined className="mr-2" />
                  Tạo gói dịch vụ
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreatePlanModal;
