import { NavLink } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const AdvertiserSidebar = () => {
  return (
    <div className="flex h-screen w-64 flex-col bg-white p-6 text-black shadow-lg">
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/advertiser/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg p-3 ${
              isActive ? 'bg-gray-400 text-black' : 'hover:bg-gray-300'
            }`
          }
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>
        <NavLink
          to="/advertiser/campaigns"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg p-3 ${
              isActive ? 'bg-gray-400 text-black' : 'hover:bg-gray-300 '
            }`
          }
        >
          <User size={20} />
          <span>Chiến dịch</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdvertiserSidebar;
