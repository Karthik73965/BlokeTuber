import { CalloutThemeColor } from './types';

export interface ThemeColors {
  primary: string;
  secondary: string;
  border: string;
  glow: string;
  bgGlass: string;
  textDark: string;
}

export const THEMES: Record<CalloutThemeColor, ThemeColors> = {
  gold: {
    primary: '#F5C518',
    secondary: '#FDE68A',
    border: '#F59E0B',
    glow: 'rgba(245, 197, 24, 0.45)',
    bgGlass: 'rgba(9, 9, 11, 0.85)',
    textDark: '#09090B',
  },
  amber: {
    primary: '#F59E0B',
    secondary: '#FEF3C7',
    border: '#D97706',
    glow: 'rgba(245, 158, 11, 0.45)',
    bgGlass: 'rgba(9, 9, 11, 0.85)',
    textDark: '#09090B',
  },
  cyan: {
    primary: '#06B6D4',
    secondary: '#CFFAFE',
    border: '#0891B2',
    glow: 'rgba(6, 182, 212, 0.45)',
    bgGlass: 'rgba(9, 9, 11, 0.85)',
    textDark: '#09090B',
  },
  crimson: {
    primary: '#EF4444',
    secondary: '#FEE2E2',
    border: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.45)',
    bgGlass: 'rgba(24, 8, 8, 0.90)',
    textDark: '#09090B',
  },
  emerald: {
    primary: '#10B981',
    secondary: '#D1FAE5',
    border: '#059669',
    glow: 'rgba(16, 185, 129, 0.45)',
    bgGlass: 'rgba(9, 9, 11, 0.85)',
    textDark: '#09090B',
  },
  slate: {
    primary: '#E2E8F0',
    secondary: '#94A3B8',
    border: '#475569',
    glow: 'rgba(226, 232, 240, 0.35)',
    bgGlass: 'rgba(15, 23, 42, 0.88)',
    textDark: '#09090B',
  },
  white: {
    primary: '#FFFFFF',
    secondary: '#D4D4D8',
    border: '#71717A',
    glow: 'rgba(255, 255, 255, 0.40)',
    bgGlass: 'rgba(9, 9, 11, 0.85)',
    textDark: '#09090B',
  },
};

export function getTheme(themeColor?: CalloutThemeColor): ThemeColors {
  if (themeColor && THEMES[themeColor]) {
    return THEMES[themeColor];
  }
  return THEMES.gold;
}
