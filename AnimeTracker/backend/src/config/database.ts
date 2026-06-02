import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.postgres.host,
  port: env.postgres.port,
  database: env.postgres.database,
  username: env.postgres.username,
  password: env.postgres.password,
  logging: env.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log('PostgreSQL connecté');
}
