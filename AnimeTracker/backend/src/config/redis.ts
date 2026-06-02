import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
  lazyConnect: true,
  retryStrategy: (times: number): number => Math.min(times * 100, 3000),
});

redis.on('error', (err) => {
  console.error('Redis erreur:', err.message);
});

export async function connectRedis(): Promise<void> {
  await redis.connect();
  console.log('Redis connecté');
}
