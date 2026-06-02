import { Router } from 'express';
import {
  getAnimeGroupStatusController,
  getOrCreateGroupController,
  joinGroupController,
  leaveGroupController,
  getGroupMessagesController,
  sendGroupMessageController,
  getGroupInfoController,
} from '../controllers/groupController';
import { authenticate } from '../middlewares/authenticate';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Statut du groupe officiel d'un anime (lecture seule)
router.get('/anime/:animeId', asyncHandler(authenticate), asyncHandler(getAnimeGroupStatusController));
// Groupe officiel d'un anime (créer ou rejoindre)
router.post('/anime/:animeId', asyncHandler(authenticate), asyncHandler(getOrCreateGroupController));

// Actions sur un groupe
router.get('/:groupId', asyncHandler(authenticate), asyncHandler(getGroupInfoController));
router.post('/:groupId/join', asyncHandler(authenticate), asyncHandler(joinGroupController));
router.delete('/:groupId/leave', asyncHandler(authenticate), asyncHandler(leaveGroupController));
router.get('/:groupId/messages', asyncHandler(authenticate), asyncHandler(getGroupMessagesController));
router.post('/:groupId/messages', asyncHandler(authenticate), asyncHandler(sendGroupMessageController));

export default router;
