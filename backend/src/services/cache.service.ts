import { env } from '../config/env.js';
import { getRedisClient } from '../database/redis.js';

export const getJson = async <T>(key: string): Promise<T | null> => {
  const client = getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const cachedValue = await client.get(key);
    return cachedValue ? (JSON.parse(cachedValue) as T) : null;
  } catch (error) {
    console.warn(`Redis cache read failed for key "${key}".`, error);
    return null;
  }
};

export const setJson = async (
  key: string,
  value: unknown,
  ttlSeconds = env.redisCacheTtlSeconds
): Promise<void> => {
  const client = getRedisClient();
  if (!client) {
    return;
  }

  try {
    await client.set(key, JSON.stringify(value), {
      expiration: {
        type: 'EX',
        value: ttlSeconds
      }
    });
  } catch (error) {
    console.warn(`Redis cache write failed for key "${key}".`, error);
  }
};

export const deleteKeys = async (keys: string[]): Promise<void> => {
  const client = getRedisClient();
  const uniqueKeys = [...new Set(keys)].filter(Boolean);

  if (!client || uniqueKeys.length === 0) {
    return;
  }

  try {
    await client.del(uniqueKeys);
  } catch (error) {
    console.warn(`Redis cache delete failed for keys "${uniqueKeys.join(', ')}".`, error);
  }
};
