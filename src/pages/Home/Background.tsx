import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Background() {
  return (
    <section className="relative isolate bg-black text-white">
      {/* Hero background layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-700/80 via-purple-900 to-black" />
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/50 via-transparent to-transparent" />
      <div className="absolute right-0 top-0 h-full bg-[url('/images/hero-pattern.svg')] bg-cover bg-right opacity-20" />

      {/* Background Image with opacity */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'https://i1.sndcdn.com/avatars-6CkzcHmzyH2x6Sd5-nhcPdg-t1080x1080.jpg'
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-40 text-center">
        <motion.h1
          className="text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-7xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Nền tảng Affiliate thông minh
          <br className="hidden sm:block" /> dành cho Advertiser & Publisher
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-lg text-purple-200 sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Quản lý chiến dịch, theo dõi hiệu quả, thanh toán minh bạch và bảo vệ
          chống gian lận—all-in-one.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Button className="transform rounded-full bg-white px-8 py-4 text-base font-semibold text-purple-700 shadow-2xl transition-all hover:scale-105 hover:bg-purple-100">
            Bắt đầu ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Feature preview */}
        <motion.div
          className="mt-24 grid grid-cols-1 gap-12 text-left sm:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9 }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-md transition-all hover:bg-white/10">
            <h3 className="mb-3 text-xl font-semibold text-white">
              Realtime Tracking
            </h3>
            <p className="text-sm text-purple-200">
              Theo dõi lượt click, conversion, doanh thu và hành vi người dùng
              theo thời gian thực.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-md transition-all hover:bg-white/10">
            <h3 className="mb-3 text-xl font-semibold text-white">
              Bảo vệ chống gian lận
            </h3>
            <p className="text-sm text-purple-200">
              Phát hiện click ảo, fake traffic và hành vi bất thường bằng thuật
              toán thông minh.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-md transition-all hover:bg-white/10">
            <h3 className="mb-3 text-xl font-semibold text-white">
              Thanh toán minh bạch
            </h3>
            <p className="text-sm text-purple-200">
              Tự động hoá thanh toán qua VNPAY, quản lý lịch sử và hoá đơn rõ
              ràng.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
