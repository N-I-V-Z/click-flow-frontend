import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Sendo.vn',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeERbH1RnP4ywu49tpMfK7AXyrktCvZbG7Zw&s'
  },
  {
    name: 'NguyenKim',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaLwuwEqRRxi64apf7lhwXKkIBdAUiGlZNug&s'
  },
  {
    name: 'Atadi.vn',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7v6mIqjediuT1WiVw-gFIlNRsEJaHp8wmQ&s'
  },
  {
    name: 'Topica Edumall',
    src: 'https://static.ybox.vn/2018/7/1/1531711616488-Thi%E1%BA%BFt%20k%E1%BA%BF%20kh%C3%B4ng%20t%C3%AAn%20(9).png'
  },
  {
    name: 'FPT Shop',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyq19Le_afh7wCEdKcniMZHMPbcTQsEviMHA&s'
  },
  {
    name: 'Shoppee',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ana0g1Cq4lEK6kjWFYJFaBtCEQJ51iCmUg&s'
  },
  {
    name: 'Lazada',
    src: 'https://image.sggp.org.vn/w1000/Uploaded/2025/yfsgf/2019_06_20/3_BIXQ.png.webp'
  }
];

const Partner = () => {
  return (
    <div className="to-blue-800 relative bg-gradient-to-r from-purple-800 via-indigo-800 py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="mb-12 bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-center text-6xl font-extrabold text-transparent"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Đối tác của chúng tôi
        </motion.h2>
        <motion.p
          className="mb-16 text-center text-xl text-white opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Các thương hiệu lớn đã hợp tác với chúng tôi
        </motion.p>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="hover:shadow-neon relative flex flex-col items-center justify-center rounded-2xl bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-lg transition-all duration-300 ease-in-out"
              whileHover={{
                scale: 1.15,
                rotate: 3,
                boxShadow: '0px 25px 50px rgba(0, 255, 255, 0.5)',
                transition: { duration: 0.4 }
              }}
            >
              {/* Logo Image */}
              <motion.img
                src={partner.src}
                alt={partner.name}
                className="h-24 w-auto object-contain transition-transform duration-300"
                whileHover={{
                  scale: 1.3,
                  rotate: 6,
                  transition: { duration: 0.3 }
                }}
              />
              {/* Partner Name */}
              <p className="text-glow mt-4 text-xl font-semibold text-white">
                {partner.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partner;
