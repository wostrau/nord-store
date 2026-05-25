import { Router } from 'express';

import {
  createAdminProduct,
  deleteAdminProduct,
  getProducts,
  updateAdminProduct
} from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.get('/products', getProducts);
adminRouter.post('/products', createAdminProduct);
adminRouter.put('/products/:productId', updateAdminProduct);
adminRouter.delete('/products/:productId', deleteAdminProduct);
