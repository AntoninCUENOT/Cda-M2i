import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class ConversationParticipant extends Model<InferAttributes<ConversationParticipant>, InferCreationAttributes<ConversationParticipant>> {
  declare id_participant: CreationOptional<string>;
  declare id_conversation: string;
  declare id_user: string;
  declare joined_at: CreationOptional<Date>;
}

ConversationParticipant.init(
  {
    id_participant: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_conversation: { type: DataTypes.UUID, allowNull: false },
    id_user: { type: DataTypes.UUID, allowNull: false },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'conversation_participant', timestamps: false },
);

export default ConversationParticipant;
