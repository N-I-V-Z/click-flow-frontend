import { motion } from 'framer-motion';

const Model: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-br from-purple-700 to-indigo-900 px-4 py-16 text-white">
      {/* Hiệu ứng fade-in cho tiêu đề */}
      <motion.h2
        className="mb-12 text-center text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Mô hình hoạt động của Affiliate Network
      </motion.h2>
      <div className="relative w-full max-w-5xl">
        <div className="flex items-center justify-between">
          {/* Nhà Cung Cấp */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
              <img
                src="/src/assets/Advertisers.png"
                alt="Nhà Cung Cấp"
                className="h-16"
              />
            </div>
            <h3 className="mt-4 text-xl font-bold">NHÀ CUNG CẤP</h3>
            <p className="mt-2 max-w-xs text-sm">
              Nhà cung cấp tại mọi lĩnh vực: Điện máy, Thời trang, Du lịch, Giáo
              dục tới Tài chính, Bất động sản…
            </p>
          </motion.div>

          {/* Click Flow */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl">
              <img
                src="https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/64c9037368afef001dddad3d.png"
                alt="Click Flow"
                className="h-20 w-20 rounded-full"
              />
            </div>
            <h3 className="text-orange-400 mt-4 text-xl font-bold">
              CLICK FLOW
            </h3>
            <p className="mt-2 max-w-xs text-sm">
              Click Flow cung cấp nền tảng kết nối Nhà cung cấp và Nhà phân phối
              với hệ thống kết nối đơn giản, đo lường chính xác.
            </p>
          </motion.div>

          {/* Nhà Phân Phối */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
              <img
                src="src/assets/Publishers.png"
                alt="Nhà Phân Phối"
                className="h-20"
              />
            </div>
            <h3 className="mt-4 text-xl font-bold">NHÀ PHÂN PHỐI</h3>
            <p className="mt-2 max-w-xs text-sm">
              Nhà phân phối có thể là cá nhân hay công ty có khả năng quảng cáo
              sản phẩm, dịch vụ và nhận hoa hồng từ Click Flow.
            </p>
          </motion.div>
        </div>

        {/* Đường nối SVG với hiệu ứng stroke và nhấp nháy */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1000 300"
        >
          {/* Đường cong nối Nhà Cung Cấp -> Click Flow */}
          <motion.path
            d="M150,150 C350,50 650,50 850,150"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeDasharray="800"
            strokeDashoffset="800"
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0.5, 1] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror'
            }}
          />
          {/* Đường cong nối Click Flow -> Nhà Phân Phối */}
          <motion.path
            d="M850,150 C650,250 350,250 150,150"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeDasharray="800"
            strokeDashoffset="800"
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0.5, 1] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
              delay: 1
            }}
          />
        </svg>
      </div>

      {/* Thêm hiệu ứng bong bóng di chuyển ở background */}
      <motion.div
        className="absolute rounded-full bg-white opacity-20"
        style={{ width: 100, height: 100, top: '10%', left: '80%' }}
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-white opacity-20"
        style={{ width: 150, height: 150, bottom: '15%', right: '10%' }}
        animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Hiệu ứng bong bóng nhỏ hơn, di chuyển ngẫu nhiên */}
      <motion.div
        className="absolute rounded-full bg-white opacity-10"
        style={{ width: 50, height: 50, top: '30%', left: '20%' }}
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-white opacity-10"
        style={{ width: 60, height: 60, bottom: '20%', right: '20%' }}
        animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default Model;
