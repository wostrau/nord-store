export const productCacheKeys = {
  list: 'products:list:v1',
  detail: (productId: string): string => `products:detail:v1:${productId}`
} as const;
