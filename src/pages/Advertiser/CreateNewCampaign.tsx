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

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  visible,
  onCancel,
  onCreate
}) => {
  const [form] = Form.useForm();
  const [channels, setChannels] = useState([
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
        <div className="flex-1 overflow-y-auto p-6 ">
          <Form
            layout="vertical"
            form={form}
            onFinish={onCreate}
            className="p-4"
          >
            <Space direction="vertical" size={24} className="w-full">
              {/* Thông tin chung */}
              <Card title="Thông tin chung" className="rounded-lg shadow-md">
                <Form.Item
                  name="name"
                  label="Tên yêu cầu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên yêu cầu' }
                  ]}
                >
                  <Input
                    placeholder="Nhập tên chiến dịch..."
                    className="w-full rounded-md border p-2"
                  />
                </Form.Item>

                <Form.Item name="problem" label="Vấn đề/Nhu cầu">
                  <Input.TextArea
                    rows={3}
                    placeholder="Mô tả vấn đề bạn cần giải quyết..."
                    className="w-full rounded-md border p-2"
                  />
                </Form.Item>

                <Divider />

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="productLink"
                      label="Link giới thiệu sản phẩm"
                    >
                      <Input
                        placeholder="https://..."
                        className="w-full rounded-md border p-2"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="currentSales"
                      label="Số lượng bán hiện tại"
                    >
                      <Input
                        placeholder="Nhập số lượng bán..."
                        className="w-full rounded-md border p-2"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="difference" label="Điểm khác biệt">
                  <Input.TextArea
                    rows={2}
                    placeholder="Sản phẩm này khác biệt thế nào?"
                    className="w-full rounded-md border p-2"
                  />
                </Form.Item>

                <Form.Item name="segment" label="Phân khúc và chân dung">
                  <Input.TextArea
                    rows={2}
                    placeholder="Phân khúc và chân dung khách hàng"
                    className="w-full rounded-md border p-2"
                  />
                </Form.Item>

                <Form.Item name="market" label="Thị trường tập trung">
                  <Select placeholder="Chọn thị trường" className="w-full">
                    <Option value="Nội địa">Nội địa</Option>
                    <Option value="Quốc tế">Quốc tế</Option>
                  </Select>
                </Form.Item>
              </Card>

              <Divider />

              {/* Kênh đang chạy */}
              <Card title="Kênh đang chạy" className="rounded-lg shadow-md">
                {channels.map((channel, index) => (
                  <Row gutter={16} key={channel.id} className="mb-4">
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
                        <Input
                          placeholder="Nhập chi tiết kênh..."
                          className="w-full rounded-md border"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4} className="flex items-center pb-6">
                      {index > 0 && (
                        <Button
                          danger
                          onClick={() => removeChannel(channel.id)}
                        >
                          Xóa
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}

                <Button
                  type="dashed"
                  onClick={addChannel}
                  className="mt-2 w-full"
                >
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
                    <Input
                      placeholder="Nhập tỉ lệ %..."
                      className="w-full rounded-md border p-2"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="goal" label="Mục tiêu kỳ vọng">
                    <Input
                      placeholder="Nhập mục tiêu..."
                      className="w-full rounded-md border p-2"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="solution" label="Giải pháp lựa chọn">
                <Select placeholder="Chọn giải pháp" className="w-full">
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
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="endDate" label="Ngày kết thúc">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="budgetReady" label="Ngân sách sẵn sàng chi trả">
                <Select placeholder="Chọn mức ngân sách" className="w-full">
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
                  className="w-full rounded-md border p-2"
                />
              </Form.Item>

              <Divider />

              {/* Thông tin liên hệ */}
              <Card title="Thông tin liên hệ" className="rounded-lg shadow-md">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="contactName" label="Họ và tên">
                      <Input
                        placeholder="Nhập họ và tên..."
                        className="w-full rounded-md border p-2"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contactEmail" label="Email">
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full rounded-md border p-2"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="contactPhone" label="Số điện thoại">
                      <Input
                        placeholder="Nhập số điện thoại..."
                        className="w-full rounded-md border p-2"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Form>
        </div>
        <Space className="mt-5 flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-700 rounded-lg px-4 py-2 text-white"
          >
            Tạo chiến dịch
          </Button>
          <Button
            onClick={onCancel}
            className="rounded-lg bg-red px-4 py-2 text-white"
          >
            Hủy
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default CreateCampaignModal;
