import { motion } from 'framer-motion';

const partners = [
  {
    name: 'CarePaws',
    src: 'https://carepaws.site/icon/Logo.svg',
    url: 'https://carepaws.site/'
  },
  {
    name: 'PerHue',
    src: 'https://dab1495bad907479e27a58dabd624c7c.cdn.bubble.io/cdn-cgi/image/w=48,h=48,f=auto,dpr=1.25,fit=contain/f1744563648784x113727199759603440/logo-icon-main.png',
    url: 'https://perhue.io.vn/'
  },
  {
    name: 'CodeGrow',
    src: 'https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/500267341_122099064008885619_6219018770397838645_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeEacWcg1fFLc9R5V-IDw5s07xY3hLGqPefvFjeEsao951fvP98HuyYUfNEb-QAG9GfnUCKL9TOpHuodoqSQCuqX&_nc_ohc=QBPp6ps4cCEQ7kNvwE0Zuro&_nc_oc=Adnmu7sZea0TwzhGqfuoZw4HB5jO3Ds-FD5KXIFWIfCMo2m48KaC1-WO-kcME9wzyYc&_nc_zt=24&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=xyzHX2zv2sxUT3P7Cr94YA&oh=00_AfRiSS4Oou0jQTHOn6naDxYhgMgnpFP5t5FMeQ6Ng9CcNw&oe=68740B75',
    url: 'https://codegrow.vercel.app/'
  },
  {
    name: 'Artline',
    src: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-1/502375120_122124079940838750_6658613640590130202_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeHPCPx14plMDO-xRAYsBdNmF8ib38TQhVoXyJvfxNCFWgqa6olkacQCB3R0F04Zks8JfzNIWn8bz4CtDG2odizD&_nc_ohc=TGirzxap7ugQ7kNvwHXiXK8&_nc_oc=AdmnW5pFdi4yyAbyDdqZeiRjMU63bQWM3CCPfStoC5Qwz0m1vEG0Yjt7MJ0jT0BD8qs&_nc_zt=24&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=bIC14BWbr-is1OkA6Tpp9g&oh=00_AfQYj3txQaR5EOl36v6dyd39HkTCe7xwd6FO4y6ww319Zw&oe=68742D0D',
    url: 'https://artline-creative.com/'
  },
  {
    name: 'E-Bridge',
    src: 'https://ebridge.vn/_next/image?url=%2Fimages%2Flogo.png&w=1920&q=75',
    url: 'https://ebridge.vn/'
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
          className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
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
              <div
                className="relative cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 group-hover:border-violet-500/30 group-hover:bg-white/10 group-hover:shadow-2xl group-hover:shadow-violet-500/10"
                onClick={() =>
                  window.open(partner.url, '_blank', 'noopener,noreferrer')
                }
                title={`Truy cập ${partner.name}`}
              >
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
            <div className="mb-2 text-3xl font-bold text-white">5+</div>
            <div className="text-sm text-slate-400">Đối Tác</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-3xl font-bold text-white">20+</div>
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
