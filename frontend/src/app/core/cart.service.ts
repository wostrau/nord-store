import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { CartItem } from '@shared/types';

import { API_URL } from './api-url';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private readonly http: HttpClient) {}

  getCart() {
    return this.http.get<{ items: CartItem[] }>(`${API_URL}/cart`);
  }

  addItem(productId: string) {
    return this.http.post<{ items: CartItem[] }>(`${API_URL}/cart/items`, { productId });
  }

  removeItem(productId: string) {
    return this.http.delete<{ items: CartItem[] }>(`${API_URL}/cart/items/${productId}`);
  }
}
