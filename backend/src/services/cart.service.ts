import type { CartItem as CartItemResponse } from '@shared/types';
import { isValidObjectId, Types } from 'mongoose';

import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';
import { toProductResponse } from './product.service.js';

const assertObjectId = (id: string | undefined, label: string): string => {
  if (!id || !isValidObjectId(id)) {
    throw new AppError(`${label} is invalid.`, 400);
  }

  return id;
};

export const getUserCart = async (userId: string): Promise<CartItemResponse[]> => {
  const user = await User.findById(userId).populate('cart.items.productId');
  if (!user) {
    throw new AppError('User was not found.', 404);
  }

  return user.cart.items
    .filter((item) => item.productId)
    .map((item) => ({
      product: toProductResponse(item.productId),
      quantity: item.quantity
    }));
};

export const addProductToCart = async (
  userId: string,
  productId: string | undefined
): Promise<CartItemResponse[]> => {
  const validProductId = assertObjectId(productId, 'Product ID');
  const [user, product] = await Promise.all([
    User.findById(userId),
    Product.findById(validProductId)
  ]);

  if (!user) {
    throw new AppError('User was not found.', 404);
  }

  if (!product) {
    throw new AppError('Product was not found.', 404);
  }

  const existingItem = user.cart.items.find(
    (item) => item.productId.toString() === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.items.push({
      productId: product._id as Types.ObjectId,
      quantity: 1
    });
  }

  await user.save();
  return getUserCart(user.id);
};

export const removeProductFromCart = async (
  userId: string,
  productId: string | undefined
): Promise<CartItemResponse[]> => {
  const validProductId = assertObjectId(productId, 'Product ID');
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User was not found.', 404);
  }

  user.cart.items = user.cart.items.filter(
    (item) => item.productId.toString() !== validProductId
  );
  await user.save();

  return getUserCart(user.id);
};
