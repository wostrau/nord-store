import { Router } from 'express';

import { addCartItem, deleteCartItem, getCart } from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireDatabase } from '../middleware/database.middleware.js';
import { RoutePath } from './route-paths.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.use(requireDatabase);
cartRouter.get(RoutePath.cart.root, getCart);
cartRouter.post(RoutePath.cart.items, addCartItem);
cartRouter.delete(RoutePath.cart.itemByProductId, deleteCartItem);
