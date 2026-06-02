import { createClient, type RedisClientType } from 'redis';

import { env } from '../config/env.js';

type RedisStatusLabel = 'not_configured' | 'connected' | 'disconnected' | 'error';

export type RedisStatus = {
  configured: boolean;
  ready: boolean;
  status: RedisStatusLabel;
};

let redisClient: RedisClientType | undefined;
let redisStatus: RedisStatusLabel = env.redisUrl ? 'disconnected' : 'not_configured';

export const getRedisClient = (): RedisClientType | null => {
  if (!redisClient?.isReady) {
    return null;
  }

  return redisClient;
};

export const getRedisStatus = (): RedisStatus => {
  if (!env.redisUrl) {
    return {
      configured: false,
      ready: false,
      status: 'not_configured'
    };
  }

  if (redisClient?.isReady) {
    return {
      configured: true,
      ready: true,
      status: 'connected'
    };
  }

  return {
    configured: true,
    ready: false,
    status: redisStatus
  };
};

export const connectRedis = async (): Promise<void> => {
  if (!env.redisUrl) {
    redisStatus = 'not_configured';
    console.info('REDIS_URL is not set. Starting without Redis cache.');
    return;
  }

  if (redisClient?.isReady) {
    return;
  }

  try {
    redisClient = createClient({
      url: env.redisUrl,
      socket: {
        connectTimeout: 1500,
        reconnectStrategy: false
      }
    });

    redisClient.on('error', (error) => {
      redisStatus = 'error';
      console.error('Redis client error.', error);
    });

    redisClient.on('ready', () => {
      redisStatus = 'connected';
    });

    redisClient.on('end', () => {
      if (env.redisUrl && redisStatus !== 'error') {
        redisStatus = 'disconnected';
      }
    });

    await redisClient.connect();
    redisStatus = redisClient.isReady ? 'connected' : 'disconnected';
    console.info('Connected to Redis.');
  } catch (error) {
    redisStatus = 'error';
    console.warn('Redis connection failed. Continuing without Redis cache.', error);
    redisClient?.destroy();
    redisClient = undefined;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }

  try {
    if (redisClient.isOpen) {
      await redisClient.close();
    }
  } catch (error) {
    console.warn('Redis disconnect failed. Destroying Redis client.', error);
    redisClient.destroy();
  } finally {
    redisClient = undefined;
    redisStatus = env.redisUrl ? 'disconnected' : 'not_configured';
  }
};
