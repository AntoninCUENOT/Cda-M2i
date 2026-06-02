/**
 * Charte graphique - Palette de couleurs AnimeTracker
 * Basée sur la charte graphique définie
 */

export const Colors = {
  // Primaires
  primary: {
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    400: '#A78BFA',
    300: '#C4B5FD',
    100: 'rgba(139, 92, 246, 0.1)',
    50: 'rgba(139, 92, 246, 0.05)',
  },

  // Secondaires
  secondary: {
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
  },

  // Sémantiques
  success: {
    500: '#10B981',
    600: '#059669',
    100: 'rgba(16, 185, 129, 0.1)',
  },

  warning: {
    500: '#F59E0B',
    600: '#D97706',
    100: 'rgba(245, 158, 11, 0.1)',
  },

  error: {
    500: '#EF4444',
    600: '#DC2626',
    100: 'rgba(239, 68, 68, 0.1)',
  },

  info: {
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Neutres (Light Mode)
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceDark: '#F3F4F6',
  border: '#E5E7EB',

  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },

  // Dégradés
  gradient: {
    hero: ['#8B5CF6', '#06B6D4'],
    card: ['rgba(139,92,246,0.1)', 'rgba(6,182,212,0.1)'],
  },
};

export default Colors;
