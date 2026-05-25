import type { RequestHandler } from 'express';

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from '../services/product.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getProducts: RequestHandler = asyncHandler(async (_req, res) => {
  res.json({
    products: await listProducts()
  });
});

export const getProductById: RequestHandler = asyncHandler(async (req, res) => {
  res.json({
    product: await getProduct(req.params.productId)
  });
});

export const createAdminProduct: RequestHandler = asyncHandler(async (req, res) => {
  res.status(201).json({
    product: await createProduct(req.body, req.user.id)
  });
});

export const updateAdminProduct: RequestHandler = asyncHandler(async (req, res) => {
  res.json({
    product: await updateProduct(req.params.productId, req.body)
  });
});

export const deleteAdminProduct: RequestHandler = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.productId);
  res.status(204).send();
});
