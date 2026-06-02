import dotenv from 'dotenv';

dotenv.config();

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number,
  label: string
): number => {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return parsedValue;
};

const optionalEnv = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
};

export const env = {
  port: parsePositiveInteger(process.env.PORT, 3000, 'PORT'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: optionalEnv(process.env.MONGODB_URI),
  redisUrl: optionalEnv(process.env.REDIS_URL),
  redisCacheTtlSeconds: parsePositiveInteger(
    process.env.REDIS_CACHE_TTL_SECONDS,
    300,
    'REDIS_CACHE_TTL_SECONDS'
  ),
  jwtSecret: process.env.JWT_SECRET ?? 'development-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d'
};
