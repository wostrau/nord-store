import { Router } from 'express';

import { getDatabaseStatus } from '../database/mongoose.js';
import { getRedisStatus } from '../database/redis.js';
import { RoutePath } from './route-paths.js';

export const healthRouter = Router();

healthRouter.get(RoutePath.root, (_req, res) => {
  res.json({
    status: 'ok',
    service: 'nord-store-backend',
    database: getDatabaseStatus(),
    redis: getRedisStatus()
  });
});
