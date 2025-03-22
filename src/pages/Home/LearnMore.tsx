import Footer from '@/components/shared/footer-home';
import React, { useState } from 'react';

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-medium text-gray-800">{question}</span>
        <svg
          className={`h-6 w-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <p className="mt-2 text-lg text-gray-600">{answer}</p>}
    </div>
  );
};

const LearnMorePage: React.FC = () => {
  const faqs = [
    {
      question: 'Affiliate Marketing là gì?',
      answer:
        'Affiliate Marketing là hình thức tiếp thị dựa trên hiệu quả, nơi các nhà phân phối (affiliates) quảng bá sản phẩm/dịch vụ của nhà cung cấp và nhận hoa hồng khi có giao dịch thành công.'
    },
    {
      question: 'Làm thế nào để trở thành Publisher?',
      answer:
        'Đăng ký tài khoản, chọn chiến dịch phù hợp và sử dụng website, blog hay kênh truyền thông xã hội để quảng bá. Quá trình này vô cùng đơn giản và nhanh chóng.'
    },
    {
      question: 'Những lợi ích khi tham gia là gì?',
      answer:
        'Bạn có thể tăng thu nhập không giới hạn, không cần đầu tư nhiều vốn ban đầu và nhận được sự hỗ trợ chuyên nghiệp từ đội ngũ chuyên gia của chúng tôi.'
    },
    {
      question: 'Advertiser có vai trò gì?',
      answer:
        'Advertiser là các thương hiệu, doanh nghiệp tạo ra chiến dịch quảng cáo nhằm mở rộng thị trường và tăng cường nhận diện thương hiệu. Họ sẽ cung cấp công cụ và tài liệu hỗ trợ để chiến dịch thành công.'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gray-700 py-12 text-white shadow-2xl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-extrabold">
            Khám Phá Thế Giới Affiliate Marketing
          </h1>
          <p className="text-2xl">
            Click Flow - Nền tảng hàng đầu giúp bạn tối đa hóa thu nhập và biến
            đam mê thành lợi nhuận
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto flex-1 px-4 py-16">
        {/* Giới thiệu & Lợi ích */}
        <section className="mb-16">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-4xl font-bold text-gray-800">
                Affiliate Marketing - Chìa khóa thành công của bạn
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Bạn không cần lo lắng về sản phẩm hay kho hàng. Với Affiliate
                Marketing, chỉ cần tận dụng kỹ năng tiếp thị và đam mê sáng tạo,
                bạn có thể kiếm tiền từ các chiến dịch quảng cáo của những
                thương hiệu hàng đầu. Hãy gia nhập Click Flow để khởi đầu hành
                trình biến ý tưởng thành lợi nhuận với rủi ro thấp và sự hỗ trợ
                toàn diện từ đội ngũ chuyên gia.
              </p>
              <button className="transform rounded-full bg-gradient-to-r from-amber-400 to-purple-500 px-12 py-4 font-bold text-black shadow-xl transition-transform duration-300 hover:scale-110">
                Tham gia ngay!
              </button>
            </div>
            <div>
              <img
                src="https://d28jzcg6y4v9j1.cloudfront.net/media/social/articles/2022/7/6/huong-dan-lam-affiliate-cho-nguoi-moi-bat-dau-01.png"
                alt="Affiliate Marketing"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Advertiser & Publisher */}
        <section className="mb-16 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-4xl font-bold text-gray-800">
            Advertiser & Publisher - Cơ hội đôi bên cùng có lợi
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <img
                  src="https://img.freepik.com/free-vector/social-media-ad-online-advertising-smm-network-announcement-media-content-followers-activity-geodata-internet-manager-cartoon-character-vector-isolated-concept-metaphor-illustration_335657-2845.jpg?semt=ais_hybrid"
                  alt="Advertiser"
                  className="h-24 w-24"
                />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-700">
                Advertiser
              </h3>
              <p className="text-gray-600">
                Các thương hiệu và doanh nghiệp tạo ra chiến dịch quảng cáo
                chuyên nghiệp. Click Flow cung cấp các công cụ tối ưu để chiến
                dịch của bạn đạt hiệu quả tối đa.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <img
                  src="https://png.pngtree.com/png-vector/20230912/ourmid/pngtree-affiliate-marketing-png-png-image_10018028.png"
                  alt="Publisher"
                  className="h-24 w-24"
                />
              </div>
              <h3 className="mb-2 text-2xl font-semibold text-gray-700">
                Publisher
              </h3>
              <p className="text-gray-600">
                Nếu bạn sở hữu website, blog hay kênh truyền thông xã hội, hãy
                biến nền tảng của mình thành công cụ kiếm tiền. Quảng bá và nhận
                hoa hồng cho mỗi giao dịch thành công.
              </p>
            </div>
          </div>
        </section>

        {/* Thành công qua số liệu */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
            Số liệu thành công của Click Flow
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <h3 className="text-5xl font-extrabold text-indigo-600">1+</h3>
              <p className="mt-2 text-xl text-gray-700">Publisher đăng ký</p>
            </div>
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <h3 className="text-5xl font-extrabold text-indigo-600">1+</h3>
              <p className="mt-2 text-xl text-gray-700">Chiến dịch hiệu quả</p>
            </div>
            <div className="rounded-lg bg-white p-8 text-center shadow-lg">
              <h3 className="text-5xl font-extrabold text-indigo-600">1+</h3>
              <p className="mt-2 text-xl text-gray-700">Advertiser tham gia</p>
            </div>
          </div>
        </section>

        {/* Tại sao nên tham gia */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
            Tại sao nên tham gia Click Flow?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="transform rounded-lg bg-white p-6 shadow-lg transition hover:scale-105">
              <h3 className="mb-3 text-2xl font-semibold text-indigo-600">
                Thu nhập không giới hạn
              </h3>
              <p className="text-gray-600">
                Với các chiến dịch đa dạng và mức hoa hồng hấp dẫn, bạn có thể
                tự do mở rộng thu nhập theo khả năng của mình.
              </p>
            </div>
            <div className="transform rounded-lg bg-white p-6 shadow-lg transition hover:scale-105">
              <h3 className="mb-3 text-2xl font-semibold text-indigo-600">
                Hỗ trợ chuyên nghiệp
              </h3>
              <p className="text-gray-600">
                Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn với các chiến lược
                tiếp thị hiệu quả và công cụ tối ưu hóa chiến dịch.
              </p>
            </div>
            <div className="transform rounded-lg bg-white p-6 shadow-lg transition hover:scale-105">
              <h3 className="mb-3 text-2xl font-semibold text-indigo-600">
                Đa dạng chiến dịch
              </h3>
              <p className="text-gray-600">
                Lựa chọn từ hàng trăm chiến dịch của các ngành hàng khác nhau,
                phù hợp với sở thích và đối tượng khách hàng mục tiêu của bạn.
              </p>
            </div>
          </div>
        </section>

        {/* Hướng dẫn bắt đầu */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
            Bắt đầu với chúng tôi
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="transform rounded-lg bg-white p-8 shadow-2xl transition hover:scale-105">
              <h3 className="mb-3 text-2xl font-semibold text-gray-700">
                1. Đăng ký tài khoản
              </h3>
              <p className="text-gray-600">
                Quy trình đăng ký nhanh chóng và đơn giản, chỉ mất vài phút để
                bạn có thể khởi đầu.
              </p>
            </div>
            <div className="transform rounded-lg bg-white p-8 shadow-2xl transition hover:scale-105">
              <h3 className="mb-3 text-2xl font-semibold text-gray-700">
                2. Chọn chiến dịch
              </h3>
              <p className="text-gray-600">
                Khám phá danh mục chiến dịch đa dạng và chọn lựa chiến dịch phù
                hợp với phong cách của bạn.
              </p>
            </div>
            <div className="transform rounded-lg bg-white p-8 shadow-2xl transition hover:scale-105">
              <h3 className="mb-3 text-2xl font-semibold text-gray-700">
                3. Bắt đầu quảng bá
              </h3>
              <p className="text-gray-600">
                Sử dụng các kênh truyền thông của bạn để quảng bá và nhanh chóng
                nhận hoa hồng cho mỗi giao dịch thành công.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
            Câu hỏi thường gặp
          </h2>
          <div className="mx-auto max-w-3xl">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LearnMorePage;
