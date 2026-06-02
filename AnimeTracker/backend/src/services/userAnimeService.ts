import { Op } from 'sequelize';
import UserAnime from '../models/UserAnime';
import Anime from '../models/Anime';
import { AppError } from '../middlewares/errorHandler';
import { AnimeStatus, PaginatedResult } from '../types';
import { getOrFetchAnime } from './animeService';

export async function getMyList(
  userId: string,
  status?: AnimeStatus,
  page = 1,
  limit = 20,
): Promise<PaginatedResult<UserAnime & { anime?: Anime }>> {
  const where: Record<string, unknown> = { id_user: userId };
  if (status) where['status'] = status;

  const offset = (page - 1) * limit;
  const { count, rows } = await UserAnime.findAndCountAll({
    where,
    include: [{ model: Anime, as: 'anime' }],
    limit,
    offset,
    order: [['updated_at', 'DESC']],
  });

  return {
    data: rows as Array<UserAnime & { anime?: Anime }>,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function addToList(
  userId: string,
  animeId: number,
  status: AnimeStatus,
): Promise<UserAnime> {
  await getOrFetchAnime(animeId);

  const existing = await UserAnime.findOne({
    where: { id_user: userId, id_anime: animeId },
  });
  if (existing) throw new AppError(409, 'Cet anime est déjà dans votre liste');

  return UserAnime.create({ id_user: userId, id_anime: animeId, status });
}

export async function updateEntry(
  userId: string,
  animeId: number,
  updates: Partial<Pick<UserAnime, 'status' | 'episodes_watched' | 'started_at' | 'completed_at'>>,
): Promise<UserAnime> {
  const entry = await UserAnime.findOne({
    where: { id_user: userId, id_anime: animeId },
  });
  if (!entry) throw new AppError(404, 'Anime non trouvé dans votre liste');

  await entry.update({ ...updates, updated_at: new Date() });
  return entry;
}

export async function removeFromList(userId: string, animeId: number): Promise<void> {
  const entry = await UserAnime.findOne({ where: { id_user: userId, id_anime: animeId } });
  if (!entry) throw new AppError(404, 'Anime non trouvé dans votre liste');
  await entry.destroy();
}

export async function getStats(userId: string): Promise<Record<AnimeStatus, number>> {
  const statuses: AnimeStatus[] = ['A_VOIR', 'EN_COURS', 'TERMINE', 'ABANDONNE'];
  const results = await Promise.all(
    statuses.map(async (s) => {
      const count = await UserAnime.count({ where: { id_user: userId, status: s } });
      return [s, count] as [AnimeStatus, number];
    }),
  );
  return Object.fromEntries(results) as Record<AnimeStatus, number>;
}

// Utilisé uniquement pour la recherche interne, évite l'import cyclique
const _Op = Op;
void _Op;
