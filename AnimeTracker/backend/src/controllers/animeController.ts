import { Request, Response, NextFunction } from 'express';
import { searchAndSync, getTopAndSync, getOrFetchAnime } from '../services/animeService';
import { ApiResponse } from '../types';

export async function searchAnimesController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = (req.query['q'] as string) ?? '';
    const page = parseInt((req.query['page'] as string) ?? '1', 10);

    if (!query.trim()) {
      res.status(400).json({ success: false, message: 'Paramètre q requis' });
      return;
    }

    const result = await searchAndSync(query, page);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getTopAnimesController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1', 10);
    const animes = await getTopAndSync(page);
    const response: ApiResponse<typeof animes> = { success: true, data: animes };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getAnimeController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID invalide' });
      return;
    }

    const anime = await getOrFetchAnime(id);
    const response: ApiResponse<typeof anime> = { success: true, data: anime };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
