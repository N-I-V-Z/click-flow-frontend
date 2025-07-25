import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RegisterChoiceModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl">
        {/* Split Layout Container */}
        <div className="flex min-h-[600px]">
          {/* Left Side - Publisher */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex-1 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-12 text-white"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

            {/* Floating Elements */}
            <div className="absolute right-8 top-8 h-24 w-24 animate-pulse rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-12 left-8 h-16 w-16 animate-pulse rounded-full bg-yellow-400/20 blur-xl delay-1000" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              {/* Header */}
              <div>
                <div className="mb-6 inline-flex items-center rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Publisher</span>
                </div>

                <h2 className="mb-4 text-4xl font-bold leading-tight">
                  Kiếm tiền từ
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                    nội dung của bạn
                  </span>
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-purple-100">
                  Biến passion thành thu nhập với nền tảng affiliate marketing
                  thông minh nhất
                </p>
              </div>

              {/* Features */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Thu nhập không giới hạn</h4>
                    <p className="text-sm text-purple-200">
                      Hoa hồng lên đến 30% mỗi giao dịch
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Setup siêu nhanh</h4>
                    <p className="text-sm text-purple-200">
                      Chỉ 2 phút để bắt đầu kiếm tiền
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Hỗ trợ 24/7</h4>
                    <p className="text-sm text-purple-200">
                      Đội ngũ chuyên gia luôn sẵn sàng
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <Link to="register-publisher" onClick={onClose}>
                  <Button className="group w-full rounded-xl bg-white px-8 py-4 text-lg font-semibold text-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-xl">
                    <span className="flex items-center justify-center gap-2">
                      Bắt đầu kiếm tiền ngay
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>

                <p className="mt-4 text-center text-sm text-purple-200">
                  Tham gia cùng{' '}
                  <span className="font-bold text-yellow-300">20+</span>{' '}
                  Publishers thành công
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Advertiser */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex-1 bg-gradient-to-br from-slate-50 to-blue-200 p-12 text-gray-800"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2227%22%20cy%3D%2227%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2247%22%20cy%3D%2247%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

            {/* Floating Elements */}
            <div className="absolute bottom-12 right-8 h-16 w-16 animate-pulse rounded-full bg-blue-400/20 blur-xl delay-1000" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              {/* Header */}
              <div>
                <div className="mb-6 inline-flex items-center rounded-full bg-blue-600 px-4 py-2">
                  <svg
                    className="mr-2 h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white">
                    Advertiser
                  </span>
                </div>

                <h2 className="mb-4 text-4xl font-bold leading-tight text-gray-900">
                  Tăng trưởng
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    doanh nghiệp x10
                  </span>
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-gray-600">
                  Kết nối với hàng nghìn influencers và mở rộng thị trường hiệu
                  quả
                </p>
              </div>

              {/* Features */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Tiếp cận đại chúng
                    </h4>
                    <p className="text-sm text-gray-600">
                      Kết nối với 20+ creators có ảnh hưởng
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Analytics chi tiết
                    </h4>
                    <p className="text-sm text-gray-600">
                      Báo cáo real-time và insights sâu sắc
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      ROI được đảm bảo
                    </h4>
                    <p className="text-sm text-gray-600">
                      Chi trả theo kết quả, tối ưu budget
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <Link to="register-advertiser">
                  <Button
                    className="group w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                    onClick={onClose}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Tư vấn miễn phí ngay
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Được tin tưởng bởi{' '}
                  <span className="font-bold text-blue-600">5+</span> doanh
                  nghiệp
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </DialogContent>
    </Dialog>
  );
}
