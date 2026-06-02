import { Router } from 'express';
import {
  searchUsersController,
  getProfileController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
  exportDataController,
  followController,
  unfollowController,
  getFollowersController,
  getFollowingController,
} from '../controllers/userController';
import {
  getMyListController,
  addToListController,
  updateEntryController,
  removeFromListController,
  getStatsController,
} from '../controllers/userAnimeController';
import { toggleLikeController, deleteReviewController } from '../controllers/reviewController';
import { authenticate } from '../middlewares/authenticate';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Recherche d'utilisateurs
router.get('/search', asyncHandler(authenticate), asyncHandler(searchUsersController));

// Profil personnel
router.get('/me', asyncHandler(authenticate), asyncHandler(getProfileController));
router.patch('/me', asyncHandler(authenticate), asyncHandler(updateProfileController));
router.patch('/me/password', asyncHandler(authenticate), asyncHandler(changePasswordController));

// RGPD
router.delete('/me', asyncHandler(authenticate), asyncHandler(deleteAccountController));
router.get('/me/data', asyncHandler(authenticate), asyncHandler(exportDataController));

// Watchlist
router.get('/me/animes', asyncHandler(authenticate), asyncHandler(getMyListController));
router.post('/me/animes', asyncHandler(authenticate), asyncHandler(addToListController));
router.patch('/me/animes/:animeId', asyncHandler(authenticate), asyncHandler(updateEntryController));
router.delete('/me/animes/:animeId', asyncHandler(authenticate), asyncHandler(removeFromListController));
router.get('/me/stats', asyncHandler(authenticate), asyncHandler(getStatsController));

// Reviews
router.delete('/me/reviews/:reviewId', asyncHandler(authenticate), asyncHandler(deleteReviewController));
router.post('/me/reviews/:reviewId/like', asyncHandler(authenticate), asyncHandler(toggleLikeController));

// Profil public + follow
router.get('/:userId', asyncHandler(getProfileController));
router.get('/:userId/followers', asyncHandler(getFollowersController));
router.get('/:userId/following', asyncHandler(getFollowingController));
router.post('/:userId/follow', asyncHandler(authenticate), asyncHandler(followController));
router.delete('/:userId/follow', asyncHandler(authenticate), asyncHandler(unfollowController));

export default router;
