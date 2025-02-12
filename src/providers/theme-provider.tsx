import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider cung cấp ngữ cảnh cho chủ đề giao diện người dùng.
 *
 * @param children - Các phần tử con sẽ được bao bọc bởi ThemeProvider.
 * @param defaultTheme - Chủ đề mặc định, có thể là 'system', 'light', hoặc 'dark'.
 * @param storageKey - Khóa lưu trữ trong localStorage để lưu trữ chủ đề hiện tại.
 * @param props - Các thuộc tính bổ sung khác.
 *
 * @description
 * ThemeProvider sử dụng `useState` để quản lý trạng thái chủ đề và `useEffect` để cập nhật lớp CSS của tài liệu
 * dựa trên chủ đề hiện tại. Chủ đề có thể được thay đổi và lưu trữ trong localStorage.
 */
export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook để sử dụng theme trong ứng dụng.
 *
 * @description
 * Trả về context của ThemeProvider.
 * Nếu không được sử dụng trong ThemeProvider, sẽ ném ra lỗi.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
