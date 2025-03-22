import React from 'react';
import { motion } from 'framer-motion'; // Cài đặt framer-motion nếu chưa có: npm install framer-motion
import Footer from '@/components/shared/footer-home';

const PrivacyPolicy: React.FC = () => {
  const lastUpdatedDate = new Date().toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section với background ảnh và overlay */}
      <header className="relative h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/random/1920x1080/?abstract,tech')"
          }}
        />
        <div className="absolute inset-0 bg-purple-800 opacity-60"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1
            className="text-5xl font-extrabold text-white drop-shadow-lg md:text-7xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Chính Sách Bảo Mật
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-gray-300 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Cập nhật lần cuối: {lastUpdatedDate}
          </motion.p>
        </div>
      </header>

      {/* Main Content với phong cách timeline */}
      <main className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {/* Section 1: Giới thiệu */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">1</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Giới thiệu
            </h2>
            <p className="leading-relaxed text-gray-700">
              Chào mừng bạn đến với Click Flow – mạng lưới affiliate marketing
              hàng đầu giúp kết nối các nhà quảng cáo và publisher. Chính sách
              Bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ
              thông tin cá nhân của bạn.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và
              sử dụng thông tin theo chính sách này.
            </p>
          </motion.section>

          {/* Section 2: Thông tin chúng tôi thu thập */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">2</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Thông tin chúng tôi thu thập
            </h2>
            <p className="leading-relaxed text-gray-700">
              Để cung cấp dịch vụ tốt nhất, Click Flow thu thập các loại thông
              tin sau:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
              <li>
                <strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại
                và địa chỉ.
              </li>
              <li>
                <strong>Thông tin tài khoản affiliate:</strong> Lịch sử giao
                dịch, mã giới thiệu, số liệu chiến dịch quảng cáo và hiệu suất.
              </li>
              <li>
                <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại thiết bị,
                trình duyệt, cookie và dữ liệu theo dõi.
              </li>
              <li>
                <strong>Dữ liệu tương tác:</strong> Hành vi duyệt web, thời gian
                truy cập, các liên kết nhấp vào và dữ liệu phân tích khác.
              </li>
            </ul>
          </motion.section>

          {/* Section 3: Cách chúng tôi sử dụng thông tin */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">3</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Cách chúng tôi sử dụng thông tin
            </h2>
            <p className="leading-relaxed text-gray-700">
              Thông tin thu thập được sẽ được sử dụng nhằm:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
              <li>
                Cung cấp và cải thiện dịch vụ affiliate marketing, giúp các
                chiến dịch quảng cáo hiệu quả hơn.
              </li>
              <li>
                Phân tích dữ liệu người dùng để cá nhân hóa trải nghiệm và tối
                ưu hóa hiệu suất chiến dịch.
              </li>
              <li>
                Gửi các thông báo, thông tin khuyến mãi, cập nhật dịch vụ (chỉ
                khi bạn đã đăng ký nhận thông tin).
              </li>
              <li>
                Bảo đảm an toàn thông tin và thực hiện các biện pháp phòng chống
                gian lận.
              </li>
            </ul>
          </motion.section>

          {/* Section 4: Cookie và Công nghệ Theo dõi */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">4</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Cookie và Công nghệ Theo dõi
            </h2>
            <p className="leading-relaxed text-gray-700">
              Click Flow sử dụng cookies và các công nghệ theo dõi khác để:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
              <li>
                Ghi nhận các lượt nhấp và chuyển đổi từ các chiến dịch
                affiliate.
              </li>
              <li>
                Phân tích hành vi duyệt web để cải thiện trải nghiệm người dùng.
              </li>
              <li>
                Tùy chỉnh nội dung và quảng cáo dựa trên sở thích của người
                dùng.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-700">
              Bạn có thể điều chỉnh cài đặt cookie của mình thông qua trình
              duyệt, tuy nhiên điều này có thể ảnh hưởng đến hiệu suất và trải
              nghiệm sử dụng dịch vụ.
            </p>
          </motion.section>

          {/* Section 5: Chia sẻ thông tin */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">5</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Chia sẻ thông tin
            </h2>
            <p className="leading-relaxed text-gray-700">
              Chúng tôi cam kết không bán hoặc cho thuê thông tin cá nhân của
              bạn cho bên thứ ba. Tuy nhiên, trong một số trường hợp, thông tin
              có thể được chia sẻ:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
              <li>
                Với các đối tác chiến lược và nhà cung cấp dịch vụ nhằm hỗ trợ
                việc vận hành và tối ưu hóa các chiến dịch affiliate.
              </li>
              <li>
                Khi có yêu cầu từ cơ quan chức năng hoặc theo quy định của pháp
                luật.
              </li>
              <li>
                Để phân tích và nghiên cứu nhằm cải thiện chất lượng dịch vụ.
              </li>
            </ul>
          </motion.section>

          {/* Section 6: Bảo mật thông tin */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">6</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Bảo mật thông tin
            </h2>
            <p className="leading-relaxed text-gray-700">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức nhằm
              bảo vệ dữ liệu của bạn khỏi truy cập, sử dụng hay tiết lộ trái
              phép. Điều này bao gồm việc mã hóa dữ liệu, sử dụng tường lửa và
              các quy trình kiểm soát truy cập.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              Mặc dù chúng tôi nỗ lực bảo mật thông tin, không có phương thức
              truyền tải qua Internet hay phương pháp lưu trữ nào là hoàn toàn
              an toàn.
            </p>
          </motion.section>

          {/* Section 7: Thay đổi chính sách và Quyền của người dùng */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">7</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Thay đổi chính sách và Quyền của người dùng
            </h2>
            <p className="leading-relaxed text-gray-700">
              Chính sách này có thể được cập nhật định kỳ. Chúng tôi khuyến nghị
              bạn thường xuyên kiểm tra để nắm bắt các thay đổi mới nhất.
            </p>
            <p className="mt-4 leading-relaxed text-gray-700">
              Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân
              của mình. Để thực hiện các quyền này, vui lòng liên hệ với chúng
              tôi qua thông tin liên hệ bên dưới.
            </p>
          </motion.section>

          {/* Section 8: Liên hệ */}
          <motion.section
            className="relative border-l-4 border-indigo-500 pl-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
              <span className="font-bold text-white">8</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Liên hệ</h2>
            <p className="leading-relaxed text-gray-700">
              Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật
              hoặc muốn biết thêm thông tin về cách thức xử lý dữ liệu của bạn,
              hãy liên hệ với chúng tôi qua:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700">
              <li>Email: support@clickflow.vn</li>
              <li>Điện thoại: 0123456789</li>
            </ul>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
