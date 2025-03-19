import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TableSearchInput from '@/components/shared/table-search-input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/* ----------------- PHẦN DASHBOARD ----------------- */
const PublisherDashboard: React.FC = () => {
  // -------------------- DỮ LIỆU MẪU --------------------
  const stats = {
    totalClicks: 1200,
    totalClicksCompleted: 950,
    activeUsers: 300
  };

  const browserData = [
    { name: 'Chrome', clicks: 800 },
    { name: 'Firefox', clicks: 200 },
    { name: 'Safari', clicks: 150 },
    { name: 'Edge', clicks: 50 }
  ];
  const totalBrowserClicks = browserData.reduce(
    (acc, browser) => acc + browser.clicks,
    0
  );

  const devicePlatforms = [
    { platform: 'Máy tính', count: 700 },
    { platform: 'Điện thoại', count: 400 },
    { platform: 'Máy tính bảng', count: 100 }
  ];

  const chartData = [
    { time: '08:00', clicks: 100 },
    { time: '09:00', clicks: 200 },
    { time: '10:00', clicks: 150 },
    { time: '11:00', clicks: 300 },
    { time: '12:00', clicks: 250 },
    { time: '13:00', clicks: 400 },
    { time: '14:00', clicks: 350 },
    { time: '15:00', clicks: 450 },
    { time: '16:00', clicks: 500 },
    { time: '17:00', clicks: 550 },
    { time: '18:00', clicks: 600 }
  ];

  const conversionData = [
    { name: 'Chiến dịch A', value: 1200000 },
    { name: 'Chiến dịch B', value: 800000 },
    { name: 'Chiến dịch C', value: 600000 },
    { name: 'Chiến dịch D', value: 300000 }
  ];
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AA66CC',
    '#F75C03'
  ];

  const moneyChartData = [
    { time: '08:00', amount: 100000 },
    { time: '09:00', amount: 200000 },
    { time: '10:00', amount: 350000 },
    { time: '11:00', amount: 500000 },
    { time: '12:00', amount: 550000 },
    { time: '13:00', amount: 700000 },
    { time: '14:00', amount: 850000 },
    { time: '15:00', amount: 900000 },
    { time: '16:00', amount: 1000000 },
    { time: '17:00', amount: 1100000 },
    { time: '18:00', amount: 1200000 }
  ];

  // Framer Motion
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <div className="mb-6">
          <h1 className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-lg">
            Dashboard
          </h1>
        </div>

        {/* Header: Chọn ngày, chiến dịch và tìm kiếm */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-6 flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-2xl transition-transform duration-300 hover:scale-105"
        >
          <label
            className="text-sm font-medium text-gray-600"
            htmlFor="date-range"
          >
            So sánh với
          </label>
          <input
            id="date-range"
            type="text"
            placeholder="15/02/2025 đến 15/02/2025"
            className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>Chiến dịch</option>
            <option>Chiến dịch 1</option>
            <option>Chiến dịch 2</option>
          </select>
          <TableSearchInput />
        </motion.div>

        {/* Thẻ thống kê */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: 'Tổng số click', value: stats.totalClicks },
            { title: 'Tổng click chờ xong', value: stats.totalClicksCompleted },
            { title: 'Người dùng hoạt động', value: stats.activeUsers }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              <span className="text-sm text-gray-500">{stat.title}</span>
              <div className="mt-2 text-3xl font-bold text-gray-800">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Biểu đồ đường: Clicks */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-6 rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-gray-600">Clicks</span>
            <span className="text-sm text-gray-400">08:00 - 18:00</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#ff6b81"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bảng thông tin */}
        <div className="mb-5 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Bảng Trình duyệt */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Trình duyệt phổ biến
            </h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2">Trình duyệt</th>
                  <th className="py-2">Click</th>
                  <th className="py-2">Tỉ lệ click</th>
                </tr>
              </thead>
              <tbody>
                {browserData.map((browser, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                  >
                    <td className="py-2">{browser.name}</td>
                    <td className="py-2">{browser.clicks}</td>
                    <td className="py-2">
                      {totalBrowserClicks > 0
                        ? ((browser.clicks / totalBrowserClicks) * 100).toFixed(
                            1
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Bảng Nền tảng thiết bị */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Nền tảng thiết bị
            </h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2">Thiết bị</th>
                  <th className="py-2">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {devicePlatforms.map((device, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 transition duration-200 hover:bg-gray-50"
                  >
                    <td className="py-2">{device.platform}</td>
                    <td className="py-2">{device.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Biểu đồ về số tiền chuyển đổi */}
        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Biểu đồ tròn: tiền chuyển đổi theo chiến dịch */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Tiền chuyển đổi theo chiến dịch
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    label
                    paddingAngle={3}
                  >
                    {conversionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Biểu đồ đường: số tiền theo thời gian */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="rounded-lg bg-white p-6 shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              Biểu đồ đường: Số tiền chuyển đổi
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moneyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* TÍCH HỢP PHẦN FEEDBACK  */}
        <ReviewSection />
      </motion.div>
    </div>
  );
};

/* ----------------- PHẦN FEEDBACK: REVIEW SECTION ----------------- */
const ReviewSection: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [review, setReview] = useState<string>('');

  interface Feedback {
    id: number;
    name: string;
    date: string;
    content: string;
  }

  const [feedbackList, setFeedbackList] = useState<Feedback[]>([
    {
      id: 1,
      name: 'Robert Karamazov',
      date: '20 days ago',
      content:
        'I recently had the opportunity to explore Pagondes’s UI design system, and it left a lasting impression on my workflow...'
    },
    {
      id: 2,
      name: 'Nilesh Shah',
      date: '1 month ago',
      content:
        'I recently had the opportunity to explore Pagondes’s UI design system, and it left a lasting impression on my workflow...'
    },
    {
      id: 3,
      name: 'Edna Watson',
      date: '2 months ago',
      content:
        'I recently had the opportunity to explore Pagondes’s UI design system, and it left a lasting impression on my workflow...'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !review || rating === 0) {
      alert('Vui lòng nhập đủ thông tin!');
      return;
    }
    const newFeedback: Feedback = {
      id: Date.now(),
      name: 'Guest User',
      date: 'Just now',
      content: review
    };
    setFeedbackList([newFeedback, ...feedbackList]);
    setRating(0);
    setEmail('');
    setReview('');
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white px-4 py-8 shadow-2xl transition-transform duration-300 hover:scale-105">
      <h2 className="mb-6 text-2xl font-bold text-gray-700">
        Phản hồi người dùng
      </h2>

      {/* Khu vực hiển thị Average Rating & Submit Review */}
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Average Rating */}
        <div className="rounded border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">Average Rating</h3>
          <div className="mb-4 flex items-center">
            <span className="mr-2 text-3xl font-bold">4.5</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isFullStar = starValue <= 4;
                const isHalfStar = starValue === 5; // 5 => half
                return (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFullStar ? '#fbbf24' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="#fbbf24"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={isFullStar || isHalfStar ? 2 : 1}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.39 2.463a1 1 0 00-.363 1.118l1.296 3.993c.285.877-.722 1.601-1.487 1.073l-3.365-2.452a1 1 0 00-1.176 0l-3.365 2.452c-.765.528-1.772-.196-1.487-1.073l1.296-3.993a1 1 0 00-.363-1.118L2.78 9.393c-.783-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.966z"
                    />
                  </svg>
                );
              })}
            </div>
          </div>

          {/* Thanh hiển thị phần trăm cho mỗi mức sao */}
          <div className="space-y-2">
            {[
              { star: 5, percent: 50 },
              { star: 4, percent: 30 },
              { star: 3, percent: 10 },
              { star: 2, percent: 7 },
              { star: 1, percent: 3 }
            ].map((item) => (
              <div key={item.star} className="flex items-center space-x-2">
                <span className="w-10 text-sm font-medium text-gray-700">
                  {item.star} star
                </span>
                <div className="h-2 w-full rounded bg-gray-200">
                  <div
                    className="bg-yellow-500 h-2 rounded"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Your Review */}
        <div className="rounded border border-gray-100 p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">Submit Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Add Your Rating
              </label>
              <select
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={0}>Select rating...</option>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded border border-gray-300 px-3 py-2"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Write Your Review
              </label>
              <textarea
                className="w-full rounded border border-gray-300 px-3 py-2"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/* Danh sách Feedback */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Customer Feedbacks
        </h3>
        <div className="space-y-6">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="rounded bg-gray-50 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold">{fb.name}</h4>
                <span className="text-sm text-gray-500">{fb.date}</span>
              </div>
              <p className="text-gray-700">{fb.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;
