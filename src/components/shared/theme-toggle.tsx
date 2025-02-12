import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';

/**
 * Chức năng chuyển đổi chế độ giao diện.
 *
 * @description
 * Sử dụng `DropdownMenu` để hiển thị các tùy chọn chế độ giao diện: Sáng, Tối, và Hệ thống.
 * Khi người dùng chọn một tùy chọn, hàm `setTheme` sẽ được gọi để thay đổi chế độ giao diện tương ứng.
 *
 * - `DropdownMenuTrigger`: Kích hoạt menu thả xuống khi được nhấn.
 * - `Button`: Hiển thị biểu tượng mặt trời và mặt trăng để biểu thị chế độ sáng và tối.
 * - `DropdownMenuContent`: Chứa các mục menu để người dùng chọn chế độ.
 * - `DropdownMenuItem`: Mục menu cho từng chế độ giao diện.
 */
export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Sáng
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Tối
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          Hệ thống
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
