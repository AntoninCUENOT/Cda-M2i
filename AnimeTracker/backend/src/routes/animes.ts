import { Router } from 'express';
import {
  searchAnimesController,
  getTopAnimesController,
  getAnimeController,
} from '../controllers/animeController';
import {
  getMyReviewController,
  getReviewsController,
  upsertReviewController,
  deleteReviewController,
} from '../controllers/reviewController';
import { authenticate } from '../middlewares/authenticate';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/search', asyncHandler(searchAnimesController));
router.get('/top', asyncHandler(getTopAnimesController));
router.get('/:id', asyncHandler(getAnimeController));

// Reviews d'un anime
router.get('/:animeId/my-review', asyncHandler(authenticate), asyncHandler(getMyReviewController));
router.get('/:animeId/reviews', asyncHandler(getReviewsController));
router.post('/:animeId/reviews', asyncHandler(authenticate), asyncHandler(upsertReviewController));
router.delete('/:animeId/reviews', asyncHandler(authenticate), asyncHandler(deleteReviewController));

export default router;
