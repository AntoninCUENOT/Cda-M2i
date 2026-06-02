import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class Group extends Model<InferAttributes<Group>, InferCreationAttributes<Group>> {
  declare id_group: CreationOptional<string>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare type: 'OFFICIEL' | 'PERSONNALISE';
  declare id_anime: CreationOptional<number | null>;
  declare id_creator: string;
  declare is_public: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Group.init(
  {
    id_group: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.ENUM('OFFICIEL', 'PERSONNALISE'), allowNull: false },
    id_anime: { type: DataTypes.INTEGER, allowNull: true },
    id_creator: { type: DataTypes.UUID, allowNull: false },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'group', timestamps: false },
);

export default Group;
