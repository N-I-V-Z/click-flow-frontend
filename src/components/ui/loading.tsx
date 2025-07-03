import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-purple-900">
      <div className="relative flex items-center justify-center">
        {/* Vòng tròn quay */}
        <motion.div
          className="absolute h-32 w-32 rounded-full border-4 border-white border-t-transparent opacity-30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />

        {/* Logo chữ */}
        <motion.h1
          className="text-4xl font-extrabold tracking-wider text-white md:text-5xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          Click<span className="text-[#F6B93B]">Flow</span>
        </motion.h1>
      </div>
    </div>
  );
}
