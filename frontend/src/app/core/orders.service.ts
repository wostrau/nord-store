import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_URL } from './api-url';
import type { Order } from './api.types';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<{ orders: Order[] }>(`${API_URL}/orders`);
  }

  create() {
    return this.http.post<{ order: Order }>(`${API_URL}/orders`, {});
  }
}
