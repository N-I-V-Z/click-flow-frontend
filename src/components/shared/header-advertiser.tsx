import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoURL } from '@/constants/data';
export default function HeaderAd() {
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const handleLogout = (): void => {
    toast.success('Đăng xuất thành công!', {
      toastId: 'logout-success',
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: false
    });

    setIsLogoutOpen(false);
    // Ví dụ: route.push('/login');
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#8329af] px-6 py-2 shadow-md">
        {/* Logo */}
        <div>
          <Link to="/advertiser" className="flex items-center gap-2">
            <img
              src={logoURL}
              alt="Logo"
              className=" ml-5 h-[50px] w-[150px] rounded-lg"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation items for Advertiser can be added here */}
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
                className="bg-blue rounded px-4 py-2 text-white hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
