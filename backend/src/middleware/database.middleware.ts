import type { RequestHandler } from 'express';

import { assertDatabaseReady } from '../database/mongoose.js';

export const requireDatabase: RequestHandler = (_req, _res, next) => {
  try {
    assertDatabaseReady();
    next();
  } catch (error) {
    next(error);
  }
};
