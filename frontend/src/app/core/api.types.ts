export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userId?: string;
};

export type User = {
  id: string;
  email: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  user: {
    email: string;
    userId: string;
  };
};

export type ProductInput = {
  title: string;
  imageUrl: string;
  price: number;
  description: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
