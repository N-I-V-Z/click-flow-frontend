import {
  FacebookOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  PhoneOutlined,
  MailOutlined,
  TikTokOutlined
} from '@ant-design/icons';
import FlowerAnimation from './flower-animation';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-2 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Decorative top border */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500" />

      <div className="lg:px-22 container mx-auto px-2 pt-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h2 className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                Click Flow
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                Nền tảng Affiliate Marketing tại Việt Nam, mang đến trải nghiệm
                tuyệt vời nhất cho người dùng.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Link
                to="https://www.facebook.com/profile.php?id=61576613399333"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookOutlined className="text-xl text-white transition-colors hover:text-purple-400" />
              </Link>
              <Link
                to="https://www.tiktok.com/@clickflow.affiliate?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TikTokOutlined className="text-xl text-white transition-colors hover:text-purple-400" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="border-b border-gray-700 pb-2 text-xl font-semibold text-purple-400">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              {/* <li className="flex items-start space-x-3 transition-transform hover:translate-x-2">
                <EnvironmentOutlined className="text-lg text-purple-400" />
                <span className="text-gray-300">
                  123 Đường Võ Văn Ngân, Phường Linh Chiểu
                  <br />
                  Thủ Đức, TP. Hồ Chí Minh
                </span>
              </li> */}
              <li className="flex items-center space-x-3 transition-transform hover:translate-x-2">
                <PhoneOutlined className="text-lg text-purple-400" />
                <span className="text-gray-300">+84 852 279 3879</span>
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
          <div className="ml-[-10] space-y-6 px-2">
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

          {/* Flower Animation Section - Bên phải cột liên kết nhanh */}
          <div className="flex content-end items-start justify-center">
            <FlowerAnimation />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="items-center justify-between space-y-4 text-center md:flex-row md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Click Flow. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
