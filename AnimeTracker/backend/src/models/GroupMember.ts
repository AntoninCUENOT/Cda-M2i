import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class GroupMember extends Model<InferAttributes<GroupMember>, InferCreationAttributes<GroupMember>> {
  declare id_member: CreationOptional<string>;
  declare id_group: string;
  declare id_user: string;
  declare is_moderator: CreationOptional<boolean>;
  declare joined_at: CreationOptional<Date>;
}

GroupMember.init(
  {
    id_member: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_group: { type: DataTypes.UUID, allowNull: false },
    id_user: { type: DataTypes.UUID, allowNull: false },
    is_moderator: { type: DataTypes.BOOLEAN, defaultValue: false },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'group_member', timestamps: false },
);

export default GroupMember;
