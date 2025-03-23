import React, { useState } from 'react';
import { Layout, Row, Col, Card, Table, message, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Content } = Layout;

/**
 * Hàm onChange cho RangePicker (dùng Dayjs).
 * Ta tự định nghĩa thay vì import RangePickerProps để tránh lỗi
 * "antd has no exported member 'RangePickerProps'".
 */
type OnRangeChange = (
  values: [Dayjs, Dayjs] | null,
  formatString: [string, string]
) => void;

// Kiểu dữ liệu cho bảng trình duyệt
interface BrowserStat {
  browser: string;
  click: number;
  clickRate: string; // ví dụ "66.7%"
}

// Kiểu dữ liệu cho bảng thiết bị
interface DeviceStat {
  device: string;
  quantity: number;
}

// Dữ liệu mẫu cho bảng
const initialBrowserData: BrowserStat[] = [
  { browser: 'Chrome', click: 800, clickRate: '66.7%' },
  { browser: 'Firefox', click: 200, clickRate: '16.7%' },
  { browser: 'Safari', click: 150, clickRate: '12.5%' },
  { browser: 'Edge', click: 50, clickRate: '4.2%' }
];
const initialDeviceData: DeviceStat[] = [
  { device: 'Máy tính', quantity: 700 },
  { device: 'Điện thoại', quantity: 400 },
  { device: 'Máy tính bảng', quantity: 100 }
];

// Dữ liệu click mặc định (giả lập 24 giờ)
const initialClickData = [
  { time: '00:00', clicks: 100 },
  { time: '01:00', clicks: 120 },
  { time: '02:00', clicks: 130 },
  { time: '03:00', clicks: 90 },
  { time: '04:00', clicks: 80 },
  { time: '05:00', clicks: 70 },
  { time: '06:00', clicks: 150 },
  { time: '07:00', clicks: 180 },
  { time: '08:00', clicks: 220 },
  { time: '09:00', clicks: 300 },
  { time: '10:00', clicks: 350 },
  { time: '11:00', clicks: 400 },
  { time: '12:00', clicks: 420 },
  { time: '13:00', clicks: 450 },
  { time: '14:00', clicks: 480 },
  { time: '15:00', clicks: 500 },
  { time: '16:00', clicks: 520 },
  { time: '17:00', clicks: 550 },
  { time: '18:00', clicks: 580 },
  { time: '19:00', clicks: 600 },
  { time: '20:00', clicks: 620 },
  { time: '21:00', clicks: 640 },
  { time: '22:00', clicks: 660 },
  { time: '23:00', clicks: 680 }
];

interface Props {
  totalClick?: number;
  invalidClick?: number;
  initialBudget?: number;
  remainingBudget?: number;
}

const CampaignAnalytics: React.FC<Props> = ({
  totalClick = 1200,
  invalidClick = 250,
  initialBudget = 5000000,
  remainingBudget = 4200000
}) => {
  // State: data cho biểu đồ
  const [chartData, setChartData] = useState(initialClickData);

  /**
   * Không cho chọn ngày nằm ngoài 7 ngày qua.
   * dayjs().subtract(7, 'day') -> 7 ngày trước
   * dayjs() -> hôm nay (giờ)
   */
  const disabledDate = (current: Dayjs) => {
    // Không cho chọn ngày sau hôm nay
    if (current.isAfter(dayjs())) return true;
    // Không cho chọn ngày trước 7 ngày qua
    if (current.isBefore(dayjs().subtract(7, 'day'))) return true;
    return false;
  };

  // Hàm xử lý khi đổi RangePicker
  const handleRangeChange: OnRangeChange = (values) => {
    if (!values) {
      // Clear -> reset
      setChartData(initialClickData);
      return;
    }
    const [start, end] = values;
    // Kiểm tra chênh lệch giờ
    const diffHours = end.diff(start, 'hour');
    if (diffHours > 24) {
      message.error('Mỗi lần xem tối đa 24 giờ thôi bạn ơi!');
      // Reset
      setChartData(initialClickData);
      return;
    }
    // Giả lập filter data theo giờ
    const startHour = start.hour();
    const endHour = end.hour();
    const filtered = initialClickData.filter((item) => {
      const itemHour = parseInt(item.time.split(':')[0], 10);
      return itemHour >= startHour && itemHour <= endHour;
    });
    setChartData(filtered);
  };

  // Cột table trình duyệt
  const browserColumns: ColumnsType<BrowserStat> = [
    { title: 'Trình duyệt', dataIndex: 'browser', key: 'browser' },
    { title: 'Click', dataIndex: 'click', key: 'click' },
    { title: 'Tỉ lệ click', dataIndex: 'clickRate', key: 'clickRate' }
  ];

  // Cột table thiết bị
  const deviceColumns: ColumnsType<DeviceStat> = [
    { title: 'Thiết bị', dataIndex: 'device', key: 'device' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' }
  ];

  return (
    <Layout style={{ backgroundColor: '#f5f5f5' }}>
      <Content className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold">Thống kê Traffic</h2>

          {/* 3 ô thống kê (đỏ, vàng, xanh lá) */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card className="h-full bg-[#fee2e2] shadow">
                <div className="flex h-full flex-col justify-center">
                  <span className="text-red-700 font-medium">
                    Tổng số click
                  </span>
                  <span className="text-red-700 mt-2 text-4xl font-extrabold">
                    {totalClick}
                  </span>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card className="h-full bg-[#fef9c3] shadow">
                <div className="flex h-full flex-col justify-center">
                  <span className="text-yellow-700 font-medium">
                    Click không hợp lệ
                  </span>
                  <span className="text-yellow-700 mt-2 text-4xl font-extrabold">
                    {invalidClick}
                  </span>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card className="h-full bg-[#dcfce7] shadow">
                <div className="flex h-full flex-col justify-center">
                  <span className="font-medium text-green-700">
                    Số tiền còn lại
                  </span>
                  <span className="mt-2 text-4xl font-extrabold text-green-700">
                    {remainingBudget.toLocaleString()} VND
                  </span>
                  <span className="text-sm text-green-600">
                    (Ngân sách: {initialBudget.toLocaleString()} VND)
                  </span>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Bộ lọc thời gian (RangePicker) */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <span className="font-semibold">
              Chọn khoảng thời gian trong 7 ngày qua (tối đa 24h):
            </span>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={handleRangeChange}
              allowClear
              disabledDate={disabledDate}
            />
          </div>

          {/* Biểu đồ line */}
          <div className="mt-4 rounded bg-white p-4 shadow">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={true}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2 bảng thống kê (trình duyệt, thiết bị) */}
          <Row gutter={[16, 16]} className="mt-8">
            <Col xs={24} md={12}>
              <Card
                className="h-full shadow"
                title={
                  <h3 className="mb-0 text-lg font-semibold">
                    Trình duyệt phổ biến
                  </h3>
                }
                bodyStyle={{ padding: '0' }}
              >
                <Table
                  columns={browserColumns}
                  dataSource={initialBrowserData}
                  pagination={false}
                  rowKey="browser"
                  bordered
                  size="middle"
                  // Zebra striping
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }
                  className="overflow-hidden rounded"
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                className="h-full shadow"
                title={
                  <h3 className="mb-0 text-lg font-semibold">
                    Nền tảng thiết bị
                  </h3>
                }
                bodyStyle={{ padding: '0' }}
              >
                <Table
                  columns={deviceColumns}
                  dataSource={initialDeviceData}
                  pagination={false}
                  rowKey="device"
                  bordered
                  size="middle"
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }
                  className="overflow-hidden rounded"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CampaignAnalytics;
