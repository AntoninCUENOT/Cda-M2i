import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerController,
  loginController,
  logoutController,
  meController,
} from '../controllers/authController';
import { authenticate } from '../middlewares/authenticate';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 100 : 10,
  message: { success: false, message: 'Trop de tentatives, réessayez dans 15 minutes' },
});

router.post('/register', authLimiter, asyncHandler(registerController));
router.post('/login', authLimiter, asyncHandler(loginController));
router.post('/logout', asyncHandler(authenticate), asyncHandler(logoutController));
router.get('/me', asyncHandler(authenticate), meController);

export default router;
