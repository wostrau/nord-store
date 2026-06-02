import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getJson: vi.fn(),
  setJson: vi.fn(),
  deleteKeys: vi.fn(),
  productFind: vi.fn(),
  productFindByIdAndUpdate: vi.fn()
}));

vi.mock('../services/cache.service.js', () => ({
  getJson: mocks.getJson,
  setJson: mocks.setJson,
  deleteKeys: mocks.deleteKeys
}));

vi.mock('../models/product.model.js', () => ({
  Product: {
    find: mocks.productFind,
    findByIdAndUpdate: mocks.productFindByIdAndUpdate
  }
}));

const { listProducts, updateProduct } = await import('../services/product.service.js');

const productId = '507f1f77bcf86cd799439011';
const productDocument = {
  id: productId,
  title: 'Nord Hoodie',
  price: 49,
  description: 'Warm hoodie',
  imageUrl: 'https://example.com/hoodie.jpg',
  userId: '507f1f77bcf86cd799439012'
};

const productResponse = {
  id: productId,
  title: 'Nord Hoodie',
  price: 49,
  description: 'Warm hoodie',
  imageUrl: 'https://example.com/hoodie.jpg',
  userId: '507f1f77bcf86cd799439012'
};

describe('product cache integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cached product list without querying MongoDB', async () => {
    mocks.getJson.mockResolvedValueOnce([productResponse]);

    const products = await listProducts();

    expect(products).toEqual([productResponse]);
    expect(mocks.productFind).not.toHaveBeenCalled();
    expect(mocks.setJson).not.toHaveBeenCalled();
  });

  it('stores product list in Redis after a cache miss', async () => {
    const sort = vi.fn().mockResolvedValueOnce([productDocument]);
    mocks.getJson.mockResolvedValueOnce(null);
    mocks.productFind.mockReturnValueOnce({ sort });

    const products = await listProducts();

    expect(products).toEqual([productResponse]);
    expect(mocks.productFind).toHaveBeenCalledOnce();
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mocks.setJson).toHaveBeenCalledWith('products:list:v1', [productResponse]);
  });

  it('invalidates product list and detail cache after product updates', async () => {
    mocks.productFindByIdAndUpdate.mockResolvedValueOnce(productDocument);

    await updateProduct(productId, {
      title: 'Nord Hoodie',
      price: 49,
      description: 'Warm hoodie',
      imageUrl: 'https://example.com/hoodie.jpg'
    });

    expect(mocks.deleteKeys).toHaveBeenCalledWith([
      'products:list:v1',
      `products:detail:v1:${productId}`
    ]);
  });
});
