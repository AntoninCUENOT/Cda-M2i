import React, { createContext, useContext, useMemo } from 'react';
import { useAppSelector } from '../store';

export const LightColors = {
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  secondary: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  success: { light: '#D1FAE5', main: '#10B981', dark: '#059669' },
  warning: { light: '#FEF3C7', main: '#F59E0B', dark: '#D97706' },
  error: { light: '#FEE2E2', main: '#EF4444', dark: '#DC2626' },
  gray: {
    50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB',
    400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151',
    800: '#1F2937', 900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: { primary: '#FFFFFF', secondary: '#F9FAFB', tertiary: '#F3F4F6' },
  text: { primary: '#111827', secondary: '#6B7280', tertiary: '#9CA3AF', inverse: '#FFFFFF' },
  border: { light: '#E5E7EB', medium: '#D1D5DB', dark: '#9CA3AF' },
  animeStatus: { aVoir: '#3B82F6', enCours: '#F59E0B', termine: '#10B981', abandonne: '#EF4444' },
  rating: { star: '#F59E0B', starEmpty: '#D1D5DB' },
  card: '#FFFFFF',
  statusBar: 'dark-content' as const,
};

export const DarkColors = {
  primary: {
    50: '#1E1B4B',
    100: '#2E2A5E',
    200: '#3E3A6E',
    300: '#6D5DCF',
    400: '#8B7CF6',
    500: '#A78BFA',
    600: '#B89FFC',
    700: '#C9B3FD',
    800: '#DAC7FE',
    900: '#EBDBFF',
  },
  secondary: {
    50: '#0C4A5E',
    100: '#155E75',
    200: '#0E7490',
    300: '#0891B2',
    400: '#06B6D4',
    500: '#22D3EE',
    600: '#67E8F9',
    700: '#A5F3FC',
    800: '#CFFAFE',
    900: '#ECFEFF',
  },
  success: { light: '#064E3B', main: '#10B981', dark: '#34D399' },
  warning: { light: '#78350F', main: '#F59E0B', dark: '#FBBF24' },
  error: { light: '#7F1D1D', main: '#EF4444', dark: '#F87171' },
  gray: {
    50: '#111827', 100: '#1F2937', 200: '#374151', 300: '#4B5563',
    400: '#6B7280', 500: '#9CA3AF', 600: '#D1D5DB', 700: '#E5E7EB',
    800: '#F3F4F6', 900: '#F9FAFB',
  },
  white: '#111827',
  black: '#FFFFFF',
  transparent: 'transparent',
  background: { primary: '#0F0F23', secondary: '#1A1A2E', tertiary: '#25253A' },
  text: { primary: '#F9FAFB', secondary: '#D1D5DB', tertiary: '#9CA3AF', inverse: '#111827' },
  border: { light: '#374151', medium: '#4B5563', dark: '#6B7280' },
  animeStatus: { aVoir: '#60A5FA', enCours: '#FBBF24', termine: '#34D399', abandonne: '#F87171' },
  rating: { star: '#FBBF24', starEmpty: '#4B5563' },
  card: '#1A1A2E',
  statusBar: 'light-content' as const,
};

export type ThemeColors = typeof LightColors;

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: LightColors,
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDark = useAppSelector(state => state.settings.darkMode);

  const value = useMemo(() => ({
    colors: (isDark ? DarkColors : LightColors) as ThemeColors,
    isDark,
  }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
