import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpgradePackage from '@/pages/Publisher/UpgradePackage';
import NotificationBell from '@/pages/Publisher/Notification';
import { logoURLAd } from '@/constants/data';
export default function HeaderAd() {
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>('basic');
  const handleLogout = (): void => {
    toast.success('Đăng xuất thành công!', {
      position: 'top-right',
      autoClose: 3000
    });

    setIsLogoutOpen(false);
    // Ví dụ: route.push('/login');
  };

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

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Upgrade Package Button */}
          <UpgradePackage
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
          />
        </div>
      </nav>

      {/* Modal xác nhận đăng xuất */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Xác nhận đăng xuất</h2>
            <p className="mb-6">Bạn có chắc chắn muốn đăng xuất?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsLogoutOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="hover:bg-red-600 rounded bg-blue px-4 py-2 text-white"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nơi hiển thị các toast */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
