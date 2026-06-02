import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { AnimeStatus } from '../types';

class UserAnime extends Model<InferAttributes<UserAnime>, InferCreationAttributes<UserAnime>> {
  declare id_user_anime: CreationOptional<string>;
  declare id_user: string;
  declare id_anime: number;
  declare status: AnimeStatus;
  declare episodes_watched: CreationOptional<number>;
  declare started_at: CreationOptional<Date | null>;
  declare completed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

UserAnime.init(
  {
    id_user_anime: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_user: { type: DataTypes.UUID, allowNull: false },
    id_anime: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('A_VOIR', 'EN_COURS', 'TERMINE', 'ABANDONNE'), allowNull: false },
    episodes_watched: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    started_at: { type: DataTypes.DATE, allowNull: true },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'user_anime', timestamps: false },
);

export default UserAnime;
