/**
 * Constantes globales de l'application
 */

// API
export const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

// Spacing (système basé sur 4px)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Font Sizes
export const FontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 28,
};

// Font Weights
export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
};

// Anime Status
export const AnimeStatus = {
  TO_WATCH: 'A_VOIR',
  WATCHING: 'EN_COURS',
  COMPLETED: 'TERMINE',
  DROPPED: 'ABANDONNE',
} as const;

export const AnimeStatusLabels = {
  [AnimeStatus.TO_WATCH]: 'À voir',
  [AnimeStatus.WATCHING]: 'En cours',
  [AnimeStatus.COMPLETED]: 'Terminé',
  [AnimeStatus.DROPPED]: 'Abandonné',
};
