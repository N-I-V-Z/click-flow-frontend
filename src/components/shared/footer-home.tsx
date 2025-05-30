import {
  FacebookOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Decorative top border */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500" />

      <div className="container mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h2 className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                Click Flow
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                Nền tảng số 1 tại Việt Nam, mang đến trải nghiệm tuyệt vời nhất
                cho người dùng.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Link to="https://www.facebook.com/profile.php?id=61576613399333">
                <FacebookOutlined className="text-xl text-white transition-colors hover:text-purple-400" />{' '}
              </Link>
              <Link to="">
                <FacebookOutlined className="text-xl text-white transition-colors hover:text-purple-400" />{' '}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="border-b border-gray-700 pb-2 text-xl font-semibold text-purple-400">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 transition-transform hover:translate-x-2">
                <EnvironmentOutlined className="text-lg text-purple-400" />
                <span className="text-gray-300">
                  123 Đường Võ Văn Ngân, Phường Linh Chiểu
                  <br />
                  Thủ Đức, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center space-x-3 transition-transform hover:translate-x-2">
                <PhoneOutlined className="text-lg text-purple-400" />
                <span className="text-gray-300">0123 456 789</span>
              </li>
              <li className="flex items-center space-x-3 transition-transform hover:translate-x-2">
                <MailOutlined className="text-lg text-purple-400" />
                <span className="text-gray-300">
                  clickflow.connect@gmail.com
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="border-b border-gray-700 pb-2 text-xl font-semibold text-purple-400">
              Liên kết nhanh
            </h3>
            <nav className="space-y-3">
              <Link
                to="/"
                className="flex items-center text-gray-300 transition-all hover:translate-x-2 hover:text-purple-400"
              >
                <HomeOutlined className="mr-2" /> Trang chủ
              </Link>

              <Link
                to="/learn-more"
                className="flex items-center text-gray-300 transition-all hover:translate-x-2 hover:text-purple-400"
              >
                <InfoCircleOutlined className="mr-2" /> Về chúng tôi
              </Link>
              <Link
                to="/privacy"
                className="flex items-center text-gray-300 transition-all hover:translate-x-2 hover:text-purple-400"
              >
                <SettingOutlined className="mr-2" /> Chính sách bảo mật
              </Link>
            </nav>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-8">
          <div className="text-center">
            <h3 className="mb-2 text-xl font-semibold text-purple-400">
              Đăng ký nhận tin tức
            </h3>
            <p className="mb-6 text-gray-300">
              Nhận thông tin mới nhất về sản phẩm và dịch vụ của chúng tôi
            </p>
            <div className="mx-auto flex max-w-md space-x-3">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
              />
              <button className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className=" items-center justify-between space-y-4 text-center md:flex-row md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Click Flow. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
