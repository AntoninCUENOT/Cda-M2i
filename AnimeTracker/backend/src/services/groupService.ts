import { Op } from 'sequelize';
import Group from '../models/Group';
import GroupMember from '../models/GroupMember';
import GroupMessage from '../models/GroupMessage';
import User from '../models/User';
import { AppError } from '../middlewares/errorHandler';

export async function getOrCreateOfficialGroup(animeId: number, animeTitle: string, creatorId: string) {
  let group = await Group.findOne({ where: { id_anime: animeId, type: 'OFFICIEL' } });

  if (!group) {
    group = await Group.create({
      name: animeTitle,
      type: 'OFFICIEL',
      id_anime: animeId,
      id_creator: creatorId,
      is_public: true,
    });
  }

  const existing = await GroupMember.findOne({ where: { id_group: group.id_group, id_user: creatorId } });
  if (!existing) {
    await GroupMember.create({ id_group: group.id_group, id_user: creatorId });
  }

  const memberCount = await GroupMember.count({ where: { id_group: group.id_group } });
  const isMember = await GroupMember.findOne({ where: { id_group: group.id_group, id_user: creatorId } });

  return { group, memberCount, isMember: !!isMember };
}

export async function joinGroup(groupId: string, userId: string) {
  const group = await Group.findByPk(groupId);
  if (!group) throw new AppError(404, 'Groupe introuvable');

  const existing = await GroupMember.findOne({ where: { id_group: groupId, id_user: userId } });
  if (!existing) {
    await GroupMember.create({ id_group: groupId, id_user: userId });
  }

  const memberCount = await GroupMember.count({ where: { id_group: groupId } });
  return { group, memberCount };
}

export async function leaveGroup(groupId: string, userId: string) {
  const member = await GroupMember.findOne({ where: { id_group: groupId, id_user: userId } });
  if (!member) throw new AppError(404, 'Vous n\'êtes pas membre de ce groupe');
  await member.destroy();
  const memberCount = await GroupMember.count({ where: { id_group: groupId } });
  return { groupId, memberCount };
}

export async function getGroupMessages(groupId: string, userId: string) {
  const member = await GroupMember.findOne({ where: { id_group: groupId, id_user: userId } });
  if (!member) throw new AppError(403, 'Vous n\'êtes pas membre de ce groupe');

  const messages = await GroupMessage.findAll({
    where: { id_group: groupId, deleted_at: null },
    order: [['created_at', 'ASC']],
  });

  const authorIds = [...new Set(messages.map(m => m.id_author))];
  const authors = await User.findAll({
    where: { id_user: { [Op.in]: authorIds } },
    attributes: ['id_user', 'pseudo', 'photo'],
  });
  const authorMap = Object.fromEntries(authors.map(a => [a.id_user, a]));

  return messages.map(m => ({
    id: m.id_group_message,
    groupId: m.id_group,
    senderId: m.id_author,
    senderPseudo: authorMap[m.id_author]?.pseudo ?? '',
    senderAvatar: authorMap[m.id_author]?.photo ?? null,
    content: m.content,
    createdAt: m.created_at,
  }));
}

export async function sendGroupMessage(groupId: string, userId: string, content: string) {
  const member = await GroupMember.findOne({ where: { id_group: groupId, id_user: userId } });
  if (!member) throw new AppError(403, 'Vous n\'êtes pas membre de ce groupe');

  const message = await GroupMessage.create({ id_group: groupId, id_author: userId, content });
  const author = await User.findByPk(userId, { attributes: ['pseudo', 'photo'] });

  return {
    id: message.id_group_message,
    groupId: message.id_group,
    senderId: userId,
    senderPseudo: author?.pseudo ?? '',
    senderAvatar: author?.photo ?? null,
    content: message.content,
    createdAt: message.created_at,
  };
}

export async function getAnimeGroupStatus(animeId: number, userId: string) {
  const group = await Group.findOne({ where: { id_anime: animeId, type: 'OFFICIEL' } });
  if (!group) return null;
  const memberCount = await GroupMember.count({ where: { id_group: group.id_group } });
  const isMember = !!(await GroupMember.findOne({ where: { id_group: group.id_group, id_user: userId } }));
  return { group, memberCount, isMember };
}

export async function getGroupInfo(groupId: string) {
  const group = await Group.findByPk(groupId);
  if (!group) throw new AppError(404, 'Groupe introuvable');
  const memberCount = await GroupMember.count({ where: { id_group: groupId } });
  return { group, memberCount };
}
