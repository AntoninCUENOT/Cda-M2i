import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import {
  getStats,
  listUsers,
  changeUserRole,
  suspendUser,
  unsuspendUser,
  deleteUser,
  listReviews,
  adminDeleteReview,
  changeReviewVisibility,
  listGroupMessages,
  adminDeleteGroupMessage,
} from '../services/adminService';
import { AppError } from '../middlewares/errorHandler';

export async function getStatsController(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const stats = await getStats();
    const response: ApiResponse<typeof stats> = { success: true, data: stats };
    res.json(response);
  } catch (err) { next(err); }
}

export async function listUsersController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1', 10);
    const limit = parseInt((req.query['limit'] as string) ?? '20', 10);
    const search = req.query['search'] as string | undefined;
    const result = await listUsers(page, limit, search);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) { next(err); }
}

export async function changeUserRoleController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { role } = req.body as { role: string };
    if (!['USER', 'MODERATEUR', 'ADMIN'].includes(role)) {
      throw new AppError(400, 'Rôle invalide');
    }
    await changeUserRole(req.user!.userId, req.params['userId'] ?? '', role as 'USER' | 'MODERATEUR' | 'ADMIN');
    const response: ApiResponse = { success: true, message: 'Rôle mis à jour' };
    res.json(response);
  } catch (err) { next(err); }
}

export async function suspendUserController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const days = parseInt((req.body as { days: string }).days ?? '7', 10);
    await suspendUser(req.user!.userId, req.params['userId'] ?? '', days);
    const response: ApiResponse = { success: true, message: 'Utilisateur suspendu' };
    res.json(response);
  } catch (err) { next(err); }
}

export async function unsuspendUserController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await unsuspendUser(req.params['userId'] ?? '');
    const response: ApiResponse = { success: true, message: 'Suspension levée' };
    res.json(response);
  } catch (err) { next(err); }
}

export async function deleteUserController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteUser(req.user!.userId, req.params['userId'] ?? '');
    const response: ApiResponse = { success: true, message: 'Utilisateur supprimé' };
    res.json(response);
  } catch (err) { next(err); }
}

export async function listReviewsController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1', 10);
    const limit = parseInt((req.query['limit'] as string) ?? '20', 10);
    const result = await listReviews(page, limit);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) { next(err); }
}

export async function deleteReviewController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await adminDeleteReview(req.params['reviewId'] ?? '');
    const response: ApiResponse = { success: true, message: 'Review supprimée' };
    res.json(response);
  } catch (err) { next(err); }
}

export async function changeReviewVisibilityController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { visibility } = req.body as { visibility: string };
    if (!['PUBLIC', 'PRIVE'].includes(visibility)) {
      throw new AppError(400, 'Visibilité invalide');
    }
    await changeReviewVisibility(req.params['reviewId'] ?? '', visibility as 'PUBLIC' | 'PRIVE');
    const response: ApiResponse = { success: true, message: 'Visibilité mise à jour' };
    res.json(response);
  } catch (err) { next(err); }
}

export async function listGroupMessagesController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = parseInt((req.query['page'] as string) ?? '1', 10);
    const limit = parseInt((req.query['limit'] as string) ?? '20', 10);
    const result = await listGroupMessages(page, limit);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) { next(err); }
}

export async function deleteGroupMessageController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await adminDeleteGroupMessage(req.params['messageId'] ?? '', req.user!.userId);
    const response: ApiResponse = { success: true, message: 'Message supprimé' };
    res.json(response);
  } catch (err) { next(err); }
}