import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import { env } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../database/mongoose.js';
import { connectRedis, disconnectRedis, getRedisStatus } from '../database/redis.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { setJson } from '../services/cache.service.js';
import { productCacheKeys } from '../services/product-cache-keys.js';
import { toProductResponse } from '../services/product.service.js';
import { AppError } from '../utils/app-error.js';
import { createMockProducts, DEFAULT_MOCK_PRODUCT_COUNT } from './mock-products.js';

const seedUserEmail = 'seed.admin@nord-store.local';
const seedUserPassword = 'seed-password-change-me';
const maxSeedProductCount = 1000;

const parseSeedProductCount = (): number => {
  const rawValue = process.env.SEED_PRODUCT_COUNT;
  if (!rawValue) {
    return DEFAULT_MOCK_PRODUCT_COUNT;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    throw new AppError('SEED_PRODUCT_COUNT must be a positive integer.', 400);
  }

  return Math.min(parsedValue, maxSeedProductCount);
};

const ensureSeedUser = async () => {
  const hashedPassword = await bcrypt.hash(seedUserPassword, 12);

  return User.findOneAndUpdate(
    { email: seedUserEmail },
    {
      $setOnInsert: {
        email: seedUserEmail,
        password: hashedPassword,
        cart: { items: [] }
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
};

const seedMongoProducts = async () => {
  if (!env.mongodbUri) {
    throw new AppError('MONGODB_URI is required to run the seed script.', 500);
  }

  const productCount = parseSeedProductCount();
  const mockProducts = createMockProducts(productCount);
  const seedUser = await ensureSeedUser();
  const seedUserId = seedUser._id as Types.ObjectId;

  await Product.bulkWrite(
    mockProducts.map((product) => ({
      updateOne: {
        filter: { title: product.title },
        update: {
          $set: {
            ...product,
            userId: seedUserId
          }
        },
        upsert: true
      }
    }))
  );

  const seededProducts = await Product.find({
    title: { $in: mockProducts.map((product) => product.title) }
  }).sort({ createdAt: -1 });

  return {
    productCount,
    seededProducts
  };
};

const seedRedisProductCache = async (): Promise<number> => {
  await connectRedis();

  if (!getRedisStatus().ready) {
    console.info('Redis is not ready. Skipping Redis cache seed.');
    return 0;
  }

  const allProducts = await Product.find().sort({ createdAt: -1 });
  const productResponses = allProducts.map(toProductResponse);

  await setJson(productCacheKeys.list, productResponses);
  await Promise.all(
    productResponses.map((product) =>
      setJson(productCacheKeys.detail(product.id), product)
    )
  );

  return productResponses.length;
};

const runSeed = async (): Promise<void> => {
  try {
    await connectDatabase();

    const { productCount, seededProducts } = await seedMongoProducts();
    const cachedProductCount = await seedRedisProductCache();

    console.info(`Seeded ${seededProducts.length} MongoDB products from ${productCount} mock products.`);
    console.info(`Seeded Redis product cache for ${cachedProductCount} products.`);
  } catch (error) {
    console.error('Seed failed.', error);
    process.exitCode = 1;
  } finally {
    await disconnectRedis();
    await disconnectDatabase();
  }
};

void runSeed();
