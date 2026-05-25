import { Router } from 'express';

import { addCartItem, deleteCartItem, getCart } from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireDatabase } from '../middleware/database.middleware.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.use(requireDatabase);
cartRouter.get('/', getCart);
cartRouter.post('/items', addCartItem);
cartRouter.delete('/items/:productId', deleteCartItem);
