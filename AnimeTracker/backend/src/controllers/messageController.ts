import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessageToConversation,
  markConversationAsRead,
  deleteConversationForUser,
} from '../services/messageService';

export async function getConversationsController(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    const data = await getConversations(req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function getOrCreateConversationController(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    const conversationId = await getOrCreateConversation(req.user!.userId, req.params['recipientId']!);
    res.json({ success: true, data: { conversationId } } as ApiResponse<{ conversationId: string }>);
  } catch (err) { next(err); }
}

export async function getMessagesController(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    const data = await getMessages(req.params['conversationId']!, req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function sendMessageController(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    const { content } = req.body as { content: string };
    const data = await sendMessageToConversation(req.params['conversationId']!, req.user!.userId, content);
    res.status(201).json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function markAsReadController(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    await markConversationAsRead(req.params['conversationId']!, req.user!.userId);
    res.json({ success: true } as ApiResponse);
  } catch (err) { next(err); }
}

export async function deleteConversationController(
  req: AuthenticatedRequest, res: Response, next: NextFunction,
): Promise<void> {
  try {
    await deleteConversationForUser(req.params['conversationId']!, req.user!.userId);
    res.json({ success: true } as ApiResponse);
  } catch (err) { next(err); }
}
