import { redis } from '../config/redis';
import { env } from '../config/env';

const CACHE_TTL_SEARCH = 60 * 60;       // 1 heure
const CACHE_TTL_ANIME = 60 * 60 * 24;  // 24 heures

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  synopsis: string | null;
  images: { jpg: { large_image_url: string | null } };
  trailer: { url: string | null };
  episodes: number | null;
  score: number | null;
  year: number | null;
  status: string | null;
  aired: { from: string | null; to: string | null };
  studios: Array<{ name: string }>;
}

async function cachedFetch<T>(cacheKey: string, url: string, ttl: number): Promise<T> {
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached) as T;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.status.toString()}`);
  }

  const json = await response.json() as T;
  await redis.set(cacheKey, JSON.stringify(json), 'EX', ttl);
  return json;
}

export async function searchAnimes(query: string, page = 1): Promise<JikanAnime[]> {
  const cacheKey = `jikan:search:${query}:${page.toString()}`;
  const url = `${env.jikanApiUrl}/anime?q=${encodeURIComponent(query)}&page=${page.toString()}&limit=20`;

  const data = await cachedFetch<{ data: JikanAnime[] }>(cacheKey, url, CACHE_TTL_SEARCH);
  return data.data;
}

export async function getTopAnimes(page = 1): Promise<JikanAnime[]> {
  const cacheKey = `jikan:top:${page.toString()}`;
  const url = `${env.jikanApiUrl}/top/anime?page=${page.toString()}&limit=20`;

  const data = await cachedFetch<{ data: JikanAnime[] }>(cacheKey, url, CACHE_TTL_SEARCH);
  return data.data;
}

export async function getAnimeById(id: number): Promise<JikanAnime> {
  const cacheKey = `jikan:anime:${id.toString()}`;
  const url = `${env.jikanApiUrl}/anime/${id.toString()}`;

  const data = await cachedFetch<{ data: JikanAnime }>(cacheKey, url, CACHE_TTL_ANIME);
  return data.data;
}
