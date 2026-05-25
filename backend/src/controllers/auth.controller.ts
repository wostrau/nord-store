import bcrypt from 'bcryptjs';
import type { RequestHandler } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { AppError } from '../utils/app-error.js';
import { toUserResponse } from '../services/user.service.js';

const createToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn']
  };

  return jwt.sign({ userId }, env.jwtSecret, options);
};

export const signup: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body as {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new AppError('Password confirmation does not match.', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    cart: { items: [] }
  });

  res.status(201).json({
    token: createToken(user.id),
    user: toUserResponse(user)
  });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401);
  }

  res.json({
    token: createToken(user.id),
    user: toUserResponse(user)
  });
});

export const me: RequestHandler = (req, res) => {
  res.json({
    user: toUserResponse(req.user)
  });
};

export const logout: RequestHandler = (_req, res) => {
  res.json({ success: true });
};
