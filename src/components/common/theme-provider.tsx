import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/app-store';
import {
  ThemeProviderContext,
  type Theme,
  type ThemeProviderContextType,
} from '../../contexts/theme-context';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings, setTheme: setStoreTheme } = useAppStore();
  const [theme, setTheme] = useState<Theme>(settings.theme);

  useEffect(() => {
    if (theme === 'system') {
      // System theme detection - will be used by MUI theme provider
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('System theme:', isDark ? 'dark' : 'light');
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme]);

  const value: ThemeProviderContextType = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
      setStoreTheme(theme);
    },
  };

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}
