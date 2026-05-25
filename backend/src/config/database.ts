import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  if (!env.mongodbUri) {
    console.info('MONGODB_URI is not set. Starting without database connection.');
    return;
  }

  await mongoose.connect(env.mongodbUri);
  console.info('Connected to MongoDB.');
};
