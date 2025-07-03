import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import UpgradePackage from '@/pages/Publisher/UpgradePackage';
import { logoURLAd } from '@/constants/data';

export default function HeaderAd() {
  const [currentPlan, setCurrentPlan] = useState<string>('basic');

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#8329af] px-6 shadow-md">
        {/* Logo */}
        <div>
          <Link to="/advertiser" className="flex items-center gap-2">
            <img
              src={logoURLAd}
              alt="Logo"
              className="h-[80px] w-[120px] rounded-lg"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Upgrade Package Button */}
          <UpgradePackage
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
          />
        </div>
      </nav>
    </>
  );
}
