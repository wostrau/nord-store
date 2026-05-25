import { Router } from 'express';

import { login, logout, me, signup } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireDatabase } from '../middleware/database.middleware.js';

export const authRouter = Router();

authRouter.post('/signup', requireDatabase, signup);
authRouter.post('/login', requireDatabase, login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, requireDatabase, me);
