import { motion } from 'framer-motion';
import { useRouter } from '@/routes/hooks';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: i * 0.3
    }
  })
};

const imageVariants = {
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.95 }
};

const buttonVariants = {
  hover: { scale: 1.1, boxShadow: '0px 0px 12px rgba(0,0,0,0.5)' },
  tap: { scale: 0.95 }
};

const RegisterChoice: React.FC = () => {
  const route = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-600 py-12">
      <div className="grid max-w-5xl grid-cols-1 gap-10 p-6 md:grid-cols-2">
        {/* Nhà cung cấp */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="hover:shadow-3xl relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition duration-300"
          whileHover={{ scale: 1.03 }}
        >
          {/* Animated Glowing Border */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              border: '2px solid transparent',
              background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
              WebkitBackgroundClip: 'text'
            }}
          />
          <div className="flex justify-center">
            <motion.div
              className="bg-yellow-100 flex h-60 w-40 items-center justify-center rounded-full"
              variants={imageVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <img
                src="https://masoffer.com/wp-content/uploads/2016/09/home-publisher-icon-1.png"
                alt="Nhà cung cấp"
                className="object-contain"
              />
            </motion.div>
          </div>
          <h2 className="text-orange-500 mt-4 text-2xl font-bold">
            Nhà cung cấp
          </h2>
          <p className="mt-2 font-semibold text-gray-600">
            TĂNG DOANH SỐ BÁN HÀNG
          </p>
          <p className="mt-2 text-gray-500">
            Tiếp cận người mua, bán hàng dễ dàng với mạng lưới nhà phân phối đa
            dạng.
          </p>
          <motion.button
            onClick={() => route.push('/register-advertiser')}
            className="mt-10 rounded-lg bg-[#0072C6] px-6 py-4 text-white shadow-md transition duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            LIÊN HỆ NGAY
          </motion.button>
        </motion.div>

        {/* Nhà phân phối */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="hover:shadow-3xl relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition duration-300"
          whileHover={{ scale: 1.03 }}
        >
          {/* Animated Glowing Border */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              border: '2px solid transparent',
              background: 'linear-gradient(90deg, #00e676, #00b0ff)',
              WebkitBackgroundClip: 'text'
            }}
          />
          <div className="flex justify-center">
            <motion.div
              className="bg-blue-100 flex h-60 w-40 items-center justify-center rounded-full"
              variants={imageVariants}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap="tap"
            >
              <img
                src="https://masoffer.com/wp-content/uploads/2016/09/home-merchant-icon-1.png"
                alt="Nhà phân phối"
                className="object-contain"
              />
            </motion.div>
          </div>
          <h2 className="text-blue-500 mt-4 text-2xl font-bold">
            Nhà phân phối
          </h2>
          <p className="mt-2 font-semibold text-gray-600">
            BIẾN TRAFFIC THÀNH LỢI NHUẬN
          </p>
          <p className="mt-2 text-gray-500">
            Kiếm tiền từ traffic của website bằng cách phân phối sản phẩm của
            các nhà cung cấp.
          </p>
          <motion.button
            onClick={() => route.push('/login')}
            className="mt-10 rounded-lg bg-orange px-6 py-4 text-black shadow-md transition duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            ĐĂNG NHẬP NGAY
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterChoice;
