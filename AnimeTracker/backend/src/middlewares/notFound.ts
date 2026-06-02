import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export function notFound(_req: Request, res: Response): void {
  const response: ApiResponse = { success: false, message: 'Route introuvable' };
  res.status(404).json(response);
}
