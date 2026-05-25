import { Router } from 'express';

import { getDatabaseStatus } from '../config/database.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'nord-store-backend',
    database: getDatabaseStatus()
  });
});
