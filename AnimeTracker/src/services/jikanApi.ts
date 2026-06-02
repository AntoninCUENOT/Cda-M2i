import axios from 'axios';
import { Anime, JikanResponse } from '../types';
import { JIKAN_API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: JIKAN_API_BASE_URL,
  timeout: 10000,
});

// Rate limiting simple
let lastRequestTime = 0;
const MIN_INTERVAL = 350;

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
};

export interface SearchFilters {
  genres?: number[];
  type?: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
  status?: 'airing' | 'complete' | 'upcoming';
  rating?: 'g' | 'pg' | 'pg13' | 'r17' | 'r';
  minScore?: number;
  orderBy?: 'score' | 'title' | 'start_date' | 'popularity' | 'rank';
  sort?: 'asc' | 'desc';
}

export const jikanApi = {
  async searchAnime(query: string, page = 1, filters?: SearchFilters): Promise<JikanResponse<Anime[]>> {
    await waitForRateLimit();
    const params: Record<string, unknown> = { page, limit: 25, sfw: true };
    if (query.trim()) params.q = query;
    if (filters?.genres?.length) params.genres = filters.genres.join(',');
    if (filters?.type) params.type = filters.type;
    if (filters?.status) params.status = filters.status;
    if (filters?.rating) params.rating = filters.rating;
    if (filters?.minScore) params.min_score = filters.minScore;
    if (filters?.orderBy) params.order_by = filters.orderBy;
    if (filters?.sort) params.sort = filters.sort;

    const response = await api.get<JikanResponse<Anime[]>>('/anime', { params });
    return response.data;
  },

  async getGenres(): Promise<{ mal_id: number; name: string }[]> {
    await waitForRateLimit();
    const response = await api.get<JikanResponse<{ mal_id: number; name: string }[]>>('/genres/anime');
    return response.data.data;
  },

  async getAnimeById(id: number): Promise<Anime> {
    await waitForRateLimit();
    const response = await api.get<JikanResponse<Anime>>(`/anime/${id}/full`);
    return response.data.data;
  },

  async getCurrentSeasonAnime(page = 1): Promise<JikanResponse<Anime[]>> {
    await waitForRateLimit();
    const response = await api.get<JikanResponse<Anime[]>>('/seasons/now', {
      params: { page, sfw: true },
    });
    return response.data;
  },

  async getTopAnime(page = 1): Promise<JikanResponse<Anime[]>> {
    await waitForRateLimit();
    const response = await api.get<JikanResponse<Anime[]>>('/top/anime', {
      params: { page, sfw: true },
    });
    return response.data;
  },

  async getAnimeRecommendations(animeId: number): Promise<{ entry: Anime }[]> {
    await waitForRateLimit();
    const response = await api.get<JikanResponse<{ entry: Anime }[]>>(`/anime/${animeId}/recommendations`);
    return response.data.data;
  },
};

export default jikanApi;
