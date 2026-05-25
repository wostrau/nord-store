import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

const readyStateLabels = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
} as const;

export type DatabaseStatus = {
  configured: boolean;
  readyState: number;
  status: string;
};

export const getDatabaseStatus = (): DatabaseStatus => {
  const readyState = mongoose.connection.readyState;

  return {
    configured: Boolean(env.mongodbUri),
    readyState,
    status: env.mongodbUri
      ? (readyStateLabels[readyState as keyof typeof readyStateLabels] ?? 'unknown')
      : 'not_configured'
  };
};

export const assertDatabaseReady = (): void => {
  const status = getDatabaseStatus();

  if (!status.configured) {
    throw new AppError('MONGODB_URI is not configured.', 503);
  }

  if (status.readyState !== 1) {
    throw new AppError(`MongoDB connection is not ready: ${status.status}.`, 503);
  }
};

export const connectDatabase = async (): Promise<void> => {
  if (!env.mongodbUri) {
    console.info('MONGODB_URI is not set. Starting without database connection.');
    return;
  }

  await mongoose.connect(env.mongodbUri);
  console.info('Connected to MongoDB.');
};
