import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Row,
  Col,
  Card,
  Divider
} from 'antd';

const { Option } = Select;

interface CreateCampaignModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: unknown) => void;
}

interface Channel {
  id: number;
  type?: string;
  detail: string;
}

const ChannelForm: React.FC<{
  channel: Channel;
  index: number;
  onRemove: (id: number) => void;
}> = ({ channel, index, onRemove }) => (
  <Row gutter={16} align="middle" className="mb-3">
    <Col span={10}>
      <Form.Item
        name={`channelType${channel.id}`}
        label={index === 0 ? 'Loại kênh' : ''}
      >
        <Select placeholder="Chọn loại kênh" className="w-full">
          <Option value="Online">Online</Option>
          <Option value="Offline">Offline</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={10}>
      <Form.Item
        name={`channelDetail${channel.id}`}
        label={index === 0 ? 'Chi tiết kênh' : ''}
      >
        <Input placeholder="Nhập chi tiết kênh..." className="w-full" />
      </Form.Item>
    </Col>
    <Col span={4} className="flex justify-center">
      {index > 0 && (
        <Button danger onClick={() => onRemove(channel.id)}>
          Xóa
        </Button>
      )}
    </Col>
  </Row>
);

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  visible,
  onCancel,
  onCreate
}) => {
  const [form] = Form.useForm();
  const [channels, setChannels] = useState<Channel[]>([
    { id: Date.now(), type: undefined, detail: '' }
  ]);

  const addChannel = () => {
    setChannels([...channels, { id: Date.now(), type: undefined, detail: '' }]);
  };

  const removeChannel = (id: number) => {
    setChannels(channels.filter((channel) => channel.id !== id));
  };

  return (
    <Modal
      title="Tạo mới chiến dịch"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="rounded-lg shadow-lg"
    >
      <div className="flex h-[70vh] flex-col">
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Form layout="vertical" form={form} onFinish={onCreate}>
            <Space direction="vertical" size="large" className="w-full">
              {/* Thông tin chung */}
              <Card title="Thông tin chung" className="rounded-lg" bordered>
                <Form.Item
                  name="name"
                  label="Tên yêu cầu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên yêu cầu' }
                  ]}
                >
                  <Input placeholder="Nhập tên chiến dịch..." size="large" />
                </Form.Item>

                <Form.Item name="problem" label="Vấn đề/Nhu cầu">
                  <Input.TextArea
                    rows={3}
                    placeholder="Mô tả vấn đề bạn cần giải quyết..."
                    size="large"
                  />
                </Form.Item>

                <Divider />

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="productLink"
                      label="Link giới thiệu sản phẩm"
                    >
                      <Input placeholder="https://..." size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="currentSales"
                      label="Số lượng bán hiện tại"
                    >
                      <Input placeholder="Nhập số lượng bán..." size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="difference" label="Điểm khác biệt">
                  <Input.TextArea
                    rows={2}
                    placeholder="Sản phẩm này khác biệt thế nào?"
                    size="large"
                  />
                </Form.Item>

                <Form.Item name="segment" label="Phân khúc và chân dung">
                  <Input.TextArea
                    rows={2}
                    placeholder="Phân khúc và chân dung khách hàng"
                    size="large"
                  />
                </Form.Item>

                <Form.Item name="market" label="Thị trường tập trung">
                  <Select placeholder="Chọn thị trường" size="large">
                    <Option value="Nội địa">Nội địa</Option>
                    <Option value="Quốc tế">Quốc tế</Option>
                  </Select>
                </Form.Item>
              </Card>

              <Divider />

              {/* Kênh đang chạy */}
              <Card title="Kênh đang chạy" className="rounded-lg" bordered>
                {channels.map((channel, index) => (
                  <ChannelForm
                    key={channel.id}
                    channel={channel}
                    index={index}
                    onRemove={removeChannel}
                  />
                ))}
                <Button type="dashed" onClick={addChannel} block>
                  + Thêm kênh
                </Button>
              </Card>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="conversionRate"
                    label="Tỉ lệ chuyển đổi từ click sang đơn hàng"
                  >
                    <Input placeholder="Nhập tỉ lệ %..." size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="goal" label="Mục tiêu kỳ vọng">
                    <Input placeholder="Nhập mục tiêu..." size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="solution" label="Giải pháp lựa chọn">
                <Select placeholder="Chọn giải pháp" size="large">
                  <Option value="Quảng cáo trả phí">Quảng cáo trả phí</Option>
                  <Option value="SEO">SEO</Option>
                  <Option value="Influencer Marketing">
                    Influencer Marketing
                  </Option>
                </Select>
              </Form.Item>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="startDate" label="Ngày bắt đầu">
                    <DatePicker className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="endDate" label="Ngày kết thúc">
                    <DatePicker className="w-full" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="budgetReady" label="Ngân sách sẵn sàng chi trả">
                <Select placeholder="Chọn mức ngân sách" size="large">
                  <Option value="Dưới 10 triệu">Dưới 10 triệu</Option>
                  <Option value="10-50 triệu">10-50 triệu</Option>
                  <Option value="Trên 50 triệu">Trên 50 triệu</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="userFlow"
                label="Luồng người dùng cần thực hiện chính"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả luồng người dùng..."
                  size="large"
                />
              </Form.Item>

              <Divider />

              {/* Thông tin liên hệ */}
              <Card title="Thông tin liên hệ" className="rounded-lg">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="contactName" label="Họ và tên">
                      <Input placeholder="Nhập họ và tên..." size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contactEmail" label="Email">
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contactPhone" label="Số điện thoại">
                      <Input placeholder="Nhập số điện thoại..." size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Form>
        </div>

        <div className="bg-white p-4">
          <Space size="middle" className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-lg px-4 py-2"
              size="large"
            >
              Tạo chiến dịch
            </Button>
            <Button
              onClick={onCancel}
              className="rounded-lg px-4 py-2"
              size="large"
            >
              Hủy
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCampaignModal;
