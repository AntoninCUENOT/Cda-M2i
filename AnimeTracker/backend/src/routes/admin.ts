import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/authenticate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getStatsController,
  listUsersController,
  changeUserRoleController,
  suspendUserController,
  unsuspendUserController,
  deleteUserController,
  listReviewsController,
  deleteReviewController,
  changeReviewVisibilityController,
  listGroupMessagesController,
  deleteGroupMessageController,
} from '../controllers/adminController';

const router = Router();

router.use(asyncHandler(authenticate), requireRole('ADMIN'));

router.get('/stats', asyncHandler(getStatsController));

router.get('/users', asyncHandler(listUsersController));
router.patch('/users/:userId/role', asyncHandler(changeUserRoleController));
router.patch('/users/:userId/suspend', asyncHandler(suspendUserController));
router.patch('/users/:userId/unsuspend', asyncHandler(unsuspendUserController));
router.delete('/users/:userId', asyncHandler(deleteUserController));

router.get('/reviews', asyncHandler(listReviewsController));
router.delete('/reviews/:reviewId', asyncHandler(deleteReviewController));
router.patch('/reviews/:reviewId/visibility', asyncHandler(changeReviewVisibilityController));

router.get('/group-messages', asyncHandler(listGroupMessagesController));
router.delete('/group-messages/:messageId', asyncHandler(deleteGroupMessageController));

export default router;