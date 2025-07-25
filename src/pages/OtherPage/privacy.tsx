import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Mail, Phone, Lock } from 'lucide-react';
import Footer from '@/components/shared/footer-home';
import BasePages from '@/components/shared/base-pages';

const sections = [
  {
    id: 'gioi-thieu',
    title: 'Giới thiệu',
    icon: <Lock className="h-6 w-6 text-white" />,
    content: [
      'Chào mừng bạn đến với Click Flow – mạng lưới affiliate marketing hàng đầu giúp kết nối các nhà quảng cáo và publisher.',
      'Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.'
    ]
  },
  {
    id: 'thong-tin-thu-thap',
    title: 'Thông tin chúng tôi thu thập',
    icon: <Lock className="h-6 w-6 text-white" />,
    content: [
      'Chúng tôi thu thập các loại thông tin như:',
      <ul key="list1" className="ml-6 list-disc space-y-1 text-gray-800">
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
    id: 'cach-su-dung',
    title: 'Cách chúng tôi sử dụng thông tin',
    icon: <Lock className="h-6 w-6 text-white" />,
    content: [
      'Dữ liệu thu thập được dùng để:',
      <ul key="list2" className="ml-6 list-disc space-y-1 text-gray-800">
        <li>Cải thiện dịch vụ và hiệu quả chiến dịch.</li>
        <li>Phân tích hành vi người dùng.</li>
        <li>Gửi thông báo, ưu đãi (nếu đăng ký nhận).</li>
        <li>Ngăn chặn gian lận và bảo mật thông tin.</li>
      </ul>
    ]
  },
  {
    id: 'chia-se-thong-tin',
    title: 'Chia sẻ thông tin',
    icon: <Lock className="h-6 w-6 text-white" />,
    content: [
      'Chúng tôi không bán thông tin cá nhân, nhưng có thể chia sẻ:',
      <ul key="list4" className="ml-6 list-disc space-y-1 text-gray-800">
        <li>Với đối tác giúp vận hành dịch vụ.</li>
        <li>Khi có yêu cầu từ pháp luật.</li>
        <li>Cho mục đích phân tích, nghiên cứu.</li>
      </ul>
    ]
  },
  {
    id: 'lien-he',
    title: 'Liên hệ',
    icon: <Lock className="h-6 w-6 text-white" />,
    content: [
      'Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ:',
      <ul
        key="list6"
        className="ml-6 list-inside list-disc space-y-2 text-gray-800"
      >
        <li className="flex items-center">
          <Mail className="mr-2 h-5 w-5 text-purple-600" />
          <span
            className="cursor-pointer hover:text-purple-800"
            onClick={() =>
              navigator.clipboard.writeText('clickflow.connect@gmail.com')
            }
          >
            clickflow.connect@gmail.com
          </span>
        </li>
        <li className="flex items-center">
          <Phone className="mr-2 h-5 w-5 text-purple-600" />
          <span
            className="cursor-pointer hover:text-purple-800"
            onClick={() => navigator.clipboard.writeText('0852793879')}
          >
            0852793879
          </span>
        </li>
      </ul>
    ]
  }
];

const timelineVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.2, duration: 0.5 }
  })
};

const PrivacyPolicy: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  return (
    <BasePages pageHead="ClickFlow - Chính sách bảo mật">
      <div className="flex min-h-screen flex-col bg-gray-100">
        {/* Header */}
        <header className="flex h-48 items-center justify-center bg-gradient-to-br from-[#2e035e] to-[#a00bb1] text-white shadow-md">
          <div className="text-center">
            <h1 className="flex items-center justify-center text-4xl font-extrabold tracking-tight">
              <Lock className="mr-2 h-7 w-7 animate-pulse text-yellow-300" />
              Chính Sách Bảo Mật
            </h1>
            <p className="mt-2 text-base">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </header>

        {/* Timeline Container */}
        <main className="relative flex flex-grow items-center justify-center px-4 py-8">
          <div className="relative w-full max-w-4xl">
            {/* Vertical line in center */}
            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 transform bg-purple-300" />

            <ul className="space-y-12">
              {sections.map((sec, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.li
                    key={sec.id}
                    custom={idx}
                    initial="hidden"
                    animate={controls}
                    variants={timelineVariants}
                    className="relative flex w-full"
                  >
                    {/* Dot on timeline */}
                    <div className="absolute left-1/2 -ml-2 mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 ring-8 ring-white" />

                    {/* Content box */}
                    <div
                      className={`
                        w-full max-w-md rounded-lg bg-white p-6 shadow-lg 
                        ${isLeft ? 'ml-auto mr-8 text-right' : 'ml-8 mr-auto text-left'}
                      `}
                    >
                      <div className="mb-2 flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                          {sec.icon}
                        </div>
                        <h2
                          className={`ml-3 text-xl font-semibold text-gray-900 ${
                            isLeft ? 'text-right' : 'text-left'
                          }`}
                        >
                          {sec.title}
                        </h2>
                      </div>
                      <div className="mt-2 space-y-3 text-gray-800">
                        {sec.content.map((node, i) => (
                          <div key={i}>{node}</div>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </BasePages>
  );
};

export default PrivacyPolicy;
