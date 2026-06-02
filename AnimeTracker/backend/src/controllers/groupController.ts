import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import {
  getOrCreateOfficialGroup,
  getAnimeGroupStatus,
  joinGroup,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
  getGroupInfo,
} from '../services/groupService';

export async function getAnimeGroupStatusController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const animeId = parseInt(req.params['animeId']!);
    const data = await getAnimeGroupStatus(animeId, req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function getOrCreateGroupController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const animeId = parseInt(req.params['animeId']!);
    const { animeTitle } = req.body as { animeTitle: string };
    const data = await getOrCreateOfficialGroup(animeId, animeTitle, req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function joinGroupController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await joinGroup(req.params['groupId']!, req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function leaveGroupController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await leaveGroup(req.params['groupId']!, req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function getGroupMessagesController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getGroupMessages(req.params['groupId']!, req.user!.userId);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function sendGroupMessageController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content } = req.body as { content: string };
    const data = await sendGroupMessage(req.params['groupId']!, req.user!.userId, content);
    res.status(201).json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function getGroupInfoController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getGroupInfo(req.params['groupId']!);
    res.json({ success: true, data } as ApiResponse<typeof data>);
  } catch (err) { next(err); }
}
