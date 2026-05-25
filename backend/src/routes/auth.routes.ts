import { Router } from 'express';

import { login, logout, me, signup } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireDatabase } from '../middleware/database.middleware.js';
import { RoutePath } from './route-paths.js';

export const authRouter = Router();

authRouter.post(RoutePath.auth.signup, requireDatabase, signup);
authRouter.post(RoutePath.auth.login, requireDatabase, login);
authRouter.post(RoutePath.auth.logout, logout);
authRouter.get(RoutePath.auth.me, requireAuth, requireDatabase, me);
