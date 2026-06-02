import Anime from '../models/Anime';
import { searchAnimes, getTopAnimes, getAnimeById, JikanAnime } from './jikanService';
import { PaginatedResult } from '../types';
import { InferCreationAttributes } from 'sequelize';

function jikanToAnimeData(j: JikanAnime): InferCreationAttributes<Anime> {
  return {
    id_anime: j.mal_id,
    title: j.title,
    title_english: j.title_english,
    synopsis: j.synopsis,
    image_url: j.images.jpg.large_image_url,
    trailer_url: j.trailer.url,
    episodes: j.episodes,
    score: j.score,
    year: j.year,
    status: j.status,
    aired_from: j.aired.from ? new Date(j.aired.from) : null,
    aired_to: j.aired.to ? new Date(j.aired.to) : null,
    last_fetched_at: new Date(),
    id_studio: null,
  };
}

async function upsertFromJikan(jikanAnime: JikanAnime): Promise<Anime> {
  const [anime] = await Anime.upsert(jikanToAnimeData(jikanAnime));
  return anime;
}

export async function searchAndSync(
  query: string,
  page: number,
): Promise<PaginatedResult<Anime>> {
  const jikanResults = await searchAnimes(query, page);
  const synced = await Promise.all(jikanResults.map(upsertFromJikan));

  return {
    data: synced,
    total: synced.length,
    page,
    limit: 20,
    totalPages: Math.ceil(synced.length / 20),
  };
}

export async function getTopAndSync(page: number): Promise<Anime[]> {
  const jikanResults = await getTopAnimes(page);
  return Promise.all(jikanResults.map(upsertFromJikan));
}

export async function getOrFetchAnime(id: number): Promise<Anime> {
  const existing = await Anime.findByPk(id);

  if (existing) {
    const stale =
      !existing.last_fetched_at ||
      Date.now() - existing.last_fetched_at.getTime() > 24 * 60 * 60 * 1000;

    if (!stale) return existing;
  }

  const jikanAnime = await getAnimeById(id);
  return upsertFromJikan(jikanAnime);
}
