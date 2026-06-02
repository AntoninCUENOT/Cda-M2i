import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { defineAssociations } from './models/associations';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();
  defineAssociations();

  app.listen(env.port, () => {
    console.log(`Serveur démarré sur le port ${env.port} [${env.nodeEnv}]`);
  });
}

bootstrap().catch((err: Error) => {
  console.error('Échec du démarrage:', err.message);
  process.exit(1);
});
