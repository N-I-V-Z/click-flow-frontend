import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icons';
import { useRouter } from '@/routes/hooks';

// Import react-toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HeaderAd() {
  const route = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Giả sử gọi API đăng xuất hoặc xóa token...
    // Thông báo thành công
    toast.success('Đăng xuất thành công!', {
      position: 'top-right',
      autoClose: 3000
    });

    setIsLogoutOpen(false);
    // Ví dụ: route.push('/login');
  };

  // Nếu muốn mô phỏng thất bại, bạn có thể dùng toast.error(...)
  // const handleLogoutFail = () => {
  //   toast.error('Đăng xuất thất bại!', {
  //     position: 'top-right',
  //     autoClose: 3000
  //   });
  // };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#8329af] px-6 shadow-md">
        {/* Logo */}
        <div>
          <Link to="/advertiser" className="flex items-center gap-2">
            <img
              src="src/assets/logo.jpg"
              alt="Logo"
              className="h-[80px] w-[120px] rounded-lg"
            />
          </Link>
        </div>

        {/* Icon user nằm bên phải */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-300 p-2 font-bold">
              <Icons.user className="text-black" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <NavLink to="/advertiser/advertiser-profile">
                <DropdownMenuItem
                  onClick={() => route.push('/advertiser-profile')}
                >
                  Hồ sơ
                </DropdownMenuItem>
              </NavLink>
              {/* Nhấn "Đăng xuất" sẽ hiển thị modal confirm */}
              <DropdownMenuItem onClick={() => setIsLogoutOpen(true)}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              {/* 
                  Nếu muốn mô phỏng thất bại, bạn có thể gọi handleLogoutFail() ở đây 
                  thay vì handleLogout()
                */}
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
