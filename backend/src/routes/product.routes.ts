import { Router } from 'express';

import { getProductById, getProducts } from '../controllers/product.controller.js';
import { requireDatabase } from '../middleware/database.middleware.js';

export const productRouter = Router();

productRouter.use(requireDatabase);
productRouter.get('/', getProducts);
productRouter.get('/:productId', getProductById);
