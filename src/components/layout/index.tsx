import Sidebar from '../shared/sidebar';
import MobileSidebar from '../shared/mobile-sidebar';
import helper from '@/helpers/index';
import { login } from '@/redux/auth.slice';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useDispatch } from 'react-redux';

/**
 * `DashboardLayout` là một component React chịu trách nhiệm quản lý bố cục của trang dashboard.
 *
 * @param children - Các phần tử con sẽ được hiển thị trong phần chính của bố cục.
 *
 * @returns Trả về một phần tử JSX đại diện cho bố cục của dashboard.
 *
 * @description
 * - Quản lý trạng thái đóng/mở của sidebar thông qua `sidebarOpen` và `setSidebarOpen`.
 * - Sử dụng `useGetOrderUserByStatus` để lấy dữ liệu đơn hàng theo trạng thái.
 * - Lấy token từ cookie để xác thực người dùng.
 * - Sử dụng `useDispatch` để truy cập vào hàm dispatch của Redux.
 * - `useLayoutEffect` được sử dụng để dispatch hành động login nếu token tồn tại.
 * - `useEffect` được sử dụng để lấy dữ liệu đơn hàng và cập nhật giỏ hàng cũng như tổng số lượng sản phẩm.
 * - Bố cục bao gồm `MobileSidebar`, `Sidebar`, phần chính chứa `children`, và `Toaster` để hiển thị thông báo.
 */
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Quản lý đóng / mở sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Lấy cookie theo tên cookie
  // document.cookie: Đây là một chuỗi chứa tất cả các cookie cho trang hiện tại.
  // Thêm '; ' vào đầu chuỗi để đảm bảo việc tách các cookie dễ dàng hơn.
  const token = helper.cookie_get('AT');

  // useDispathch() hàm truy cập vào hàm dispatch của Redux.
  // useLayoutEffect là một hook trong React hoạt động tương tự như useEffect, nhưng nó chạy đồng bộ ngay trước khi trình duyệt vẽ lại màn hình. Điều này có nghĩa là bất kỳ thay đổi nào trong DOM xảy ra trong useLayoutEffect sẽ được thực hiện trước khi người dùng thấy nội dung trên màn hình.
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (token) {
      dispatch(login());
    }
  }, [dispatch, token]);

  useEffect(() => {}, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-secondary ">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <main className="overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  );
}
