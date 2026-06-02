import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>> {
  declare id_follow: CreationOptional<string>;
  declare id_follower: string;
  declare id_following: string;
  declare created_at: CreationOptional<Date>;
}

Follow.init(
  {
    id_follow: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_follower: { type: DataTypes.UUID, allowNull: false },
    id_following: { type: DataTypes.UUID, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'follow', timestamps: false },
);

export default Follow;
