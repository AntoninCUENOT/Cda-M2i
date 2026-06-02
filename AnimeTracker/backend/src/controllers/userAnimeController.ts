import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, AnimeStatus } from '../types';
import { addToListSchema, updateEntrySchema } from '../schemas/userAnime';
import {
  getMyList,
  addToList,
  updateEntry,
  removeFromList,
  getStats,
} from '../services/userAnimeService';

export async function getMyListController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const status = req.query['status'] as AnimeStatus | undefined;
    const page = parseInt((req.query['page'] as string) ?? '1', 10);

    const result = await getMyList(userId, status, page);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function addToListController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body } = addToListSchema.parse({ body: req.body as unknown });
    const entry = await addToList(req.user!.userId, body.anime_id, body.status);
    const response: ApiResponse<typeof entry> = { success: true, data: entry };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateEntryController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body, params } = updateEntrySchema.parse({
      body: req.body as unknown,
      params: req.params,
    });
    const animeId = parseInt(params.animeId, 10);
    const updates = {
      ...body,
      started_at: body.started_at ? new Date(body.started_at) : undefined,
      completed_at: body.completed_at ? new Date(body.completed_at) : undefined,
    };
    const entry = await updateEntry(req.user!.userId, animeId, updates);
    const response: ApiResponse<typeof entry> = { success: true, data: entry };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function removeFromListController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const animeId = parseInt(req.params['animeId'] ?? '', 10);
    await removeFromList(req.user!.userId, animeId);
    const response: ApiResponse = { success: true, message: 'Anime retiré de la liste' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getStatsController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const stats = await getStats(req.user!.userId);
    const response: ApiResponse<typeof stats> = { success: true, data: stats };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
