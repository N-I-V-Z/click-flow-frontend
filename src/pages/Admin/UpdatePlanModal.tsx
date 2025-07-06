import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { showToast } from '@/utils/toastUtils';
import { EditOutlined } from '@ant-design/icons';
import { useUpdatePlan } from '@/queries/plan.query';
import { Plans } from '@/types';

const { TextArea } = Input;

interface EditPlanModalProps {
  isVisible: boolean;
  plan: Plans | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditPlanModal: React.FC<EditPlanModalProps> = ({
  isVisible,
  plan,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm<Plans>();
  const { mutateAsync: updatePlan, isPending } = useUpdatePlan();

  // Pre-fill form when plan data is available
  useEffect(() => {
    if (plan && isVisible) {
      form.setFieldsValue({
        id: plan.id,
        name: plan.name,
        maxCampaigns: plan.maxCampaigns,
        maxClicksPerMonth: plan.maxClicksPerMonth,
        maxConversionsPerMonth: plan.maxConversionsPerMonth,
        description: plan.description,
        price: plan.price,
        durationDays: plan.durationDays || 30
      });
    }
  }, [plan, isVisible, form]);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: Plans) => {
    if (!plan) return;

    try {
      await updatePlan(values);
      showToast.success('Cập nhật gói dịch vụ thành công!');
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      showToast.error(
        'Có lỗi xảy ra khi cập nhật gói dịch vụ. Vui lòng thử lại!'
      );
      console.error('Update plan error:', error);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <EditOutlined className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Chỉnh sửa gói dịch vụ
            </h3>
            <p className="text-sm text-gray-500">
              Cập nhật thông tin gói dịch vụ "{plan?.name}"
            </p>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      getContainer={false}
      className="edit-plan-modal"
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
          {/* Form fields without hidden ID */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
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
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
              disabled={isPending}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <div className="sticky bottom-0 flex justify-end gap-3 bg-white pb-2 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
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
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <EditOutlined className="mr-2" />
                  Cập nhật gói dịch vụ
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditPlanModal;
