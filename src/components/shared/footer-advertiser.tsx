import { Icons } from '@/components/ui/icons';
import { Link } from 'react-router-dom';

const FooterAd: React.FC = () => {
  return (
    <footer className="mt-8 w-full bg-gray-600 py-10 text-white">
      <div className="container mx-auto flex flex-col items-center space-y-8 px-8 md:flex-row md:justify-between md:space-y-0">
        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-yellow-400">Liên hệ</h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center justify-center md:justify-start">
              <Icons.mapPin className="mr-3 size-6 text-yellow-400" />
              <span>1234 Thủ Đức, TP. HCM</span>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Icons.phone className="mr-3 size-6 text-yellow-400" />
              <span>0123 456 789</span>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Icons.mail className="mr-3 size-6 text-yellow-400" />
              <span>example@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col items-center space-y-3 md:items-start">
          <h3 className="text-lg font-semibold text-yellow-400">Menu</h3>
          <Link
            to="/"
            className="transition-all hover:text-yellow-400 hover:underline"
          >
            Trang chủ
          </Link>
          <Link
            to="/"
            className="transition-all hover:text-yellow-400 hover:underline"
          >
            Chính sách bảo mật
          </Link>
          <Link
            to="/terms"
            className="transition-all hover:text-yellow-400 hover:underline"
          >
            Điều khoản sử dụng
          </Link>
        </nav>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Click Flow. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterAd;
