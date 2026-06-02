import { Request, Response, NextFunction } from 'express';
import { register, login, logout } from '../services/authService';
import { registerSchema, loginSchema } from '../schemas/auth';
import { AuthenticatedRequest, ApiResponse } from '../types';

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body } = registerSchema.parse({ body: req.body as unknown });
    const result = await register(body);

    const response: ApiResponse<{ token: string; userId: string }> = {
      success: true,
      data: result,
      message: 'Compte créé avec succès',
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { body } = loginSchema.parse({ body: req.body as unknown });
    const result = await login(body);

    const response: ApiResponse<{ token: string; userId: string }> = {
      success: true,
      data: result,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function logoutController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.headers.authorization!.slice(7);
    await logout(token);

    const response: ApiResponse = { success: true, message: 'Déconnexion réussie' };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export function meController(req: AuthenticatedRequest, res: Response): void {
  const response: ApiResponse<{ userId: string; role: string }> = {
    success: true,
    data: { userId: req.user!.userId, role: req.user!.role },
  };
  res.json(response);
}
