import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

class Anime extends Model<InferAttributes<Anime>, InferCreationAttributes<Anime>> {
  declare id_anime: number;
  declare title: string;
  declare title_english: CreationOptional<string | null>;
  declare synopsis: CreationOptional<string | null>;
  declare image_url: CreationOptional<string | null>;
  declare trailer_url: CreationOptional<string | null>;
  declare episodes: CreationOptional<number | null>;
  declare score: CreationOptional<number | null>;
  declare year: CreationOptional<number | null>;
  declare status: CreationOptional<string | null>;
  declare aired_from: CreationOptional<Date | null>;
  declare aired_to: CreationOptional<Date | null>;
  declare last_fetched_at: CreationOptional<Date | null>;
  declare id_studio: CreationOptional<number | null>;
}

Anime.init(
  {
    id_anime: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    title_english: { type: DataTypes.STRING(255), allowNull: true },
    synopsis: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    trailer_url: { type: DataTypes.STRING(500), allowNull: true },
    episodes: { type: DataTypes.INTEGER, allowNull: true },
    score: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
    year: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING(50), allowNull: true },
    aired_from: { type: DataTypes.DATEONLY, allowNull: true },
    aired_to: { type: DataTypes.DATEONLY, allowNull: true },
    last_fetched_at: { type: DataTypes.DATE, allowNull: true },
    id_studio: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: 'anime', timestamps: false },
);

export default Anime;
