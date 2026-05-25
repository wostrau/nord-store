import { Router } from 'express';

import {
  createAdminProduct,
  deleteAdminProduct,
  getProducts,
  updateAdminProduct
} from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireDatabase } from '../middleware/database.middleware.js';
import { RoutePath } from './route-paths.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireDatabase);
adminRouter.get(RoutePath.admin.products, getProducts);
adminRouter.post(RoutePath.admin.products, createAdminProduct);
adminRouter.put(RoutePath.admin.productById, updateAdminProduct);
adminRouter.delete(RoutePath.admin.productById, deleteAdminProduct);
