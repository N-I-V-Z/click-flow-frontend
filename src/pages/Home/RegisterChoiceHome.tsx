import { motion } from 'framer-motion';
import { useRouter } from '@/routes/hooks';

const RegisterChoice = () => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-1000" />
        <div className="delay-2000 absolute left-0 top-1/2 h-64 w-64 animate-pulse rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <motion.div
            className="mx-auto mb-6 inline-flex items-center rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 backdrop-blur-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-sm font-medium text-purple-300">
              🚀 Platform Affiliate Thế Hệ Mới
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Chọn vai trò
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              phù hợp với bạn
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Khởi đầu hành trình kinh doanh thông minh với nền tảng affiliate
            hàng đầu
          </motion.p>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Provider Card */}
            <motion.div
              className="group relative"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Decorative Elements */}
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl" />
                <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-gradient-to-br from-purple-400/5 to-pink-400/5 blur-xl" />

                {/* Card Header */}
                <div className="relative mb-8">
                  <div className="mb-6 flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                      <svg
                        className="h-8 w-8 text-white"
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
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Advertiser
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                          Doanh nghiệp
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="leading-relaxed text-gray-300">
                    Mở rộng thị trường và tăng doanh số thông qua mạng lưới
                    affiliate chuyên nghiệp
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                      <svg
                        className="h-5 w-5 text-purple-400"
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
                      <h3 className="text-sm font-semibold text-white">
                        Tăng doanh số
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Mở rộng kênh bán hàng hiệu quả
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                      <svg
                        className="h-5 w-5 text-purple-400"
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
                      <h3 className="text-sm font-semibold text-white">
                        Mạng lưới rộng
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Kết nối với hàng nghìn partner
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                      <svg
                        className="h-5 w-5 text-purple-400"
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
                      <h3 className="text-sm font-semibold text-white">
                        Báo cáo chi tiết
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Theo dõi hiệu quả real-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                      <svg
                        className="h-5 w-5 text-purple-400"
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
                      <h3 className="text-sm font-semibold text-white">
                        Bảo mật cao
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Thanh toán an toàn, minh bạch
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => router.push('/register-advertiser')}
                  className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Liên hệ ngay
                    <svg
                      className="h-5 w-5 transition-transform group-hover/btn:translate-x-1"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                </motion.button>
              </div>
            </motion.div>

            {/* Distributor Card */}
            <motion.div
              className="group relative"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Card Glow Effect */}
              <div className="to-blue absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Decorative Elements */}
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-2xl" />
                <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/5 to-cyan-400/5 blur-xl" />

                {/* Card Header */}
                <div className="relative mb-8">
                  <div className="mb-6 flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25">
                      <svg
                        className="h-8 w-8 text-white"
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
                      <h2 className="text-3xl font-bold text-white">
                        Publisher
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="bg-blue rounded-full px-2 py-1 text-xs font-medium text-white">
                          Cá nhân
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="leading-relaxed text-gray-300">
                    Kiếm tiền từ traffic website của bạn thông qua hệ thống
                    affiliate thông minh
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="bg-blue flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <svg
                        className="h-5 w-5 text-white"
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
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Thu nhập thụ động
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Biến traffic thành lợi nhuận
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="bg-blue flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Hoa hồng hấp dẫn
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Hệ thống tính phí linh hoạt
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="bg-blue flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <svg
                        className="h-5 w-5 text-white"
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
                      <h3 className="text-sm font-semibold text-white">
                        Setup nhanh chóng
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Tích hợp dễ dàng trong 5 phút
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="bg-blue flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <svg
                        className="h-5 w-5 text-white"
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
                      <h3 className="text-sm font-semibold text-white">
                        Hỗ trợ 24/7
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        Đội ngũ chuyên gia luôn sẵn sàng
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => router.push('/login')}
                  className="group/btn relative mt-4 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Đăng nhập ngay
                    <svg
                      className="h-5 w-5 transition-transform group-hover/btn:translate-x-1"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Tham gia cộng đồng thành công
            </h3>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
              Hơn <span className="font-bold text-purple-400">10,000+</span> đối
              tác tin cậy đã chọn nền tảng của chúng tôi để
              <span className="to-blue bg-gradient-to-r from-purple-400 bg-clip-text font-semibold text-transparent">
                {' '}
                xây dựng thu nhập bền vững{' '}
              </span>
              từ affiliate marketing
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>Miễn phí tham gia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue h-2 w-2 rounded-full"></div>
                <span>Hỗ trợ tận tình</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span>Thanh toán nhanh chóng</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterChoice;
