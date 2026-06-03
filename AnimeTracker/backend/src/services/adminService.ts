import { Op } from 'sequelize';
import User from '../models/User';
import Review from '../models/Review';
import Group from '../models/Group';
import GroupMessage from '../models/GroupMessage';
import Message from '../models/Message';
import Anime from '../models/Anime';
import { AppError } from '../middlewares/errorHandler';
import { VisibilityType, UserRole, PaginatedResult } from '../types';

export async function getStats(): Promise<{
  totalUsers: number;
  totalReviews: number;
  totalGroups: number;
  totalGroupMessages: number;
  totalMessages: number;
  totalAnimes: number;
}> {
  const [totalUsers, totalReviews, totalGroups, totalGroupMessages, totalMessages, totalAnimes] =
    await Promise.all([
      User.count(),
      Review.count(),
      Group.count(),
      GroupMessage.count({ where: { deleted_at: null } }),
      Message.count(),
      Anime.count(),
    ]);
  return { totalUsers, totalReviews, totalGroups, totalGroupMessages, totalMessages, totalAnimes };
}

export async function listUsers(
  page = 1,
  limit = 20,
  search?: string,
): Promise<PaginatedResult<User>> {
  const offset = (page - 1) * limit;
  const where = search
    ? {
        [Op.or]: [
          { pseudo: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });

  return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
}

export async function changeUserRole(
  adminId: string,
  userId: string,
  role: UserRole,
): Promise<void> {
  if (adminId === userId) throw new AppError(400, 'Vous ne pouvez pas changer votre propre rôle');
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');
  await user.update({ role });
}

export async function suspendUser(
  adminId: string,
  userId: string,
  days: number,
): Promise<void> {
  if (adminId === userId) throw new AppError(400, 'Vous ne pouvez pas vous suspendre vous-même');
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');
  const suspensionEndDate = new Date();
  suspensionEndDate.setDate(suspensionEndDate.getDate() + days);
  await user.update({ is_suspended: true, suspension_end_date: suspensionEndDate });
}

export async function unsuspendUser(userId: string): Promise<void> {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');
  await user.update({ is_suspended: false, suspension_end_date: null });
}

export async function deleteUser(adminId: string, userId: string): Promise<void> {
  if (adminId === userId)
    throw new AppError(400, 'Vous ne pouvez pas supprimer votre propre compte');
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');
  await user.destroy();
}

export async function listReviews(page = 1, limit = 20): Promise<PaginatedResult<Review>> {
  const offset = (page - 1) * limit;
  const { count, rows } = await Review.findAndCountAll({
    include: [
      { model: User, as: 'author', attributes: ['id_user', 'pseudo', 'photo'] },
      { model: Anime, as: 'anime', attributes: ['id_anime', 'title', 'image_url'] },
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });
  return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
}

export async function adminDeleteReview(reviewId: string): Promise<void> {
  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError(404, 'Review introuvable');
  await review.destroy();
}

export async function changeReviewVisibility(
  reviewId: string,
  visibility: VisibilityType,
): Promise<void> {
  const review = await Review.findByPk(reviewId);
  if (!review) throw new AppError(404, 'Review introuvable');
  await review.update({ visibility });
}

export async function listGroupMessages(
  page = 1,
  limit = 20,
): Promise<PaginatedResult<GroupMessage>> {
  const offset = (page - 1) * limit;
  const { count, rows } = await GroupMessage.findAndCountAll({
    where: { deleted_at: null },
    include: [
      { model: User, as: 'author', attributes: ['id_user', 'pseudo', 'photo'] },
      { model: Group, as: 'group', attributes: ['id_group', 'name'] },
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });
  return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
}

export async function adminDeleteGroupMessage(
  messageId: string,
  adminId: string,
): Promise<void> {
  const message = await GroupMessage.findByPk(messageId);
  if (!message) throw new AppError(404, 'Message introuvable');
  await message.update({ deleted_at: new Date(), id_deleted_by: adminId });
}