import type { RequestHandler } from 'express';

import {
  addProductToCart,
  getUserCart,
  removeProductFromCart
} from '../services/cart.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getCart: RequestHandler = asyncHandler(async (req, res) => {
  res.json({
    items: await getUserCart(req.user.id)
  });
});

export const addCartItem: RequestHandler = asyncHandler(async (req, res) => {
  const { productId } = req.body as { productId?: string };

  res.status(201).json({
    items: await addProductToCart(req.user.id, productId)
  });
});

export const deleteCartItem: RequestHandler = asyncHandler(async (req, res) => {
  res.json({
    items: await removeProductFromCart(req.user.id, req.params.productId)
  });
});
