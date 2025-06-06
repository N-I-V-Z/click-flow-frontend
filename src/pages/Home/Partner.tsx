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
    name: 'Atadi.vn',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7v6mIqjediuT1WiVw-gFIlNRsEJaHp8wmQ&s'
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-950 to-cyan-900/20"></div>
        <motion.div
          className="absolute left-20 top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-8 py-24">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <motion.h1
            className="mb-8 bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-7xl font-black leading-tight text-transparent md:text-8xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Đối tác
            <span className=" ml-8 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              tin cậy
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Chúng tôi tự hào hợp tác cùng những thương hiệu hàng đầu để mang đến
            trải nghiệm tuyệt vời nhất cho khách hàng
          </motion.p>
        </div>

        {/* Partners Grid */}
        <motion.div
          className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8 + index * 0.1,
                ease: 'easeOut'
              }}
            >
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 group-hover:border-violet-500/30 group-hover:bg-white/10 group-hover:shadow-2xl group-hover:shadow-violet-500/10">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 to-cyan-500/0 transition-all duration-500 group-hover:from-violet-500/5 group-hover:to-cyan-500/5"></div>

                {/* Logo Container */}
                <motion.div
                  className="relative z-10 mb-6 flex h-20 items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain brightness-90 filter transition-all duration-300 group-hover:brightness-110"
                  />
                </motion.div>

                {/* Partner Name */}
                <div className="relative z-10 text-center">
                  <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-violet-200">
                    {partner.name}
                  </h3>
                </div>

                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent"
                  style={{
                    background:
                      'linear-gradient(45deg, transparent, transparent) padding-box, linear-gradient(45deg, #8b5cf6, #06b6d4) border-box',
                    opacity: 0
                  }}
                  whileHover={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-24 grid grid-cols-2 gap-8 text-center md:grid-cols-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-white">7+</div>
            <div className="text-sm text-slate-400">Đối Tác</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-white">100K+</div>
            <div className="text-sm text-slate-400">Khách Hàng</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-white">99%</div>
            <div className="text-sm text-slate-400">Hài Lòng</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-white">24/7</div>
            <div className="text-sm text-slate-400">Hỗ Trợ</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Partner;
