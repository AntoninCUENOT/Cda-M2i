export const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const FontSize = {
  xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 20, xxxl: 24, title: 28, largeTitle: 32,
};

export const BorderRadius = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, full: 9999,
};

export const Shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
};

export const AnimeStatus = {
  A_VOIR: 'A_VOIR', EN_COURS: 'EN_COURS', TERMINE: 'TERMINE', ABANDONNE: 'ABANDONNE',
} as const;

export type AnimeStatusType = keyof typeof AnimeStatus;

export const AnimeStatusLabels: Record<AnimeStatusType, string> = {
  A_VOIR: 'À voir', EN_COURS: 'En cours', TERMINE: 'Terminé', ABANDONNE: 'Abandonné',
};

export const StorageKeys = {
  AUTH_TOKEN: '@animetracker/auth_token',
  USER_DATA: '@animetracker/user_data',
  LIBRARY: '@animetracker/library',
  REVIEWS: '@animetracker/reviews',
  FOLLOWERS: '@animetracker/followers',
  FOLLOWING: '@animetracker/following',
};
