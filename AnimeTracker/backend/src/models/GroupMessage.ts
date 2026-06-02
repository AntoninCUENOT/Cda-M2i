import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class GroupMessage extends Model<InferAttributes<GroupMessage>, InferCreationAttributes<GroupMessage>> {
  declare id_group_message: CreationOptional<string>;
  declare id_group: string;
  declare id_author: string;
  declare content: string;
  declare created_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;
  declare id_deleted_by: CreationOptional<string | null>;
}

GroupMessage.init(
  {
    id_group_message: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_group: { type: DataTypes.UUID, allowNull: false },
    id_author: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    id_deleted_by: { type: DataTypes.UUID, allowNull: true },
  },
  { sequelize, tableName: 'group_message', timestamps: false },
);

export default GroupMessage;
