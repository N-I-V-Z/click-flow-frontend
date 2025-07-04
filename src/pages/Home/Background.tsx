import { motion } from 'framer-motion';
import { Zap, Shield, CreditCard, TrendingUp } from 'lucide-react';
import RobotCanvas from '@/components/ui/RobotCanvas';

export default function Background() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Animated background elements (keep or remove) */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20" />

        {/* Floating orbs */}
        <motion.div
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className="absolute -right-40 -top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-pink-500/25 blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -80, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 
    bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] 
    opacity-40"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-2 pt-20">
        {/* Badge */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-purple-200 backdrop-blur-md">
            <Zap className="text-yellow mr-2 h-4 w-4" />
            Platform Affiliate Thế Hệ Mới
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-5xl font-black leading-tight text-transparent md:text-7xl">
            Nền tảng Affiliate
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Thông Minh
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">
            Kết nối Advertiser & Publisher với công nghệ AI tiên tiến.
            <span className="font-semibold text-purple-300">
              {' '}
              Quản lý chiến dịch, theo dõi hiệu quả, thanh toán minh bạch
            </span>{' '}
            và bảo vệ chống gian lận trong một nền tảng duy nhất.
          </p>
        </motion.div>

        {/* Model + Feature Cards side-by-side */}
        <motion.div
          className="mx-auto grid max-w-6xl gap-8 md:grid-cols-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Left: Robot model - now spans 3 columns */}
          <div className="flex items-center justify-center md:col-span-3">
            <div className="mb-20 max-h-[650px] w-full">
              <RobotCanvas />
            </div>
          </div>

          {/* Right: Feature cards stacked - now spans 2 columns */}
          <div className="grid gap-4 md:col-span-2">
            <div className="group relative rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:transform hover:border-purple-400/50">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Real-time Analytics
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Theo dõi clicks, conversions và doanh thu theo thời gian thực
                  với dashboard trực quan và báo cáo chi tiết.
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:transform hover:border-cyan-400/50">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  AI Fraud Protection
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Phát hiện và ngăn chặn click ảo, fake traffic với thuật toán
                  AI thông minh, bảo vệ ngân sách quảng cáo.
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:transform hover:border-pink-400/50">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  Smart Payment
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Thanh toán tự động qua PayOS, quản lý commission minh bạch với
                  lịch sử giao dịch chi tiết.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
