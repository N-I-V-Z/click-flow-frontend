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
  Col,
  Typography
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useCreateCampaign, useUploadImage } from '@/queries/campaign.query';
import { toast } from 'react-toastify';

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

export interface CreateCampaignPayload {
  name: string;
  description: string;
  originURL: string;
  budget: number;
  startDate: string;
  endDate: string;
  typePay: string;
  typeCampaign: string;
  commission: number;
  percents: number;
  image: string;
}

interface CreateCampaignModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  visible,
  onCancel
}) => {
  const [form] = Form.useForm();

  // Hook tạo campaign
  const { mutate: createCampaignMutation } = useCreateCampaign();
  // Hook upload image
  const { mutate: uploadImageMutation } = useUploadImage();

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    beforeUpload: () => false
  };

  const onFinish = (values: any) => {
    console.log('Form values: ', values);

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
        startDate,
        endDate,
        typePay: values.typePay,
        typeCampaign: values.typeCampaign,
        commission,
        percents,
        image: imageUrl
      };

      createCampaignMutation(payload, {
        onSuccess: (res) => {
          console.log('Tạo campaign thành công:', res);
          toast.success('Tạo campaign thành công!');
          onCancel();
          window.location.reload();
        },
        onError: (err) => {
          console.error('Lỗi khi tạo campaign:', err);
          toast.error('Lỗi khi tạo campaign!');
        }
      });
    };

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      uploadImageMutation(file, {
        onSuccess: (uploadRes: any) => {
          const imageUrl = uploadRes?.url || '';
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

    form.resetFields();
  };

  return (
    <Modal
      title="Tạo mới chiến dịch"
      visible={visible}
      onCancel={onCancel}
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
                    { required: true, message: 'Vui lòng nhập tên chiến dịch' }
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
                { required: true, message: 'Vui lòng nhập mô tả chiến dịch' }
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
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  label="Ngày kết thúc"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày kết thúc' }
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
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
                    { required: true, message: 'Vui lòng chọn loại thanh toán' }
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
                    { required: true, message: 'Vui lòng chọn loại chiến dịch' }
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
                  <Form.Item name="commission" noStyle>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Số tiền"
                      addonBefore="VND"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="percents" noStyle>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Phần trăm"
                      addonAfter="%"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="budget"
              label="Ngân sách"
              rules={[{ required: true, message: 'Vui lòng nhập ngân sách' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập ngân sách"
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
            <Button type="primary" htmlType="submit">
              Tạo chiến dịch
            </Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCampaignModal;
