import { motion } from 'framer-motion';

const Model: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-br from-purple-800 to-indigo-900 px-6 py-20 text-white">
      {/* Tiêu đề với hiệu ứng gradient chữ */}
      <motion.h2
        className="mb-12 bg-gradient-to-r from-yellow via-pink-400 to-purple-500 bg-clip-text text-center text-4xl font-extrabold text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Mô hình hoạt động của Affiliate Network
      </motion.h2>

      <div className="relative w-full max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          {/* Nhà Cung Cấp */}
          <motion.div
            whileHover={{
              scale: 1.07,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            className="flex flex-col items-center rounded-3xl bg-white bg-opacity-10 px-6 py-8 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:bg-opacity-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-yellow shadow-lg">
              <img
                src="/assets/Advertisers.png"
                alt="Nhà Cung Cấp"
                className="h-16"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-wide">
              NHÀ CUNG CẤP
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed">
              Nhà cung cấp đa ngành: Điện máy, Thời trang, Du lịch, Giáo dục,
              Tài chính, Bất động sản…
            </p>
          </motion.div>

          {/* Click Flow */}
          <motion.div
            whileHover={{
              scale: 1.07,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            className="flex flex-col items-center rounded-3xl bg-white bg-opacity-10 px-6 py-8 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:bg-opacity-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-teal-500 shadow-lg">
              <img
                src="https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/64c9037368afef001dddad3d.png"
                alt="Click Flow"
                className="h-20 w-20 rounded-full"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-wide text-orange">
              CLICK FLOW
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed">
              Nền tảng kết nối Nhà cung cấp và Nhà phân phối: hệ thống đơn giản,
              đo lường chính xác và minh bạch.
            </p>
          </motion.div>

          {/* Nhà Phân Phối */}
          <motion.div
            whileHover={{
              scale: 1.07,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            className="flex flex-col items-center rounded-3xl bg-white bg-opacity-10 px-6 py-8 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:bg-opacity-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue to-indigo-600 shadow-lg">
              <img
                src="/assets/Publishers.png"
                alt="Nhà Phân Phối"
                className="h-20"
              />
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-wide">
              NHÀ PHÂN PHỐI
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed">
              Cá nhân hoặc công ty quảng bá sản phẩm, dịch vụ và nhận hoa hồng
              qua Click Flow.
            </p>
          </motion.div>
        </div>

        {/* Đường nối SVG với glow nhẹ */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1000 300"
        >
          {/* Nối Nhà Cung Cấp -> Click Flow */}
          <motion.path
            d="M100,150 C300,50 700,50 900,150"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="600"
            strokeDashoffset="600"
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0.4, 1] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror'
            }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }}
          />
          {/* Nối Click Flow -> Nhà Phân Phối */}
          <motion.path
            d="M900,150 C700,250 300,250 100,150"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="600"
            strokeDashoffset="600"
            animate={{ strokeDashoffset: 0, opacity: [0, 1, 0.4, 1] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
              delay: 1
            }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' }}
          />
        </svg>
      </div>

      {/* Bong bóng nền (điều chỉnh kích thước và vị trí) */}
      <motion.div
        className="absolute rounded-full bg-white opacity-10"
        style={{ width: 120, height: 120, top: '5%', left: '75%' }}
        animate={{ y: [0, 25, 0], x: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-white opacity-10"
        style={{ width: 160, height: 160, bottom: '10%', right: '5%' }}
        animate={{ y: [0, -25, 0], x: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-white opacity-5"
        style={{ width: 60, height: 60, top: '30%', left: '15%' }}
        animate={{ y: [0, 18, 0], x: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-white opacity-5"
        style={{ width: 70, height: 70, bottom: '25%', right: '25%' }}
        animate={{ y: [0, -18, 0], x: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-white opacity-5"
        style={{ width: 40, height: 40, top: '60%', left: '60%' }}
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default Model;
