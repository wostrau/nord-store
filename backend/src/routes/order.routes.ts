import { Router } from 'express';

import { createOrder, getOrders } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireDatabase } from '../middleware/database.middleware.js';

export const orderRouter = Router();

orderRouter.use(requireAuth);
orderRouter.use(requireDatabase);
orderRouter.get('/', getOrders);
orderRouter.post('/', createOrder);
