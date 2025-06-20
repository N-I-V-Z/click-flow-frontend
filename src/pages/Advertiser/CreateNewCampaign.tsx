import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  InputNumber,
  Upload,
  Tabs,
  Row,
  Col
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useCreateCampaign, useUploadImage } from '@/queries/campaign.query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CreateCampaignPayload,
  ApiResponse,
  UploadImageResponse
} from '@/types';

const { Option } = Select;
const { TabPane } = Tabs;

interface FormValues {
  name: string;
  description: string;
  originURL: string;
  budget: number;
  startDate: Dayjs;
  endDate: Dayjs;
  typePay: string;
  typeCampaign: string;
  commission?: number;
  percents?: number;
  image?: UploadFile[];
}

interface CreateCampaignModalProps {
  visible: boolean;
  onCancel: () => void;
}

// Component ToastNotification
const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  visible,
  onCancel
}) => {
  const [form] = Form.useForm();

  // Watch form values để theo dõi thay đổi
  const commissionValue = Form.useWatch('commission', form);
  const percentsValue = Form.useWatch('percents', form);
  const startDateValue = Form.useWatch('startDate', form);
  const budgetValue = Form.useWatch('budget', form);

  // Hook tạo campaign
  const { mutate: createCampaignMutation } = useCreateCampaign();
  // Hook upload image
  const { mutate: uploadImageMutation } = useUploadImage();

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    beforeUpload: () => false,
    maxCount: 1
  };

  // Logic để xác định khi nào disable các trường
  const isCommissionDisabled =
    percentsValue !== undefined &&
    percentsValue !== null &&
    percentsValue !== 0;
  const isPercentsDisabled =
    commissionValue !== undefined &&
    commissionValue !== null &&
    commissionValue !== 0;

  // Disable dates cho DatePicker
  const disabledStartDate = (current: Dayjs | null): boolean => {
    if (!current) return false;
    // Disable tất cả ngày trong quá khứ (trước hôm nay)
    return current.isBefore(dayjs().startOf('day'));
  };

  const disabledEndDate = (current: Dayjs | null): boolean => {
    if (!current) return false;
    // Disable tất cả ngày trước ngày bắt đầu
    if (!startDateValue) {
      return current.isBefore(dayjs().startOf('day'));
    }
    return current.isBefore(startDateValue.startOf('day'));
  };

  // Handle khi clear một trường để enable trường kia
  const handleCommissionChange = (value: number | null) => {
    if (value === null || value === 0) {
      return;
    }
    // Nếu nhập commission, clear percents
    if (percentsValue) {
      form.setFieldValue('percents', undefined);
    }
    // Trigger validation nếu commission >= budget
    if (budgetValue && value >= budgetValue) {
      form.validateFields(['commission']);
    }
  };

  const handlePercentsChange = (value: number | null) => {
    if (value === null || value === 0) {
      return;
    }
    // Nếu nhập percents, clear commission
    if (commissionValue) {
      form.setFieldValue('commission', undefined);
    }
  };

  // Custom validator cho phần trăm
  const validatePercents = (_: any, value: number) => {
    if (value !== undefined && value !== null) {
      if (value < 0) {
        return Promise.reject(new Error('Phần trăm không được âm'));
      }
      if (value >= 100) {
        return Promise.reject(new Error('Phần trăm phải nhỏ hơn 100'));
      }
    }
    return Promise.resolve();
  };

  // Custom validator cho commission
  const validateCommission = (_: any, value: number) => {
    if (value !== undefined && value !== null) {
      if (value < 0) {
        return Promise.reject(new Error('Hoa hồng không được âm'));
      }
      if (budgetValue && value >= budgetValue) {
        return Promise.reject(new Error('Hoa hồng phải nhỏ hơn ngân sách'));
      }
    }
    return Promise.resolve();
  };

  // Custom validator cho budget
  const validateBudget = (_: any, value: number) => {
    if (value !== undefined && value !== null && value < 0) {
      return Promise.reject(new Error('Ngân sách không được âm'));
    }
    return Promise.resolve();
  };

  // Handle khi budget thay đổi - validate lại commission
  const handleBudgetChange = (value: number | null) => {
    if (value && commissionValue && commissionValue >= value) {
      // Trigger validation cho commission field
      form.validateFields(['commission']);
    }
  };

  // Custom validator cho ngày kết thúc
  const validateEndDate = (_: any, value: Dayjs) => {
    if (value && startDateValue && value.isBefore(startDateValue, 'day')) {
      return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
    }
    return Promise.resolve();
  };

  // Parser cho InputNumber
  const parseNumber = (value: string | undefined): number => {
    if (!value) return 0;
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Formatter cho InputNumber
  const formatNumber = (value: number | undefined): string => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const onFinish = (values: FormValues) => {
    const fileList = values.image || [];
    const startDate = values.startDate
      ? values.startDate.format('DD/MM/YYYY')
      : '';
    const endDate = values.endDate ? values.endDate.format('DD/MM/YYYY') : '';

    // Nếu không nhập giá trị, gán mặc định là 0 cho cả hai trường
    const commission = values.commission ?? 0;
    const percents = values.percents ?? 0;

    const callCreateCampaign = (imageUrl: string) => {
      const payload: CreateCampaignPayload = {
        name: values.name,
        description: values.description,
        originURL: values.originURL,
        budget: values.budget,
        startDate: startDate || '',
        endDate: endDate || '',
        typePay: values.typePay,
        typeCampaign: values.typeCampaign,
        commission,
        percents,
        image: imageUrl
      };

      createCampaignMutation(payload, {
        onSuccess: () => {
          toast.success('Tạo campaign thành công!');
          form.resetFields();
          onCancel();
        },
        onError: (err) => {
          console.error('Lỗi khi tạo campaign:', err);
          toast.error('Lỗi khi tạo campaign!');
        }
      });
    };

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj as File;
      uploadImageMutation(file, {
        onSuccess: (uploadRes: ApiResponse<UploadImageResponse>) => {
          const imageUrl = uploadRes?.result?.url || '';
          callCreateCampaign(imageUrl);
        },
        onError: (err) => {
          console.error('Lỗi khi upload ảnh:', err);
          toast.error('Lỗi khi upload ảnh!');
        }
      });
    } else {
      callCreateCampaign('');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="Tạo mới chiến dịch"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Tabs defaultActiveKey="1">
            {/* Tab 1: Thông tin chiến dịch */}
            <TabPane tab="Thông tin chiến dịch" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên chiến dịch"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên chiến dịch'
                      },
                      {
                        whitespace: true,
                        message: 'Tên chiến dịch không được để trống'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập tên chiến dịch" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="originURL"
                    label="Link giới thiệu sản phẩm"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập link giới thiệu sản phẩm'
                      },
                      {
                        type: 'url',
                        message: 'Vui lòng nhập URL hợp lệ'
                      }
                    ]}
                  >
                    <Input placeholder="https://..." />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Mô tả chiến dịch"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả chiến dịch' },
                  {
                    whitespace: true,
                    message: 'Mô tả chiến dịch không được để trống'
                  }
                ]}
              >
                <Input.TextArea rows={3} placeholder="Nhập mô tả chiến dịch" />
              </Form.Item>
            </TabPane>

            {/* Tab 2: Budget & Thời gian */}
            <TabPane tab="Budget & Thời gian" key="2">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startDate"
                    label="Ngày bắt đầu"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày bắt đầu' }
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={disabledStartDate}
                      placeholder="Chọn ngày bắt đầu"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endDate"
                    label="Ngày kết thúc"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ngày kết thúc'
                      },
                      { validator: validateEndDate }
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={disabledEndDate}
                      placeholder="Chọn ngày kết thúc"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* Tab 3: Loại thanh toán & Chiến dịch */}
            <TabPane tab="Loại & Chiến dịch" key="3">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="typePay"
                    label="Loại thanh toán"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn loại thanh toán'
                      }
                    ]}
                  >
                    <Select placeholder="Chọn loại thanh toán">
                      <Option value="CPC">CPC</Option>
                      <Option value="CPA">CPA</Option>
                      <Option value="CPS">CPS</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="typeCampaign"
                    label="Loại chiến dịch"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn loại chiến dịch'
                      }
                    ]}
                  >
                    <Select placeholder="Chọn loại chiến dịch">
                      <Option value="FoodAndBeverage">Food and Beverage</Option>
                      <Option value="Tourism">Du lịch</Option>
                      <Option value="Education">Giáo dục</Option>
                      <Option value="Other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* Tab 4: Hoa hồng & Phần trăm */}
            <TabPane tab="Hoa hồng & Phần trăm" key="4">
              <Form.Item label="Hoa hồng / Phần trăm">
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name="commission"
                      noStyle
                      rules={[{ validator: validateCommission }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Số tiền"
                        addonBefore="VND"
                        disabled={isCommissionDisabled}
                        onChange={handleCommissionChange}
                        min={0}
                        precision={0}
                        formatter={formatNumber}
                        parser={parseNumber}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="percents"
                      noStyle
                      rules={[{ validator: validatePercents }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Phần trăm"
                        addonAfter="%"
                        disabled={isPercentsDisabled}
                        onChange={handlePercentsChange}
                        min={0}
                        max={99.99}
                        precision={2}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                name="budget"
                label="Ngân sách"
                rules={[
                  { required: true, message: 'Vui lòng nhập ngân sách' },
                  { validator: validateBudget }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập ngân sách"
                  min={0}
                  precision={0}
                  formatter={formatNumber}
                  parser={parseNumber}
                  onChange={handleBudgetChange}
                />
              </Form.Item>
            </TabPane>

            {/* Tab 5: Upload ảnh */}
            <TabPane tab="Upload ảnh" key="5">
              <Form.Item
                name="image"
                label="Hình ảnh"
                valuePropName="fileList"
                getValueFromEvent={(e) => e && e.fileList}
              >
                <Upload {...uploadProps}>
                  <div style={{ textAlign: 'center' }}>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </TabPane>
          </Tabs>

          <Form.Item style={{ marginTop: 16, textAlign: 'center' }}>
            <Space>
              <Button type="primary" htmlType="submit" className="bg-blue">
                Tạo chiến dịch
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Toast Notification Component */}
      <ToastNotification />
    </>
  );
};

export default CreateCampaignModal;
