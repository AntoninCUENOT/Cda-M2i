import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import Conversation from '../models/Conversation';
import ConversationParticipant from '../models/ConversationParticipant';
import Message from '../models/Message';
import User from '../models/User';
import { AppError } from '../middlewares/errorHandler';

export async function getOrCreateConversation(userId1: string, userId2: string): Promise<string> {
  // Cherche une conversation existante entre les deux utilisateurs
  const participant1 = await ConversationParticipant.findAll({ where: { id_user: userId1 } });
  const convIds1 = participant1.map(p => p.id_conversation);

  if (convIds1.length > 0) {
    const shared = await ConversationParticipant.findOne({
      where: { id_conversation: { [Op.in]: convIds1 }, id_user: userId2 },
    });
    if (shared) return shared.id_conversation;
  }

  // Crée une nouvelle conversation
  const conv = await sequelize.transaction(async (t) => {
    const newConv = await Conversation.create({}, { transaction: t });
    await ConversationParticipant.bulkCreate(
      [
        { id_conversation: newConv.id_conversation, id_user: userId1 },
        { id_conversation: newConv.id_conversation, id_user: userId2 },
      ],
      { transaction: t },
    );
    return newConv;
  });

  return conv.id_conversation;
}

export async function getConversations(userId: string) {
  const participations = await ConversationParticipant.findAll({ where: { id_user: userId } });
  const convIds = participations.map(p => p.id_conversation);

  if (convIds.length === 0) return [];

  const results = await Promise.all(
    convIds.map(async (convId) => {
      const otherParticipant = await ConversationParticipant.findOne({
        where: { id_conversation: convId, id_user: { [Op.ne]: userId } },
      });
      if (!otherParticipant) return null;

      const otherUser = await User.findByPk(otherParticipant.id_user, {
        attributes: ['id_user', 'pseudo', 'photo'],
      });
      if (!otherUser) return null;

      const lastMessage = await Message.findOne({
        where: { id_conversation: convId },
        order: [['created_at', 'DESC']],
      });

      const unreadCount = await Message.count({
        where: { id_conversation: convId, id_sender: { [Op.ne]: userId }, is_read: false },
      });

      return {
        id: convId,
        participantId: otherUser.id_user,
        participantPseudo: otherUser.pseudo,
        participantAvatar: otherUser.photo ?? null,
        lastMessage: lastMessage?.content ?? '',
        lastMessageDate: lastMessage?.created_at ?? new Date(),
        unreadCount,
      };
    }),
  );

  return results
    .filter(Boolean)
    .sort((a, b) => new Date(b!.lastMessageDate).getTime() - new Date(a!.lastMessageDate).getTime());
}

export async function getMessages(conversationId: string, userId: string) {
  // Vérifie que l'utilisateur est participant
  const participant = await ConversationParticipant.findOne({
    where: { id_conversation: conversationId, id_user: userId },
  });
  if (!participant) throw new AppError(403, 'Accès refusé');

  const messages = await Message.findAll({
    where: { id_conversation: conversationId },
    order: [['created_at', 'ASC']],
  });

  const senderIds = [...new Set(messages.map(m => m.id_sender))];
  const senders = await User.findAll({
    where: { id_user: { [Op.in]: senderIds } },
    attributes: ['id_user', 'pseudo', 'photo'],
  });
  const senderMap = Object.fromEntries(senders.map(s => [s.id_user, s]));

  return messages.map(m => ({
    id: m.id_message,
    senderId: m.id_sender,
    senderPseudo: senderMap[m.id_sender]?.pseudo ?? '',
    senderAvatar: senderMap[m.id_sender]?.photo ?? null,
    receiverId: conversationId,
    content: m.content,
    isRead: m.is_read,
    createdAt: m.created_at,
  }));
}

export async function sendMessageToConversation(conversationId: string, senderId: string, content: string) {
  const participant = await ConversationParticipant.findOne({
    where: { id_conversation: conversationId, id_user: senderId },
  });
  if (!participant) throw new AppError(403, 'Accès refusé');

  const message = await Message.create({ id_conversation: conversationId, id_sender: senderId, content });

  await Conversation.update({ updated_at: new Date() }, { where: { id_conversation: conversationId } });

  const sender = await User.findByPk(senderId, { attributes: ['pseudo', 'photo'] });

  return {
    id: message.id_message,
    senderId,
    senderPseudo: sender?.pseudo ?? '',
    senderAvatar: sender?.photo ?? null,
    receiverId: conversationId,
    content: message.content,
    isRead: false,
    createdAt: message.created_at,
  };
}

export async function markConversationAsRead(conversationId: string, userId: string) {
  await Message.update(
    { is_read: true },
    { where: { id_conversation: conversationId, id_sender: { [Op.ne]: userId }, is_read: false } },
  );
}

export async function deleteConversationForUser(conversationId: string, userId: string) {
  const participant = await ConversationParticipant.findOne({
    where: { id_conversation: conversationId, id_user: userId },
  });
  if (!participant) throw new AppError(403, 'Accès refusé');
  await participant.destroy();
}
