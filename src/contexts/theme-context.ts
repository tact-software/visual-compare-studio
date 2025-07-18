import { createContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);
