import User from './User';
import Anime from './Anime';
import UserAnime from './UserAnime';
import Review from './Review';
import Follow from './Follow';
import GroupMessage from './GroupMessage';
import Group from './Group';

export function defineAssociations(): void {
  // UserAnime ↔ User / Anime
  UserAnime.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
  UserAnime.belongsTo(Anime, { foreignKey: 'id_anime', as: 'anime' });
  User.hasMany(UserAnime, { foreignKey: 'id_user', as: 'animeList' });
  Anime.hasMany(UserAnime, { foreignKey: 'id_anime', as: 'userAnimes' });

  // Review ↔ User / Anime
  Review.belongsTo(User, { foreignKey: 'id_user', as: 'author' });
  Review.belongsTo(Anime, { foreignKey: 'id_anime', as: 'anime' });
  User.hasMany(Review, { foreignKey: 'id_user', as: 'reviews' });
  Anime.hasMany(Review, { foreignKey: 'id_anime', as: 'reviews' });

  // Follow ↔ User
  Follow.belongsTo(User, { foreignKey: 'id_follower', as: 'follower' });
  Follow.belongsTo(User, { foreignKey: 'id_following', as: 'following' });

  // GroupMessage ↔ User / Group
  GroupMessage.belongsTo(User, { foreignKey: 'id_author', as: 'author' });
  GroupMessage.belongsTo(Group, { foreignKey: 'id_group', as: 'group' });
}
