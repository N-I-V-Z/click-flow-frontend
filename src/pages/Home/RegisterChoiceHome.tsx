import { useRouter } from '@/routes/hooks';
import { motion } from 'framer-motion';
import { useState } from 'react';

const RegisterChoice: React.FC = () => {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardHover = (card: string) => {
    setActiveCard(card);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects matching the main theme */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-700/80 via-purple-900 to-black" />
      <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/50 via-transparent to-transparent" />
      <div className="absolute right-0 top-0 h-full bg-[url('/images/hero-pattern.svg')] bg-cover bg-right opacity-20" />

      <div className="container relative mx-auto max-w-6xl">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-2 font-sans text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              Chọn <span className="text-purple-300">vai trò</span> của bạn
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-purple-200">
              Bắt đầu hành trình với vai trò phù hợp nhất
            </p>
          </motion.div>

          {/* Cards Container */}
          <div className="relative mt-4 w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex flex-col gap-8 md:flex-row"
            >
              {/* Card 1 - Provider */}
              <motion.div
                className={`flex-1 overflow-hidden rounded-3xl ${
                  activeCard === 'provider'
                    ? 'border-2 border-purple-400'
                    : 'border border-purple-800'
                } bg-purple-900/40 shadow-xl backdrop-blur-sm transition-all duration-500`}
                onMouseEnter={() => handleCardHover('provider')}
                onMouseLeave={() => setActiveCard(null)}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-full">
                  {/* Card header with gradient */}
                  <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-sans text-2xl font-bold text-white">
                        Nhà cung cấp
                      </h2>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex h-full flex-col p-6">
                    <div className="mb-6 flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-800/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 text-purple-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          TĂNG DOANH SỐ BÁN HÀNG
                        </h3>
                        <p className="text-sm text-purple-200">
                          Mở rộng kênh bán hàng hiệu quả
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-800/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 text-purple-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.479m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          TIẾP CẬN ĐA DẠNG
                        </h3>
                        <p className="text-sm text-purple-200">
                          Mạng lưới nhà phân phối rộng khắp
                        </p>
                      </div>
                    </div>

                    <p className="mb-8 text-purple-100/90">
                      Tiếp cận người mua tiềm năng và mở rộng thị trường thông
                      qua mạng lưới nhà phân phối đa dạng trên nền tảng của
                      chúng tôi.
                    </p>

                    <div>
                      <motion.button
                        onClick={() => router.push('/register-advertiser')}
                        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 py-4 font-medium text-white shadow-lg transition-all hover:shadow-purple-500/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        LIÊN HỆ NGAY
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Distributor */}
              <motion.div
                className={`flex-1 overflow-hidden rounded-3xl ${
                  activeCard === 'distributor'
                    ? 'border-2 border-purple-400'
                    : 'border border-purple-800'
                } bg-purple-900/40 shadow-xl backdrop-blur-sm transition-all duration-500`}
                onMouseEnter={() => handleCardHover('distributor')}
                onMouseLeave={() => setActiveCard(null)}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-full">
                  {/* Card header with gradient */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-sans text-2xl font-bold text-white">
                        Nhà phân phối
                      </h2>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex h-full flex-col p-6">
                    <div className="mb-6 flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-800/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 text-purple-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          BIẾN TRAFFIC THÀNH LỢI NHUẬN
                        </h3>
                        <p className="text-sm text-purple-200">
                          Tối ưu giá trị từ lưu lượng website
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-800/50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-6 w-6 text-purple-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          HỆ THỐNG TÍNH PHÍ LINH HOẠT
                        </h3>
                        <p className="text-sm text-purple-200">
                          Hoa hồng hấp dẫn từ mỗi giao dịch
                        </p>
                      </div>
                    </div>

                    <p className="text-purple mb-8">
                      Kiếm tiền từ traffic website bằng cách phân phối sản phẩm
                      chất lượng cao và đa dạng từ các nhà cung cấp uy tín trên
                      nền tảng.
                    </p>

                    <div>
                      <motion.button
                        onClick={() => router.push('/login')}
                        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 py-4 font-medium text-white shadow-lg transition-all hover:shadow-indigo-500/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ĐĂNG NHẬP NGAY
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature highlights - matching style with Background component */}

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-16 text-center text-sm text-purple-300"
          >
            Bắt đầu hành trình kinh doanh thành công của bạn cùng chúng tôi
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
