import { AnimeStatusType } from '../utils/constants';

// Types Anime (API Jikan)
export interface AnimeImages {
  jpg: { image_url: string; small_image_url: string; large_image_url: string };
  webp: { image_url: string; small_image_url: string; large_image_url: string };
}

export interface Genre {
  mal_id: number;
  name: string;
}

export interface Studio {
  mal_id: number;
  name: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  synopsis: string | null;
  year: number | null;
  studios: Studio[];
  genres: Genre[];
  aired?: { string: string };
  source?: string;
  duration?: string;
  rating?: string;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
}

export interface JikanResponse<T> {
  data: T;
  pagination?: JikanPagination;
}

// Types User
export type UserRole = 'USER' | 'MODERATEUR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  pseudo: string;
  avatar: number | string | null;
  bio: string | null;
  role: UserRole;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAnime {
  id: string;
  animeId: number;
  animeTitle: string;
  animePoster: string;
  status: AnimeStatusType;
  currentEpisode: number;
  totalEpisodes: number | null;
  personalRating: number | null;
  personalNote: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  pseudo: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Types Messagerie
export interface Message {
  id: string;
  senderId: string;
  senderPseudo: string;
  senderAvatar: number | string | null;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantPseudo: string;
  participantAvatar: number | string | null;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

// Types Groupes de discussion
export interface DiscussionGroup {
  id: string;
  animeId: number;
  animeTitle: string;
  animePoster: string;
  memberCount: number;
  lastActivity: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderPseudo: string;
  senderAvatar: number | string | null;
  content: string;
  createdAt: string;
}

// Types Reviews
export interface Review {
  id: string;
  userId: string;
  userPseudo: string;
  userAvatar: number | string | null;
  animeId: number;
  animeTitle: string;
  animePoster: string;
  rating: number;
  content: string;
  isPublic: boolean;
  likesCount: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

// Types Followers
export interface Follow {
  id: string;
  followerId: string;
  followerPseudo: string;
  followerAvatar: number | string | null;
  followingId: string;
  followingPseudo: string;
  followingAvatar: number | string | null;
  createdAt: string;
}

// Types Admin
export interface AdminStats {
  totalUsers: number;
  totalReviews: number;
  totalGroups: number;
  totalGroupMessages: number;
  totalMessages: number;
  totalAnimes: number;
}

export interface AdminUser {
  id_user: string;
  email: string;
  pseudo: string;
  photo: string | null;
  role: UserRole;
  is_active: boolean;
  is_suspended: boolean;
  suspension_end_date: string | null;
  created_at: string;
}

export interface AdminReview {
  id_review: string;
  rating: number;
  comment: string | null;
  visibility: 'PUBLIC' | 'PRIVE';
  likes_count: number;
  created_at: string;
  author?: { id_user: string; pseudo: string; photo: string | null };
  anime?: { id_anime: number; title: string; image_url: string | null };
}

export interface AdminGroupMessage {
  id_group_message: string;
  content: string;
  created_at: string;
  author?: { id_user: string; pseudo: string; photo: string | null };
  group?: { id_group: string; name: string };
}

export interface PublicProfile {
  id: string;
  pseudo: string;
  avatar: number | string | null;
  bio: string | null;
  isPublic: boolean;
  createdAt: string;
  stats: {
    totalAnimes: number;
    completedAnimes: number;
    reviewsCount: number;
    followersCount: number;
    followingCount: number;
  };
}
