import { motion } from 'framer-motion';

const Background: React.FC = () => {
  return (
    <motion.div
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-500 to-purple-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated floating shapes */}
      <motion.div
        className="absolute rounded-full bg-purple-500"
        style={{ width: '150px', height: '150px', top: '15%', left: '10%' }}
        animate={{ y: [0, 30, 0], x: [0, 20, 0], opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full bg-blue"
        style={{ width: '200px', height: '200px', bottom: '10%', right: '15%' }}
        animate={{ y: [0, -40, 0], x: [0, -30, 0], opacity: [0.7, 0.4, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-lg bg-green-600"
        style={{ width: '120px', height: '120px', top: '60%', left: '70%' }}
        animate={{ y: [0, 20, 0], x: [0, -10, 0], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-lg bg-red"
        style={{ width: '100px', height: '100px', top: '80%', left: '30%' }}
        animate={{ y: [0, -20, 0], x: [0, 15, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Central content */}
      <motion.div
        className="relative z-10 px-6 text-center"
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-6xl font-extrabold uppercase text-yellow drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
        >
          Click Flow
        </motion.h1>
        <motion.h2
          className="mt-4 text-2xl font-medium text-white"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          Connect - Earn - Succeed
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-300"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          "Affiliate Marketing hay Tiếp Thị Liên Kết là một hình thức marketing
          dựa trên hiệu quả, giúp các nhà cung cấp tăng doanh số thông qua các
          nhà phân phối."
        </motion.p>
        <motion.button
          className="mt-8 rounded-lg bg-gradient-to-r from-orange to-purple-500 px-8 py-4 font-bold shadow-lg transition-transform duration-300 hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          TÌM HIỂU NGAY
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Background;
