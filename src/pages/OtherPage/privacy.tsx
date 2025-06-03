import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import Footer from '@/components/shared/footer-home';
import BasePages from '@/components/shared/base-pages';

const sections = [
  {
    title: 'Giới thiệu',
    content: [
      'Chào mừng bạn đến với Click Flow – mạng lưới affiliate marketing hàng đầu giúp kết nối các nhà quảng cáo và publisher.',
      'Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.'
    ]
  },
  {
    title: 'Thông tin chúng tôi thu thập',
    content: [
      'Chúng tôi thu thập các loại thông tin như:',
      <ul key="list1" className="ml-6 list-disc space-y-1">
        <li>
          <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại, địa
          chỉ.
        </li>
        <li>
          <strong>Thông tin tài khoản:</strong> Giao dịch, mã giới thiệu, hiệu
          suất chiến dịch.
        </li>
        <li>
          <strong>Dữ liệu kỹ thuật:</strong> IP, thiết bị, cookie, trình duyệt.
        </li>
        <li>
          <strong>Dữ liệu tương tác:</strong> Hành vi duyệt web, thời gian,
          click.
        </li>
      </ul>
    ]
  },
  {
    title: 'Cách chúng tôi sử dụng thông tin',
    content: [
      'Dữ liệu thu thập được dùng để:',
      <ul key="list2" className="ml-6 list-disc space-y-1">
        <li>Cải thiện dịch vụ và hiệu quả chiến dịch.</li>
        <li>Phân tích hành vi người dùng.</li>
        <li>Gửi thông báo, ưu đãi (nếu đăng ký nhận).</li>
        <li>Ngăn chặn gian lận và bảo mật thông tin.</li>
      </ul>
    ]
  },
  {
    title: 'Chia sẻ thông tin',
    content: [
      'Chúng tôi không bán thông tin cá nhân, nhưng có thể chia sẻ:',
      <ul key="list4" className="ml-6 list-disc space-y-1">
        <li>Với đối tác giúp vận hành dịch vụ.</li>
        <li>Khi có yêu cầu từ pháp luật.</li>
        <li>Cho mục đích phân tích, nghiên cứu.</li>
      </ul>
    ]
  },
  {
    title: 'Liên hệ',
    content: [
      'Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ:',
      <ul key="list6" className="ml-6 list-inside list-disc space-y-2">
        <li>
          <Mail className="mr-2 inline h-5 w-5 text-purple-600" />{' '}
          support@clickflow.vn
        </li>
        <li>
          <Phone className="mr-2 inline h-5 w-5 text-purple-600" /> 0123456789
        </li>
      </ul>
    ]
  }
];

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.4 } }
};

const PrivacyPolicy: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = sections.length;

  return (
    <BasePages pageHead="ClickFlow - Chính sách bảo mật">
      <div className="flex min-h-screen flex-col justify-between bg-gray-50">
        {/* Header */}
        <header className="relative flex h-60 items-center justify-center bg-gradient-to-tr from-purple-700 to-purple-500 text-center text-white">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Chính Sách Bảo Mật</h1>
            <p className="text-lg">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </header>

        {/* Step Container */}
        <main className="flex flex-grow items-center justify-center px-4 py-10">
          <div className="relative w-full max-w-3xl rounded-xl bg-white p-8 shadow-xl">
            {/* Progress Bar */}
            <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 bg-purple-600 transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="mb-4 text-2xl font-semibold text-purple-700">
                  {sections[step].title}
                </h2>
                <div className="space-y-4 text-base text-gray-700">
                  {sections[step].content.map((text, i) => (
                    <div key={i}>{text}</div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                className="rounded-lg border border-purple-600 px-5 py-2 text-purple-700 transition hover:bg-purple-50 disabled:opacity-40"
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                disabled={step === 0}
              >
                Quay lại
              </button>
              {step < totalSteps - 1 ? (
                <button
                  className="rounded-lg bg-purple-600 px-5 py-2 text-white transition hover:bg-purple-700"
                  onClick={() =>
                    setStep((prev) => Math.min(prev + 1, totalSteps - 1))
                  }
                >
                  Tiếp theo
                </button>
              ) : (
                <button
                  className="rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
                  onClick={() => alert('Cảm ơn bạn đã xem Chính sách!')}
                >
                  Hoàn tất
                </button>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </BasePages>
  );
};

export default PrivacyPolicy;
