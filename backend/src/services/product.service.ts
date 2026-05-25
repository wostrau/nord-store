import type { Product as ProductResponse, ProductInput } from '@shared/types';
import { isValidObjectId, Types } from 'mongoose';

import { Product, type ProductDocument } from '../models/product.model.js';
import { AppError } from '../utils/app-error.js';

type ProductInputPayload = {
  title?: string;
  price?: number | string;
  description?: string;
  imageUrl?: string;
};

export const toProductResponse = (product: ProductDocument | any): ProductResponse => ({
  id: product.id ?? product._id.toString(),
  title: product.title,
  price: product.price,
  description: product.description,
  imageUrl: product.imageUrl,
  userId: product.userId?.toString()
});

const normalizeProductInput = (input: ProductInputPayload): ProductInput => {
  const title = input.title?.trim();
  const description = input.description?.trim();
  const imageUrl = input.imageUrl?.trim();
  const price = typeof input.price === 'string' ? Number(input.price) : input.price;

  if (!title || !description || !imageUrl || price === undefined) {
    throw new AppError('Title, image URL, price, and description are required.', 400);
  }

  if (Number.isNaN(price) || price < 0) {
    throw new AppError('Price must be a non-negative number.', 400);
  }

  return { title, description, imageUrl, price };
};

const assertProductId = (productId: string | undefined): string => {
  if (!productId || !isValidObjectId(productId)) {
    throw new AppError('Product ID is invalid.', 400);
  }

  return productId;
};

export const listProducts = async (): Promise<ProductResponse[]> => {
  const products = await Product.find().sort({ createdAt: -1 });
  return products.map(toProductResponse);
};

export const getProduct = async (productId: string | undefined): Promise<ProductResponse> => {
  const product = await Product.findById(assertProductId(productId));

  if (!product) {
    throw new AppError('Product was not found.', 404);
  }

  return toProductResponse(product);
};

export const createProduct = async (
  input: ProductInputPayload,
  userId: string
): Promise<ProductResponse> => {
  const product = await Product.create({
    ...normalizeProductInput(input),
    userId: new Types.ObjectId(userId)
  });

  return toProductResponse(product);
};

export const updateProduct = async (
  productId: string | undefined,
  input: ProductInputPayload
): Promise<ProductResponse> => {
  const product = await Product.findByIdAndUpdate(
    assertProductId(productId),
    normalizeProductInput(input),
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError('Product was not found.', 404);
  }

  return toProductResponse(product);
};

export const deleteProduct = async (productId: string | undefined): Promise<void> => {
  const product = await Product.findByIdAndDelete(assertProductId(productId));

  if (!product) {
    throw new AppError('Product was not found.', 404);
  }
};
