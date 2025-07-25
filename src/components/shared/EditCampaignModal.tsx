import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
  Tabs
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/button';
import {
  CampaignApiResponse,
  UpdateCampaignPayload,
  UploadImageResponse,
  ApiResponse
} from '@/types';
import { useUpdateCampaign, useUploadImage } from '@/queries/campaign.query';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { UploadProps, UploadFile } from 'antd';

// Enable custom parse format plugin
dayjs.extend(customParseFormat);

// Utility function to parse dates from API
const parseApiDate = (dateValue: unknown): Dayjs | undefined => {
  if (!dateValue) return undefined;

  // If it's already a Date object
  if (dateValue instanceof Date) {
    const result = dayjs(dateValue);
    return result.isValid() ? result : undefined;
  }

  // If it's a string
  if (typeof dateValue === 'string') {
    // Try dayjs auto-detection first
    let result = dayjs(dateValue);
    if (result.isValid()) {
      return result;
    }

    // Try common formats
    const formats = [
      'DD/MM/YYYY',
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'DD-MM-YYYY',
      'YYYY/MM/DD'
    ];
    for (const format of formats) {
      result = dayjs(dateValue, format);
      if (result.isValid()) {
        return result;
      }
    }
  }

  return undefined;
};

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Campaign type and pay type options
const campaignTypes = [
  'Technology',
  'Fashion',
  'Food',
  'Travel',
  'Education',
  'Healthcare',
  'Finance',
  'Gaming',
  'Beauty',
  'Sports',
  'Automotive',
  'RealEstate',
  'Entertainment',
  'HomeAndGarden',
  'PetCare',
  'FoodAndBeverage'
];

const payTypes = ['CPC', 'CPM', 'CPA', 'CPL'];

interface FormValues {
  name: string;
  description: string;
  originURL: string;
  budget: number;
  startDate?: Dayjs;
  endDate?: Dayjs;
  typePay: string;
  typeCampaign: string;
  commission?: number;
  percents?: number;
}

interface EditCampaignModalProps {
  open: boolean;
  campaign: CampaignApiResponse | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({
  open,
  campaign,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Watch form values to control commission vs percents
  const commissionValue = Form.useWatch('commission', form);

  const { mutate: updateCampaignMutation } = useUpdateCampaign();
  const { mutate: uploadImageMutation } = useUploadImage();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && campaign) {
      const startDate = parseApiDate(campaign.startDate);
      const endDate = parseApiDate(campaign.endDate);

      // Determine commission vs percents logic - only one should have value
      const hasCommission = campaign.commission && campaign.commission > 0;
      const hasPercents = campaign.percents && campaign.percents > 0;

      form.setFieldsValue({
        name: campaign.name || '',
        description: campaign.description || '',
        originURL: campaign.originURL || '',
        budget: campaign.budget || 0,
        startDate,
        endDate,
        typePay: campaign.typePay || 'CPC',
        typeCampaign: campaign.typeCampaign || 'Technology',
        // Priority: commission first, then percents
        commission: hasCommission ? campaign.commission || 0 : undefined,
        percents: hasCommission
          ? undefined
          : hasPercents
            ? campaign.percents || 0
            : undefined
      });

      // Set existing image if available
      if (campaign.image) {
        setFileList([
          {
            uid: '-1',
            name: 'current-image',
            status: 'done',
            url: campaign.image
          }
        ]);
      } else {
        setFileList([]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [open, campaign, form]);

  // Normalize URL function
  const normalizeURL = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Image compression function
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const onFinish = async (values: FormValues) => {
    if (!campaign) return;

    const startDate = values.startDate
      ? values.startDate.format('DD/MM/YYYY')
      : '';
    const endDate = values.endDate ? values.endDate.format('DD/MM/YYYY') : '';

    // Logic: chỉ một trong hai có giá trị
    const commission =
      values.commission && values.commission > 0 ? values.commission : 0;
    const percents =
      commission > 0
        ? 0
        : values.percents && values.percents > 0
          ? values.percents
          : 0;

    const normalizedURL = normalizeURL(values.originURL);

    const payload: UpdateCampaignPayload = {
      id: campaign.id,
      name: values.name,
      description: values.description,
      originURL: normalizedURL,
      budget: values.budget,
      startDate,
      endDate,
      typePay: values.typePay,
      typeCampaign: values.typeCampaign,
      commission,
      percents,
      image: campaign.image || '' // Will be updated if new image uploaded
    };

    try {
      // Show loading toast immediately for better UX
      const loadingToastId = toast.loading('Đang cập nhật chiến dịch...', {
        position: 'top-right',
        closeOnClick: false,
        hideProgressBar: false
      });

      let imageUrl = campaign.image || '';

      // Upload new image if provided
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const originalFile = fileList[0].originFileObj as File;

        // Update loading message
        toast.update(loadingToastId, {
          render: 'Đang nén và upload hình ảnh...',
          type: 'info',
          isLoading: true
        });

        const compressedFile = await compressImage(originalFile);

        const uploadRes = await new Promise<ApiResponse<UploadImageResponse>>(
          (resolve, reject) => {
            uploadImageMutation(compressedFile, {
              onSuccess: resolve,
              onError: reject
            });
          }
        );

        imageUrl = uploadRes?.result?.url || imageUrl;
      }

      payload.image = imageUrl;

      // Update loading message
      toast.update(loadingToastId, {
        render: 'Đang cập nhật thông tin chiến dịch...',
        type: 'info',
        isLoading: true
      });

      // Update campaign using mutation with proper promise handling
      await new Promise<void>((resolve, reject) => {
        updateCampaignMutation(payload, {
          onSuccess: () => {
            // Update to success toast
            toast.update(loadingToastId, {
              render: 'Cập nhật chiến dịch thành công!',
              type: 'success',
              isLoading: false,
              autoClose: 3000,
              closeOnClick: true
            });

            resolve();
          },
          onError: (error: unknown) => {
            // Update to error toast
            toast.update(loadingToastId, {
              render: '❌ Có lỗi xảy ra khi cập nhật chiến dịch',
              type: 'error',
              isLoading: false,
              autoClose: 5000,
              closeOnClick: true
            });

            reject(error);
          }
        });
      });

      // Call success callback and close modal
      onSuccess?.();
      onClose();
    } catch (error) {
      // Fallback error toast if something goes wrong with the process
      showToast.error('Có lỗi xảy ra trong quá trình cập nhật');
    }
  };

  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList
  }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={`Chỉnh sửa chiến dịch: ${campaign?.name || ''}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Tabs defaultActiveKey="1">
          {/* Tab 1: Thông tin cơ bản */}
          <TabPane tab="Thông tin cơ bản" key="1">
            <Form.Item
              name="name"
              label="Tên chiến dịch"
              rules={[
                { required: true, message: 'Vui lòng nhập tên chiến dịch!' }
              ]}
            >
              <Input placeholder="Nhập tên chiến dịch" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả chiến dịch" />
            </Form.Item>

            <Form.Item
              name="originURL"
              label="URL gốc"
              rules={[{ required: true, message: 'Vui lòng nhập URL!' }]}
            >
              <Input placeholder="Nhập URL (ví dụ: example.com hoặc https://example.com)" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="typeCampaign"
                  label="Loại chiến dịch"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn loại chiến dịch!'
                    }
                  ]}
                >
                  <Select placeholder="Chọn loại chiến dịch">
                    {campaignTypes.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="typePay"
                  label="Loại thanh toán"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn loại thanh toán!'
                    }
                  ]}
                >
                  <Select placeholder="Chọn loại thanh toán">
                    {payTypes.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          {/* Tab 2: Ngân sách & Thời gian */}
          <TabPane tab="Ngân sách & Thời gian" key="2">
            <Form.Item
              name="budget"
              label="Ngân sách"
              rules={[{ required: true, message: 'Vui lòng nhập ngân sách!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập ngân sách"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                min={0}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  label="Ngày bắt đầu"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày bắt đầu!' }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="Ngày kết thúc"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày kết thúc!' }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày kết thúc"
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          {/* Tab 3: Hoa hồng */}
          <TabPane tab="Hoa hồng" key="3">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="commission" label="Hoa hồng (VND)">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập hoa hồng"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    min={0}
                    onChange={(value) => {
                      // When commission is entered, clear percents
                      if (value && value > 0) {
                        form.setFieldValue('percents', undefined);
                      }
                      // When commission is cleared, allow percents input again
                      if (!value || value === 0) {
                        // Don't automatically set percents, just allow user to input
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="percents" label="Phần trăm (%)">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder={
                      commissionValue && commissionValue > 0
                        ? 'Đã có hoa hồng cố định'
                        : 'Nhập phần trăm'
                    }
                    min={0}
                    max={100}
                    disabled={Boolean(commissionValue && commissionValue > 0)}
                    onChange={(value) => {
                      // When percents is entered, clear commission
                      if (value && value > 0) {
                        form.setFieldValue('commission', undefined);
                      }
                    }}
                  />
                </Form.Item>
                {commissionValue && commissionValue > 0 && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '4px'
                    }}
                  >
                    Đã có hoa hồng cố định, không thể nhập phần trăm
                  </div>
                )}
              </Col>
            </Row>
          </TabPane>

          {/* Tab 4: Hình ảnh */}
          <TabPane tab="Hình ảnh" key="4">
            <Form.Item label="Hình ảnh chiến dịch">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Prevent auto upload
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </TabPane>
        </Tabs>

        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Button type="button" onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="submit">Cập nhật chiến dịch</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditCampaignModal;
