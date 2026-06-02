import { sequelize } from '../config/database';
import Review from '../models/Review';
import User from '../models/User';
import { AppError } from '../middlewares/errorHandler';
import { VisibilityType, PaginatedResult } from '../types';

export async function getAnimeReviews(
  animeId: number,
  page = 1,
  limit = 20,
): Promise<PaginatedResult<Review & { user?: Partial<User> }>> {
  const offset = (page - 1) * limit;

  const { count, rows } = await Review.findAndCountAll({
    where: { id_anime: animeId, visibility: 'PUBLIC' },
    include: [{ model: User, as: 'author', attributes: ['id_user', 'pseudo', 'photo'] }],
    limit,
    offset,
    order: [['likes_count', 'DESC'], ['created_at', 'DESC']],
  });

  return {
    data: rows as Array<Review & { user?: Partial<User> }>,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function getMyReview(userId: string, animeId: number): Promise<Review | null> {
  return Review.findOne({ where: { id_user: userId, id_anime: animeId } });
}

export async function upsertReview(
  userId: string,
  animeId: number,
  data: { rating: number; comment?: string; visibility?: VisibilityType },
): Promise<Review> {
  const existing = await Review.findOne({ where: { id_user: userId, id_anime: animeId } });

  if (existing) {
    await existing.update({ ...data, updated_at: new Date() });
    return existing;
  }

  return Review.create({
    id_user: userId,
    id_anime: animeId,
    rating: data.rating,
    comment: data.comment,
    visibility: data.visibility ?? 'PRIVE',
  });
}

export async function deleteReview(userId: string, reviewId: string): Promise<void> {
  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError(404, 'Review introuvable');
  if (review.id_user !== userId) throw new AppError(403, 'Action non autorisée');
  await review.destroy();
}

export async function toggleLike(
  userId: string,
  reviewId: string,
): Promise<{ liked: boolean }> {
  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError(404, 'Review introuvable');
  if (review.id_user === userId) throw new AppError(400, 'Impossible de liker sa propre review');

  const [, created] = await sequelize.query(
    `INSERT INTO review_like (id_review_like, id_review, id_user, created_at)
     VALUES (uuid_generate_v4(), :reviewId, :userId, NOW())
     ON CONFLICT (id_review, id_user) DO NOTHING`,
    { replacements: { reviewId, userId } },
  );

  if (!created) {
    await sequelize.query(
      `DELETE FROM review_like WHERE id_review = :reviewId AND id_user = :userId`,
      { replacements: { reviewId, userId } },
    );
    return { liked: false };
  }

  return { liked: true };
}
