import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UpgradePackage from '@/pages/Publisher/UpgradePackage';
import { logoURL } from '@/constants/data';

export default function HeaderAd() {
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#8329af] px-6 py-2 shadow-md">
        {/* Logo */}
        <div>
          <Link to="/advertiser" className="flex items-center gap-2">
            <img
              src={logoURL}
              alt="Logo"
              className="ml-5 h-[50px] w-[150px] rounded-lg"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Upgrade Package Button */}
          <UpgradePackage />
        </div>
      </nav>
    </>
  );
}
