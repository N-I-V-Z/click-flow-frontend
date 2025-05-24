import { useState } from 'react';

interface UpgradePackageProps {
  currentPlan: string;
  setCurrentPlan: (plan: string) => void;
}

export default function UpgradePackage({
  currentPlan,
  setCurrentPlan
}: UpgradePackageProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  const handleUpgrade = (plan: string): void => {
    if (plan === currentPlan) return;
    // Ví dụ gọi API hoặc xử lý logic nâng cấp
    alert(`Đã chọn nâng cấp lên gói: ${plan}`);
    setCurrentPlan(plan);
    setShowUpgradeModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="rounded-lg bg-white px-4 py-2 font-semibold text-purple-700 transition hover:bg-purple-100"
      >
        Nâng cấp gói
      </button>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowUpgradeModal(false)}
          ></div>
          <div className="relative mx-4 max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Nâng cấp gói dịch vụ
                </h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Plan Selection Section */}
            <div className="p-6">
              <p className="mb-8 text-gray-600">
                Chọn gói dịch vụ phù hợp với nhu cầu kinh doanh của bạn
              </p>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Basic Plan */}
                <div
                  className={`border ${currentPlan === 'basic' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'} relative flex h-full flex-col rounded-xl p-6`}
                >
                  {currentPlan === 'basic' && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                        Đang sử dụng
                      </span>
                    </div>
                  )}
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    Basic
                  </h3>
                  <div className="mb-1 text-3xl font-bold text-gray-900">
                    500.000
                    <span className="text-lg font-normal text-gray-500">₫</span>
                  </div>
                  <p className="mb-6 text-sm text-gray-500">mỗi tháng</p>

                  <ul className="mb-8 flex-grow space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Tối đa 3 chiến dịch cùng lúc
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">Báo cáo cơ bản</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">Hỗ trợ qua email</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgrade('basic')}
                    disabled={currentPlan === 'basic'}
                    className={`w-full rounded-lg py-2 font-medium ${
                      currentPlan === 'basic'
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : 'border border-purple-500 bg-white text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    {currentPlan === 'basic'
                      ? 'Gói hiện tại'
                      : 'Chọn gói Basic'}
                  </button>
                </div>

                {/* Premium Plan */}
                <div
                  className={`border ${currentPlan === 'premium' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'} relative flex flex-col rounded-xl bg-gradient-to-b from-purple-50 to-white p-6`}
                >
                  {currentPlan === 'premium' ? (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                        Đang sử dụng
                      </span>
                    </div>
                  ) : (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                        Phổ biến nhất
                      </span>
                    </div>
                  )}
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    Premium
                  </h3>
                  <div className="mb-1 text-3xl font-bold text-gray-900">
                    1.200.000
                    <span className="text-lg font-normal text-gray-500">₫</span>
                  </div>
                  <p className="mb-6 text-sm text-gray-500">mỗi tháng</p>

                  <ul className="mb-8 flex-grow space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Không giới hạn chiến dịch
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Báo cáo nâng cao + API
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">Hỗ trợ ưu tiên 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Phân tích khách hàng mục tiêu
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">A/B Testing</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgrade('premium')}
                    disabled={currentPlan === 'premium'}
                    className={`w-full rounded-lg py-2 font-medium ${
                      currentPlan === 'premium'
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                    }`}
                  >
                    {currentPlan === 'premium'
                      ? 'Gói hiện tại'
                      : 'Nâng cấp lên Premium'}
                  </button>
                </div>

                {/* Business Plan */}
                <div
                  className={`border ${currentPlan === 'business' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'} relative flex h-full flex-col rounded-xl p-6`}
                >
                  {currentPlan === 'business' && (
                    <div className="absolute -top-3 left-0 right-0 flex justify-center">
                      <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                        Đang sử dụng
                      </span>
                    </div>
                  )}
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    Business
                  </h3>
                  <div className="mb-1 text-3xl font-bold text-gray-900">
                    3.500.000
                    <span className="text-lg font-normal text-gray-500">₫</span>
                  </div>
                  <p className="mb-6 text-sm text-gray-500">mỗi tháng</p>

                  <ul className="mb-8 flex-grow space-y-3">
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Tất cả tính năng Premium
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Quản lý nhiều tài khoản
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Người quản lý tài khoản riêng
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Tùy chỉnh thương hiệu
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">
                        Phân tích ROI chi tiết
                      </span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgrade('business')}
                    disabled={currentPlan === 'business'}
                    className={`w-full rounded-lg py-2 font-medium ${
                      currentPlan === 'business'
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : 'border border-purple-500 bg-white text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    {currentPlan === 'business'
                      ? 'Gói hiện tại'
                      : 'Liên hệ với chúng tôi'}
                  </button>
                </div>
              </div>

              {/* Enterprise Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Bạn cần giải pháp dành riêng cho doanh nghiệp lớn?
                </p>
                <button
                  onClick={() => handleUpgrade('enterprise')}
                  className="mt-1 font-medium text-purple-600 hover:underline"
                >
                  Tìm hiểu thêm về gói Enterprise
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="mr-2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Đổi gói bất kỳ lúc nào. Tính năng đầy đủ có sẵn trong 14 ngày
                  dùng thử.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
