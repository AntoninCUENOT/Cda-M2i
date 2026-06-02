import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../models/User';
import Follow from '../models/Follow';
import UserAnime from '../models/UserAnime';
import Review from '../models/Review';
import { AppError } from '../middlewares/errorHandler';

type PublicUser = Omit<User, 'password'>;

/**
 * Retourne le profil public d'un utilisateur, sans le champ `password`.
 *
 * @throws {AppError} 404 si l'utilisateur n'existe pas
 */
export async function searchUsers(query: string, excludeUserId: string): Promise<PublicUser[]> {
  const users = await User.findAll({
    where: {
      pseudo: { [Op.iLike]: `%${query}%` },
      id_user: { [Op.ne]: excludeUserId },
      is_active: true,
    },
    attributes: { exclude: ['password'] },
    limit: 20,
  });
  return users as unknown as PublicUser[];
}

export async function getProfile(userId: string): Promise<PublicUser> {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new AppError(404, 'Utilisateur introuvable');
  return user as unknown as PublicUser;
}

/**
 * Met à jour les champs modifiables du profil (pseudo, bio, photo).
 *
 * Vérifie l'unicité du nouveau pseudo avant toute modification.
 *
 * @throws {AppError} 404 si l'utilisateur n'existe pas
 * @throws {AppError} 409 si le nouveau pseudo est déjà pris
 */
export async function updateProfile(
  userId: string,
  data: Partial<Pick<User, 'pseudo' | 'bio' | 'photo'>>,
): Promise<PublicUser> {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');

  if (data.pseudo && data.pseudo !== user.pseudo) {
    const taken = await User.findOne({ where: { pseudo: data.pseudo } });
    if (taken) throw new AppError(409, 'Ce pseudo est déjà utilisé');
  }

  await user.update({ ...data, updated_at: new Date() });

  return User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  }) as Promise<PublicUser>;
}

/**
 * Change le mot de passe après vérification de l'ancien.
 *
 * Le nouveau mot de passe est haché avec bcrypt (12 rounds) avant persistance.
 *
 * @throws {AppError} 404 si l'utilisateur n'existe pas
 * @throws {AppError} 401 si l'ancien mot de passe est incorrect
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new AppError(401, 'Mot de passe actuel incorrect');

  const hashed = await bcrypt.hash(newPassword, 12);
  await user.update({ password: hashed, updated_at: new Date() });
}

/**
 * Supprime définitivement le compte utilisateur et toutes ses données liées.
 *
 * Implémente le **droit à l'effacement** (RGPD Art. 17). La suppression en cascade
 * des données associées (watchlist, reviews, follows) est gérée par les contraintes
 * `ON DELETE CASCADE` définies dans le schéma PostgreSQL.
 *
 * @throws {AppError} 404 si le compte n'existe pas
 */
export async function deleteAccount(userId: string): Promise<void> {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'Utilisateur introuvable');
  // Les données liées sont supprimées en CASCADE (défini dans init.sql)
  await user.destroy();
}

/**
 * Exporte l'intégralité des données personnelles d'un utilisateur au format JSON.
 *
 * Implémente le **droit à la portabilité** (RGPD Art. 20). Le résultat inclut
 * le profil, la watchlist, les reviews ainsi que les compteurs de followers/following.
 * Le mot de passe haché est exclu de l'export.
 *
 * @throws {AppError} 404 si l'utilisateur n'existe pas
 */
export async function exportMyData(userId: string): Promise<Record<string, unknown>> {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  if (!user) throw new AppError(404, 'Utilisateur introuvable');

  const [animeList, reviews, followers, following] = await Promise.all([
    UserAnime.findAll({ where: { id_user: userId } }),
    Review.findAll({ where: { id_user: userId } }),
    Follow.findAll({ where: { id_following: userId } }),
    Follow.findAll({ where: { id_follower: userId } }),
  ]);

  return {
    exported_at: new Date().toISOString(),
    profile: user.toJSON(),
    anime_list: animeList.map((a) => a.toJSON()),
    reviews: reviews.map((r) => r.toJSON()),
    followers_count: followers.length,
    following_count: following.length,
  };
}

/**
 * Abonne `followerId` au profil de `followingId`.
 *
 * @throws {AppError} 400 si l'utilisateur tente de se suivre lui-même
 * @throws {AppError} 404 si la cible n'existe pas
 * @throws {AppError} 409 si la relation de suivi existe déjà
 */
export interface FollowData {
  id: string;
  followerId: string;
  followerPseudo: string;
  followerAvatar: string | null;
  followingId: string;
  followingPseudo: string;
  followingAvatar: string | null;
  createdAt: string;
}

export async function followUser(followerId: string, followingId: string): Promise<FollowData> {
  if (followerId === followingId) throw new AppError(400, 'Impossible de se suivre soi-même');

  const [follower, target] = await Promise.all([
    User.findByPk(followerId, { attributes: ['id_user', 'pseudo', 'photo'] }),
    User.findByPk(followingId, { attributes: ['id_user', 'pseudo', 'photo'] }),
  ]);
  if (!target) throw new AppError(404, 'Utilisateur introuvable');

  const existing = await Follow.findOne({ where: { id_follower: followerId, id_following: followingId } });
  if (existing) throw new AppError(409, 'Vous suivez déjà cet utilisateur');

  const newFollow = await Follow.create({ id_follower: followerId, id_following: followingId });
  return {
    id: newFollow.id_follow,
    followerId,
    followerPseudo: follower?.pseudo ?? '',
    followerAvatar: follower?.photo ?? null,
    followingId,
    followingPseudo: target.pseudo,
    followingAvatar: target.photo ?? null,
    createdAt: newFollow.created_at?.toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Désabonne `followerId` du profil de `followingId`.
 *
 * @throws {AppError} 404 si la relation de suivi n'existe pas
 */
export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const follow = await Follow.findOne({ where: { id_follower: followerId, id_following: followingId } });
  if (!follow) throw new AppError(404, 'Vous ne suivez pas cet utilisateur');
  await follow.destroy();
}

export async function getFollowers(userId: string): Promise<FollowData[]> {
  const follows = await Follow.findAll({ where: { id_following: userId } });
  if (follows.length === 0) return [];
  const users = await User.findAll({
    where: { id_user: follows.map(f => f.id_follower) },
    attributes: ['id_user', 'pseudo', 'photo'],
  });
  const map = new Map(users.map(u => [u.id_user, u]));
  return follows.map(f => ({
    id: f.id_follow,
    followerId: f.id_follower,
    followerPseudo: map.get(f.id_follower)?.pseudo ?? '',
    followerAvatar: map.get(f.id_follower)?.photo ?? null,
    followingId: f.id_following,
    followingPseudo: '',
    followingAvatar: null,
    createdAt: f.created_at?.toISOString() ?? new Date().toISOString(),
  }));
}

export async function getFollowing(userId: string): Promise<FollowData[]> {
  const follows = await Follow.findAll({ where: { id_follower: userId } });
  if (follows.length === 0) return [];
  const users = await User.findAll({
    where: { id_user: follows.map(f => f.id_following) },
    attributes: ['id_user', 'pseudo', 'photo'],
  });
  const map = new Map(users.map(u => [u.id_user, u]));
  return follows.map(f => ({
    id: f.id_follow,
    followerId: f.id_follower,
    followerPseudo: '',
    followerAvatar: null,
    followingId: f.id_following,
    followingPseudo: map.get(f.id_following)?.pseudo ?? '',
    followingAvatar: map.get(f.id_following)?.photo ?? null,
    createdAt: f.created_at?.toISOString() ?? new Date().toISOString(),
  }));
}
