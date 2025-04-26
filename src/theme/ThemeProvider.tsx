'use client';
import { ConfigProvider, theme as antdTheme } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WebLocalStorage } from '~/services/storages';

// Định nghĩa các giá trị theme (light/dark)
export enum ETheme {
  Light = 'light',
  Dark = 'dark',
}

// Context cho ThemeProvider
interface ThemeContextProps {
  theme: ETheme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextProps>({
  theme: ETheme.Light,
  toggleTheme: () => {},
});

// Component Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ETheme>(() => {
    // Load theme từ localStorage nếu hợp lệ, nếu không lấy mặc định Light
    return (WebLocalStorage.getItem('theme') as ETheme) || ETheme.Light;
  });

  // Cập nhật theme khi thay đổi
  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // Gắn trực tiếp theme vào <body>
    WebLocalStorage.setItem('theme', theme); // Lưu lại theme
  }, [theme]);

  // Hàm chuyển đổi theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === ETheme.Dark ? ETheme.Light : ETheme.Dark));
  };

  // Cấu hình theme cho Ant Design
  const antdThemeConfig = {
    algorithm: theme === ETheme.Dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    hashed: false,
  };
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider theme={antdThemeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

// Hook để truy cập theme trong các component con
export const useTheme = () => useContext(ThemeContext);
