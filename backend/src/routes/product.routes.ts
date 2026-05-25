import { Router } from 'express';

import { getProductById, getProducts } from '../controllers/product.controller.js';
import { requireDatabase } from '../middleware/database.middleware.js';
import { RoutePath } from './route-paths.js';

export const productRouter = Router();

productRouter.use(requireDatabase);
productRouter.get(RoutePath.product.root, getProducts);
productRouter.get(RoutePath.product.byId, getProductById);
