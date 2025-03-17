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
  Upload
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useCreateCampaign } from '@/queries/campaign.query';

const { Option } = Select;

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
  advertiserId: number;
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
  const { mutate: createCampaignMutation } = useCreateCampaign();

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    beforeUpload: () => false
  };

  const onFinish = (values: any) => {
    let imageUrl = '';
    const fileList = values.image;
    if (fileList && fileList.length > 0) {
      imageUrl = fileList[0].name;
    }

    const startDate = values.startDate
      ? values.startDate.format('DD/MM/YYYY')
      : '';
    const endDate = values.endDate ? values.endDate.format('DD/MM/YYYY') : '';

    const payload: CreateCampaignPayload = {
      name: values.name,
      description: values.description,
      originURL: values.originURL,
      budget: values.budget,
      startDate,
      endDate,
      typePay: values.typePay,
      typeCampaign: values.typeCampaign,
      commission: values.commission,
      percents: values.percents,
      image: imageUrl,
      advertiserId: 1
    };

    createCampaignMutation(payload, {
      onSuccess: (res) => {
        console.log('Tạo campaign thành công:', res);
        onCancel();
      },
      onError: (err) => {
        console.error('Lỗi khi tạo campaign:', err);
      }
    });
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
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        {/* Tên chiến dịch */}
        <Form.Item
          name="name"
          label="Tên chiến dịch"
          rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}
        >
          <Input placeholder="Nhập tên chiến dịch" className="rounded-md" />
        </Form.Item>

        {/* Mô tả chiến dịch */}
        <Form.Item
          name="description"
          label="Mô tả chiến dịch"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả chiến dịch' }
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả chiến dịch"
            rows={3}
            className="rounded-md"
          />
        </Form.Item>

        {/* Link giới thiệu sản phẩm */}
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
          <Input placeholder="https://..." className="rounded-md" />
        </Form.Item>

        {/* Ngân sách */}
        <Form.Item
          name="budget"
          label="Ngân sách"
          rules={[{ required: true, message: 'Vui lòng nhập ngân sách' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập ngân sách"
            className="rounded-md"
          />
        </Form.Item>

        {/* Nhóm: Ngày bắt đầu - Ngày kết thúc */}
        <div className="flex space-x-4">
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            className="w-1/2"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            className="w-1/2"
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              className="rounded-md"
            />
          </Form.Item>
        </div>

        {/* Nhóm: Loại thanh toán - Loại chiến dịch */}
        <div className="flex space-x-4">
          <Form.Item
            name="typePay"
            label="Loại thanh toán"
            rules={[
              { required: true, message: 'Vui lòng chọn loại thanh toán' }
            ]}
            className="w-1/2"
          >
            <Select placeholder="Chọn loại thanh toán" className="rounded-md">
              <Option value="CPC">CPC</Option>
              <Option value="CPA">CPA</Option>
              <Option value="CPS">CCS</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="typeCampaign"
            label="Loại chiến dịch"
            rules={[
              { required: true, message: 'Vui lòng chọn loại chiến dịch' }
            ]}
            className="w-1/2"
          >
            <Select placeholder="Chọn loại chiến dịch" className="rounded-md">
              <Option value="FoodAndBeverage">Food and Beverage</Option>
              <Option value="Tourism">Du lịch</Option>
              <Option value="Education">Giáo dục</Option>
              <Option value="Other">Khác</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Nhóm: Hoa hồng - Phần trăm */}
        <div className="flex space-x-4">
          <Form.Item
            name="commission"
            label="Hoa hồng"
            rules={[{ required: true, message: 'Vui lòng nhập hoa hồng' }]}
            className="w-1/2"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập hoa hồng"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="percents"
            label="Phần trăm"
            rules={[{ required: true, message: 'Vui lòng nhập phần trăm' }]}
            className="w-1/2"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập phần trăm"
              className="rounded-md"
            />
          </Form.Item>
        </div>

        {/* Upload ảnh */}
        <Form.Item
          name="image"
          label="Upload ảnh"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
        >
          <Upload {...uploadProps}>
            <div className="flex flex-col items-center justify-center">
              <PlusOutlined />
              <span className="mt-2">Upload</span>
            </div>
          </Upload>
        </Form.Item>

        {/* Nút submit và hủy */}
        <Form.Item>
          <Space className="flex w-full justify-center">
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
