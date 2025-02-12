import React, { createContext, useContext, useState } from 'react';

// Context cho phép truyền dữ liệu xuyên suốt cây component mà không cần phải truyền props qua từng cấp component.
const SidebarContext = createContext<{
  isMinimized: boolean;
  toggle: () => void;
}>({
  isMinimized: false,
  toggle: () => {}
});

/**
 * Hook `useSidebar` sử dụng để truy cập vào `SidebarContext`.
 *
 * @description
 * Hàm này trả về giá trị hiện tại của `SidebarContext`, cho phép các thành phần con truy cập và sử dụng dữ liệu hoặc chức năng được cung cấp bởi `SidebarContext`.
 *
 * Đảm bảo rằng `SidebarContext` đã được cung cấp bởi một thành phần cha trước khi sử dụng hook này, nếu không sẽ gây ra lỗi.
 */
export const useSidebar = () => useContext(SidebarContext);

/**
 * SidebarProvider cung cấp ngữ cảnh cho sidebar, cho phép các thành phần con truy cập và thay đổi trạng thái thu nhỏ của sidebar.
 *
 * @param children - Các thành phần con sẽ được bao bọc bởi SidebarProvider.
 *
 * @description
 * Sử dụng `useState` để quản lý trạng thái `isMinimized`, xác định xem sidebar có đang ở trạng thái thu nhỏ hay không.
 * Hàm `toggle` được cung cấp để thay đổi trạng thái `isMinimized`.
 */
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggle = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <SidebarContext.Provider value={{ isMinimized, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};
