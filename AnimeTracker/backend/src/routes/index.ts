import { Router, Request, Response } from 'express';
import { ApiResponse } from '../types';
import authRouter from './auth';
import animesRouter from './animes';
import usersRouter from './users';
import messagesRouter from './messages';
import groupsRouter from './groups';
import adminRouter from './admin';

const router = Router();

router.get('/health', (_req: Request, res: Response): void => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString() },
  };
  res.json(response);
});

router.use('/auth', authRouter);
router.use('/animes', animesRouter);
router.use('/users', usersRouter);
router.use('/conversations', messagesRouter);
router.use('/groups', groupsRouter);
router.use('/admin', adminRouter);

export default router;
