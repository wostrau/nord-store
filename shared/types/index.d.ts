export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  user: {
    email: string;
    userId: string;
  };
}

export interface ProductInput {
  title: string;
  imageUrl: string;
  price: number;
  description: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
