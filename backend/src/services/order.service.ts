import type { Order as OrderResponse } from '@shared/types';

import { Order, type OrderDocument } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';
import { toProductResponse } from './product.service.js';

export const toOrderResponse = (order: OrderDocument): OrderResponse => ({
  id: order.id,
  products: order.products,
  user: {
    email: order.user.email,
    userId: order.user.userId.toString()
  }
});

export const getUserOrders = async (userId: string): Promise<OrderResponse[]> => {
  const orders = await Order.find({ 'user.userId': userId }).sort({ createdAt: -1 });
  return orders.map(toOrderResponse);
};

export const createOrderFromCart = async (userId: string): Promise<OrderResponse> => {
  const user = await User.findById(userId).populate('cart.items.productId');

  if (!user) {
    throw new AppError('User was not found.', 404);
  }

  if (user.cart.items.length === 0) {
    throw new AppError('Cart is empty.', 400);
  }

  const products = user.cart.items
    .filter((item) => item.productId)
    .map((item) => ({
      quantity: item.quantity,
      product: toProductResponse(item.productId)
    }));

  const order = await Order.create({
    products,
    user: {
      email: user.email,
      userId: user._id
    }
  });

  user.cart = { items: [] };
  await user.save();

  return toOrderResponse(order);
};
