import { Request } from 'express';

export type UserRole = 'USER' | 'MODERATEUR' | 'ADMIN';
export type AnimeStatus = 'A_VOIR' | 'EN_COURS' | 'TERMINE' | 'ABANDONNE';
export type VisibilityType = 'PUBLIC' | 'PRIVE';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
