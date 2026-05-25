import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_URL } from './api-url';
import type { Product, ProductInput } from './api.types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<{ products: Product[] }>(`${API_URL}/products`);
  }

  listAdmin() {
    return this.http.get<{ products: Product[] }>(`${API_URL}/admin/products`);
  }

  get(productId: string) {
    return this.http.get<{ product: Product }>(`${API_URL}/products/${productId}`);
  }

  create(product: ProductInput) {
    return this.http.post<{ product: Product }>(`${API_URL}/admin/products`, product);
  }

  update(productId: string, product: ProductInput) {
    return this.http.put<{ product: Product }>(`${API_URL}/admin/products/${productId}`, product);
  }

  delete(productId: string) {
    return this.http.delete<void>(`${API_URL}/admin/products/${productId}`);
  }
}
