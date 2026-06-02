import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { updateProfileSchema, changePasswordSchema } from '../schemas/user';
import {
  getProfile,
  searchUsers,
  updateProfile,
  changePassword,
  deleteAccount,
  exportMyData,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../services/userService';

export async function searchUsersController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = (req.query['q'] as string) ?? '';
    if (query.length < 2) {
      res.json({ success: true, data: [] });
      return;
    }
    const users = await searchUsers(query, req.user!.userId);
    const response: ApiResponse<typeof users> = { success: true, data: users };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId ?? req.params['userId'] ?? '';
    const user = await getProfile(userId);
    const response: ApiResponse<typeof user> = { success: true, data: user };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function updateProfileController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body } = updateProfileSchema.parse({ body: req.body as unknown });
    const user = await updateProfile(req.user!.userId, body);
    const response: ApiResponse<typeof user> = { success: true, data: user };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function changePasswordController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body } = changePasswordSchema.parse({ body: req.body as unknown });
    await changePassword(req.user!.userId, body.current_password, body.new_password);
    const response: ApiResponse = { success: true, message: 'Mot de passe mis à jour' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

// RGPD — Droit à l'effacement (Art. 17)
export async function deleteAccountController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteAccount(req.user!.userId);
    const response: ApiResponse = { success: true, message: 'Compte supprimé définitivement' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

// RGPD — Droit à la portabilité (Art. 20)
export async function exportDataController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await exportMyData(req.user!.userId);
    res.setHeader('Content-Disposition', 'attachment; filename="my-data.json"');
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function followController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await followUser(req.user!.userId, req.params['userId'] ?? '');
    const response: ApiResponse<typeof data> = { success: true, data };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function unfollowController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await unfollowUser(req.user!.userId, req.params['userId'] ?? '');
    const response: ApiResponse = { success: true, message: 'Utilisateur retiré des suivis' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getFollowersController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const followers = await getFollowers(req.params['userId'] ?? '');
    const response: ApiResponse<typeof followers> = { success: true, data: followers };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getFollowingController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const following = await getFollowing(req.params['userId'] ?? '');
    const response: ApiResponse<typeof following> = { success: true, data: following };
    res.json(response);
  } catch (err) {
    next(err);
  }
}
