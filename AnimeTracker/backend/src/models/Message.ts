import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id_message: CreationOptional<string>;
  declare id_conversation: string;
  declare id_sender: string;
  declare content: string;
  declare is_read: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
}

Message.init(
  {
    id_message: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_conversation: { type: DataTypes.UUID, allowNull: false },
    id_sender: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'message', timestamps: false },
);

export default Message;
