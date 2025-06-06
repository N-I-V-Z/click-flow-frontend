import { motion } from 'framer-motion';
import { useRouter } from '@/routes/hooks';

const RegisterChoice = () => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
        <div className="bg-blue-500/20 absolute bottom-0 right-1/4 h-80 w-80 animate-pulse rounded-full blur-3xl delay-1000" />
        <div className="delay-2000 absolute left-0 top-1/2 h-64 w-64 animate-pulse rounded-full bg-pink-500/20 blur-3xl" />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.4%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3Ccircle%20cx=%2227%22%20cy=%227%22%20r=%221%22/%3E%3Ccircle%20cx=%2247%22%20cy=%227%22%20r=%221%22/%3E%3Ccircle%20cx=%227%22%20cy=%2227%22%20r=%221%22/%3E%3Ccircle%20cx=%2227%22%20cy=%2227%22%20r=%221%22/%3E%3Ccircle%20cx=%2247%22%20cy=%2227%22%20r=%221%22/%3E%3Ccircle%20cx=%227%22%20cy=%2247%22%20r=%221%22/%3E%3Ccircle%20cx=%2227%22%20cy=%2247%22%20r=%221%22/%3E%3Ccircle%20cx=%2247%22%20cy=%2247%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-5" />

      <div className="container relative z-10 mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 pt-12 text-center"
        >
          <motion.h1
            className="to-blue-200 mb-6 bg-gradient-to-r from-white via-purple-200 bg-clip-text text-6xl font-black text-transparent md:text-7xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Chọn vai trò
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-5xl text-transparent md:text-6xl">
              của bạn
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Bắt đầu hành trình kinh doanh với vai trò phù hợp nhất
          </motion.p>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Provider Card */}
            <motion.div
              className="group relative"
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl transition-all duration-500 group-hover:blur-2xl" />

              <div className="relative h-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-500 hover:border-purple-400/50">
                {/* Card Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
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
                      <h2 className="mb-1 text-3xl font-bold text-white">
                        Nhà cung cấp
                      </h2>
                      <p className="text-sm text-purple-200">Provider</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-8 space-y-6">
                  <motion.div
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                      <svg
                        className="h-6 w-6 text-purple-400"
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
                      <h3 className="mb-1 text-lg font-semibold text-white">
                        Tăng doanh số bán hàng
                      </h3>
                      <p className="text-sm text-gray-300">
                        Mở rộng kênh bán hàng hiệu quả với chi phí tối ưu
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                      <svg
                        className="h-6 w-6 text-purple-400"
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
                      <h3 className="mb-1 text-lg font-semibold text-white">
                        Mạng lưới đa dạng
                      </h3>
                      <p className="text-sm text-gray-300">
                        Tiếp cận nhà phân phối rộng khắp mọi miền
                      </p>
                    </div>
                  </motion.div>
                </div>

                <p className="mb-8 leading-relaxed text-gray-200">
                  Kết nối với hàng nghìn nhà phân phối tiềm năng và mở rộng thị
                  trường một cách hiệu quả thông qua nền tảng của chúng tôi.
                </p>

                <motion.button
                  onClick={() => router.push('/register-advertiser')}
                  className="w-full transform rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Liên hệ ngay
                  <svg
                    className="ml-2 inline h-5 w-5"
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
                </motion.button>
              </div>
            </motion.div>

            {/* Distributor Card */}
            <motion.div
              className="group relative"
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="from-blue-600 absolute inset-0 rounded-3xl bg-gradient-to-r to-cyan-600/20 blur-xl transition-all duration-500 group-hover:blur-2xl" />

              <div className="hover:border-blue-400/50 relative h-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-500">
                {/* Card Header */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-cyan-500 shadow-lg">
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
                      <h2 className="mb-1 text-3xl font-bold text-white">
                        Nhà phân phối
                      </h2>
                      <p className="text-sm text-blue">Distributor</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-8 space-y-6">
                  <motion.div
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="bg-blue-500/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white">
                        Biến traffic thành lợi nhuận
                      </h3>
                      <p className="text-sm text-gray-300">
                        Tối ưu hóa giá trị từ lưu lượng website hiện có
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="bg-blue-500 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
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
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white">
                        Hệ thống tính phí linh hoạt
                      </h3>
                      <p className="text-sm text-gray-300">
                        Hoa hồng hấp dẫn từ mỗi giao dịch thành công
                      </p>
                    </div>
                  </motion.div>
                </div>

                <p className="mb-8 leading-relaxed text-gray-200">
                  Kiếm tiền từ traffic website bằng cách phân phối sản phẩm chất
                  lượng cao từ các nhà cung cấp uy tín trên nền tảng.
                </p>

                <motion.button
                  onClick={() => router.push('/login')}
                  className="hover:shadow-blue-500/25 w-full transform rounded-2xl bg-gradient-to-r from-blue to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue hover:to-cyan-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đăng nhập ngay
                  <svg
                    className="ml-2 inline h-5 w-5"
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
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Tham gia cùng hàng nghìn đối tác tin cậy và bắt đầu hành trình
            <span className="bg-gradient-to-r from-purple-400 to-blue bg-clip-text font-semibold text-transparent">
              {' '}
              kinh doanh thành công{' '}
            </span>
            của bạn ngay hôm nay
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterChoice;
