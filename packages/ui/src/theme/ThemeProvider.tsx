// packages/ui/src/theme/ThemeProvider.tsx
// Applies the correct role palette + light/dark mode as CSS variables
// on the document root. Consumed once at the app shell level.

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Role, rolePalettes, darkOverrides } from './tokens';

interface ThemeContextValue {
  role: Role;
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  role: Role;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ role, children }) => {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    const stored = localStorage.getItem('medhaa-dark-mode');
    return stored === 'true';
  });

  useEffect(() => {
    const palette = { ...rolePalettes[role], ...(isDark ? darkOverrides[role] : {}) };
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--medhaa-${key}`, value as string);
    });
    root.setAttribute('data-role', role);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('medhaa-dark-mode', String(isDark));
  }, [role, isDark]);

  const value = useMemo(
    () => ({ role, isDark, toggleDark: () => setIsDark((prev) => !prev) }),
    [role, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
