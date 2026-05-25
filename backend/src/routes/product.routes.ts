import { Router } from 'express';

import { getProductById, getProducts } from '../controllers/product.controller.js';

export const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:productId', getProductById);
