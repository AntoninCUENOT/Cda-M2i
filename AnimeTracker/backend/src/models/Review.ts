import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { VisibilityType } from '../types';

class Review extends Model<InferAttributes<Review>, InferCreationAttributes<Review>> {
  declare id_review: CreationOptional<string>;
  declare id_user: string;
  declare id_anime: number;
  declare rating: number;
  declare comment: CreationOptional<string | null>;
  declare visibility: CreationOptional<VisibilityType>;
  declare likes_count: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Review.init(
  {
    id_review: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_user: { type: DataTypes.UUID, allowNull: false },
    id_anime: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    visibility: { type: DataTypes.ENUM('PUBLIC', 'PRIVE'), defaultValue: 'PRIVE', allowNull: false },
    likes_count: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'review', timestamps: false },
);

export default Review;
