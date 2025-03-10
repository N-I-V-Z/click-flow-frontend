import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { month: 'Tháng 1', income: 30 },
  { month: 'Tháng 2', income: 50 },
  { month: 'Tháng 3', income: 40 },
  { month: 'Tháng 4', income: 60 },
  { month: 'Tháng 5', income: 75 },
  { month: 'Tháng 6', income: 55 }
];

const Wallet: React.FC = () => {
  return (
    <div className="from-yellow-100 to-yellow-50 min-h-screen bg-gradient-to-r p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header với tiêu đề và card thông tin */}
        <div className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <h1 className="mb-4 text-4xl font-bold text-gray-800 sm:mb-0">
            Ví cá nhân
          </h1>
          <div className="flex gap-6">
            {/* Card Tài sản của bạn */}
            <div className="flex transform items-center rounded-xl bg-white p-5 shadow-lg transition hover:scale-105">
              <div className="mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tài sản của bạn</p>
                <p className="text-2xl font-bold text-green-600">
                  1.000.000 VND
                </p>
              </div>
            </div>
            {/* Card Thu nhập tháng trước */}
            <div className="flex transform items-center rounded-xl bg-white p-5 shadow-lg transition hover:scale-105">
              <div className="mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-blue-500 h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 0v7m0 0h7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thu nhập tháng trước</p>
                <p className="text-blue-600 text-2xl font-bold">
                  1.000.000 VND
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Khu vực chính: Biểu đồ và Lịch sử giao dịch */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Biểu đồ (chiếm 2 cột) */}
          <div className="rounded-xl bg-white p-6 shadow-lg lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Sơ đồ thu nhập
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#8884d8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lịch sử giao dịch */}
          <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Lịch sử giao dịch
              </h2>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex transform items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition hover:scale-105"
                  >
                    <span className="text-gray-600">Chiến dịch ABCD/A</span>
                    <span className="font-semibold text-green-600">
                      +5.000.000
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Nút Rút tiền */}
            <div className="mt-6 flex justify-end">
              <button className="rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-6 py-3 text-white shadow-lg transition hover:from-green-500 hover:to-green-700">
                Rút tiền
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
