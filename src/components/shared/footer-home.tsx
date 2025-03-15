import { Icons } from '../ui/icons';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="mt-8 w-full bg-gray-600 py-10 text-white">
      <div className="container mx-auto flex flex-col items-center space-y-8 px-80 md:flex-row md:justify-between md:space-y-0">
        {/* Contact Info */}
        <div className="text-center md:text-left">
          <h3 className="text-yellow-400 text-lg font-semibold">Liên hệ</h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center justify-center md:justify-start">
              <Icons.mapPin className="text-yellow-400 mr-3 size-6" />
              <span>1234 Thủ Đức, TP. HCM</span>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Icons.phone className="text-yellow-400 mr-3 size-6" />
              <span>0123 456 789</span>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Icons.mail className="text-yellow-400 mr-3 size-6" />
              <span>example@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col items-center space-y-3 md:items-start">
          <h3 className="text-yellow-400 text-lg font-semibold">Menu</h3>
          <Link
            to="/"
            className="hover:text-yellow-400 transition-all hover:underline"
          >
            Trang chủ
          </Link>
          <Link
            to="/privacy"
            className="hover:text-yellow-400 transition-all hover:underline"
          >
            Chính sách bảo mật
          </Link>
        </nav>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © 2025 Công ty TNHH Một Mình Tao Click FLow. All rights reserved.
      </div>
    </footer>
  );
}
