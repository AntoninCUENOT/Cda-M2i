import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { upsertReviewSchema } from '../schemas/review';
import { getAnimeReviews, getMyReview, upsertReview, deleteReview, toggleLike } from '../services/reviewService';

export async function getMyReviewController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const animeId = parseInt(req.params['animeId'] ?? '', 10);
    const review = await getMyReview(req.user!.userId, animeId);
    const response: ApiResponse<typeof review> = { success: true, data: review };
    res.json(response);
  } catch (err) { next(err); }
}

export async function getReviewsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const animeId = parseInt(req.params['animeId'] ?? '', 10);
    const page = parseInt((req.query['page'] as string) ?? '1', 10);
    const result = await getAnimeReviews(animeId, page);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function upsertReviewController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body, params } = upsertReviewSchema.parse({
      body: req.body as unknown,
      params: req.params,
    });
    const animeId = parseInt(params.animeId, 10);
    const review = await upsertReview(req.user!.userId, animeId, body);
    const response: ApiResponse<typeof review> = { success: true, data: review };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function deleteReviewController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteReview(req.user!.userId, req.params['reviewId'] ?? '');
    const response: ApiResponse = { success: true, message: 'Review supprimée' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function toggleLikeController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await toggleLike(req.user!.userId, req.params['reviewId'] ?? '');
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
