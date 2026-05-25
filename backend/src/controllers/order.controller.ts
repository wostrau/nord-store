import type { RequestHandler } from 'express';

import { createOrderFromCart, getUserOrders } from '../services/order.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const createOrder: RequestHandler = asyncHandler(async (req, res) => {
  res.status(201).json({
    order: await createOrderFromCart(req.user.id)
  });
});

export const getOrders: RequestHandler = asyncHandler(async (req, res) => {
  res.json({
    orders: await getUserOrders(req.user.id)
  });
});
