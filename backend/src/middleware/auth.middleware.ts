import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { AppError } from '../utils/app-error.js';

type JwtPayload = {
  userId: string;
};

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required.', 401);
  }

  const token = authorization.slice('Bearer '.length);
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    throw new AppError('Authentication token is invalid or expired.', 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError('Authenticated user was not found.', 401);
  }

  req.user = user;
  next();
});
