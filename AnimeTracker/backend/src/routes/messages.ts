import { Router } from 'express';
import {
  getConversationsController,
  getOrCreateConversationController,
  getMessagesController,
  sendMessageController,
  markAsReadController,
  deleteConversationController,
} from '../controllers/messageController';
import { authenticate } from '../middlewares/authenticate';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(authenticate), asyncHandler(getConversationsController));
router.post('/with/:recipientId', asyncHandler(authenticate), asyncHandler(getOrCreateConversationController));
router.get('/:conversationId/messages', asyncHandler(authenticate), asyncHandler(getMessagesController));
router.post('/:conversationId/messages', asyncHandler(authenticate), asyncHandler(sendMessageController));
router.patch('/:conversationId/read', asyncHandler(authenticate), asyncHandler(markAsReadController));
router.delete('/:conversationId', asyncHandler(authenticate), asyncHandler(deleteConversationController));

export default router;
