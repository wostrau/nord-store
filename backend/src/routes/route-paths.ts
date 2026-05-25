const API_BASE = '/api';

const withApiBase = (path: string): string => `${API_BASE}${path}`;

export const RoutePath = {
  api: {
    auth: withApiBase('/auth'),
    products: withApiBase('/products'),
    admin: withApiBase('/admin'),
    cart: withApiBase('/cart'),
    orders: withApiBase('/orders'),
    health: withApiBase('/health')
  },
  auth: {
    signup: '/signup',
    login: '/login',
    logout: '/logout',
    me: '/me'
  },
  product: {
    root: '/',
    byId: '/:productId'
  },
  admin: {
    products: '/products',
    productById: '/products/:productId'
  },
  cart: {
    root: '/',
    items: '/items',
    itemByProductId: '/items/:productId'
  },
  root: '/'
} as const;
