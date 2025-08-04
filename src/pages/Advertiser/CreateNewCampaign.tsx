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
import { useInsufficientBalance } from '@/hooks/use-insufficient-balance';
import InsufficientBalanceModal from '@/components/shared/insufficient-balance-modal';

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
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="colored"
      limit={3}
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

  // Hook tạo campaign
  const { mutate: createCampaignMutation, isPending: isCreatingCampaign } =
    useCreateCampaign();
  // Hook upload image
  const { mutate: uploadImageMutation, isPending: isUploadingImage } =
    useUploadImage();

  // Hook kiểm tra số dư
  const {
    isModalVisible: isInsufficientBalanceVisible,
    hideModal: hideInsufficientBalanceModal,
    checkBalance,
    currentBalance
  } = useInsufficientBalance({
    action: 'tạo chiến dịch'
  });

  // Tính toán loading state tổng
  const isSubmitting = isCreatingCampaign || isUploadingImage;

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    beforeUpload: (file) => {
      // Validation file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error('Chỉ được upload file ảnh!');
        return false;
      }

      // Validation file size (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error('Kích thước ảnh phải nhỏ hơn 5MB!');
        return false;
      }

      return false; // Prevent auto upload
    },
    maxCount: 1,
    accept: 'image/*',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true
    }
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

  // Handle khi clear một trường để enable trường kia (với timeout)
  const handleCommissionChange = (value: number | null) => {
    setTimeout(() => {
      if (value === null || value === 0) {
        return;
      }
      // Nếu nhập commission, clear percents
      if (percentsValue) {
        form.setFieldValue('percents', undefined);
      }
    }, 300);
  };

  const handlePercentsChange = (value: number | null) => {
    setTimeout(() => {
      if (value === null || value === 0) {
        return;
      }
      // Nếu nhập percents, clear commission
      if (commissionValue) {
        form.setFieldValue('commission', undefined);
      }
    }, 300);
  };

  // Custom validator cho phần trăm
  const validatePercents = (_: unknown, value: number) => {
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
  const validateCommission = (_: unknown, value: number) => {
    if (value !== undefined && value !== null) {
      if (value < 0) {
        return Promise.reject(new Error('Hoa hồng không được âm'));
      }
      // Chỉ validate với budget khi budget đã có giá trị và > 0
      const currentBudget = form.getFieldValue('budget');
      if (currentBudget && currentBudget > 0 && value >= currentBudget) {
        return Promise.reject(new Error('Hoa hồng phải nhỏ hơn ngân sách'));
      }
    }
    return Promise.resolve();
  };

  // Custom validator cho budget
  const validateBudget = (_: unknown, value: number) => {
    if (value !== undefined && value !== null && value < 0) {
      return Promise.reject(new Error('Ngân sách không được âm'));
    }
    return Promise.resolve();
  };

  // Handle khi budget thay đổi - validate lại commission
  const handleBudgetChange = () => {
    // Loại bỏ setTimeout để tăng performance
    // Validation sẽ tự động chạy khi submit form
  };

  // Custom validator cho URL
  const validateURL = (_: unknown, value: string) => {
    if (!value) return Promise.resolve();

    // Loại bỏ khoảng trắng đầu cuối
    const trimmedValue = value.trim();

    // Kiểm tra URL bằng try-catch với URL constructor
    try {
      // Thử tạo URL object để validate
      const testUrl = trimmedValue.startsWith('http')
        ? new URL(trimmedValue)
        : new URL(`https://${trimmedValue}`);

      // Kiểm tra domain hợp lệ
      if (!testUrl.hostname || testUrl.hostname.length < 3) {
        throw new Error('Invalid domain');
      }

      return Promise.resolve();
    } catch {
      // Nếu URL constructor fail, fallback về regex
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+\.)*[a-z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/i;

      if (!urlPattern.test(trimmedValue)) {
        return Promise.reject(
          new Error('URL không hợp lệ. Ví dụ: https://abc.def/ghj')
        );
      }

      return Promise.resolve();
    }
  };

  // Hàm để chuẩn hóa URL (thêm https:// nếu thiếu)
  const normalizeURL = (url: string): string => {
    if (!url) return '';

    const trimmedURL = url.trim();

    // Nếu đã có protocol thì giữ nguyên
    if (trimmedURL.startsWith('http://') || trimmedURL.startsWith('https://')) {
      return trimmedURL;
    }

    // Xử lý các trường hợp đặc biệt
    // Nếu URL bắt đầu bằng www. thì thêm https://
    if (trimmedURL.startsWith('www.')) {
      return `https://${trimmedURL}`;
    }

    // Nếu có domain và path (ví dụ: youtube.com/watch) thì thêm https://
    if (trimmedURL.includes('.') && !trimmedURL.startsWith('//')) {
      return `https://${trimmedURL}`;
    }

    // Nếu bắt đầu bằng // thì thêm https:
    if (trimmedURL.startsWith('//')) {
      return `https:${trimmedURL}`;
    }

    // Fallback: thêm https://
    return `https://${trimmedURL}`;
  };

  // Custom validator cho ngày kết thúc
  const validateEndDate = (_: unknown, value: Dayjs) => {
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

  // Hàm nén ảnh trước khi upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Giảm kích thước nếu ảnh quá lớn
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Vẽ ảnh với kích thước mới
        ctx?.drawImage(img, 0, 0, width, height);

        // Chuyển đổi canvas thành blob với chất lượng 80%
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback về file gốc
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => resolve(file); // Fallback về file gốc nếu lỗi
      img.src = URL.createObjectURL(file);
    });
  };

  const onFinish = async (values: FormValues) => {
    // Kiểm tra số dư trước khi tạo campaign
    const hasEnoughBalance = checkBalance(values.budget);
    if (!hasEnoughBalance) {
      return; // Dừng tại đây nếu không đủ số dư, modal sẽ hiển thị
    }

    const fileList = values.image || [];
    const startDate = values.startDate
      ? values.startDate.format('DD/MM/YYYY')
      : '';
    const endDate = values.endDate ? values.endDate.format('DD/MM/YYYY') : '';

    // Nếu không nhập giá trị, gán mặc định là 0 cho cả hai trường
    const commission = values.commission ?? 0;
    const percents = values.percents ?? 0;

    // Chuẩn hóa URL (thêm https:// nếu thiếu)
    const normalizedURL = normalizeURL(values.originURL);

    const payload: CreateCampaignPayload = {
      name: values.name,
      description: values.description,
      originURL: normalizedURL,
      budget: values.budget,
      startDate: startDate || '',
      endDate: endDate || '',
      typePay: values.typePay,
      typeCampaign: values.typeCampaign,
      commission,
      percents,
      image: '' // Sẽ được cập nhật sau khi upload
    };

    try {
      // Hiển thị toast loading ngay lập tức để cải thiện UX
      const loadingToastId = toast.loading('Đang tạo campaign...', {
        autoClose: false
      });

      let imageUrl = '';

      // Nếu có file, upload trước
      if (fileList.length > 0) {
        const originalFile = fileList[0].originFileObj as File;

        // Cập nhật trạng thái upload
        toast.update(loadingToastId, {
          render: 'Đang nén và upload hình ảnh...',
          type: 'info',
          isLoading: true
        });

        // Nén ảnh trước khi upload để giảm thời gian
        const compressedFile = await compressImage(originalFile);

        const uploadRes = await new Promise<ApiResponse<UploadImageResponse>>(
          (resolve, reject) => {
            uploadImageMutation(compressedFile, {
              onSuccess: resolve,
              onError: reject
            });
          }
        );

        imageUrl = uploadRes?.result?.url || '';
      }

      // Cập nhật payload với image URL
      payload.image = imageUrl;

      // Cập nhật trạng thái tạo campaign
      toast.update(loadingToastId, {
        render: 'Đang tạo campaign...',
        type: 'info',
        isLoading: true
      });

      // Tạo campaign
      await new Promise<void>((resolve, reject) => {
        createCampaignMutation(payload, {
          onSuccess: () => {
            toast.update(loadingToastId, {
              render: 'Tạo campaign thành công!',
              type: 'success',
              isLoading: false,
              autoClose: 2000
            });
            form.resetFields();
            onCancel();
            resolve();
          },
          onError: (err: unknown) => {
            console.error('Lỗi khi tạo campaign:', err);
            let errorMessage = 'Lỗi khi tạo campaign!';
            if (err && typeof err === 'object' && 'response' in err) {
              const response = (
                err as { response?: { data?: { message?: string } } }
              ).response;
              errorMessage = response?.data?.message || errorMessage;
            }
            toast.update(loadingToastId, {
              render: errorMessage,
              type: 'error',
              isLoading: false,
              autoClose: 3000
            });
            reject(err);
          }
        });
      });
    } catch (error) {
      console.error('Lỗi trong quá trình tạo campaign:', error);
      // Toast error đã được xử lý ở trên
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
        onCancel={isSubmitting ? undefined : handleCancel}
        footer={null}
        width={800}
        className="p-4"
        closable={!isSubmitting}
        maskClosable={!isSubmitting}
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
                      { validator: validateURL }
                    ]}
                  >
                    <Input placeholder="Ví dụ: https://abc.def/ghj" />
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
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 transition-colors duration-200 hover:bg-blue-600"
                loading={isSubmitting}
                disabled={isSubmitting}
                size="large"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Tạo chiến dịch'}
              </Button>
              <Button onClick={handleCancel} disabled={isSubmitting}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Insufficient Balance Modal */}
      <InsufficientBalanceModal
        visible={isInsufficientBalanceVisible}
        onCancel={hideInsufficientBalanceModal}
        requiredAmount={form.getFieldValue('budget')}
        currentBalance={currentBalance}
        action="tạo chiến dịch"
        onRecharge={() => {
          // Đóng modal tạo campaign trước khi chuyển trang
          onCancel();
          form.resetFields();
        }}
      />

      {/* Toast Notification Component */}
      <ToastNotification />
    </>
  );
};

export default CreateCampaignModal;
