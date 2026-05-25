import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { OrdersService } from '../../core/orders.service';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe],
  template: `
    <main>
      @if (orders$ | async; as response) {
        @if (response.orders.length <= 0) {
          <h1>Nothing there!</h1>
        } @else {
          <ul class="orders">
            @for (order of response.orders; track order.id) {
              <li class="orders__item">
                <h1>Order - # {{ order.id }}</h1>
                <ul class="orders__products">
                  @for (item of order.products; track item.product.id) {
                    <li class="orders__products-item">{{ item.product.title }} ({{ item.quantity }})</li>
                  }
                </ul>
              </li>
            }
          </ul>
        }
      }
    </main>
  `
})
export class OrdersComponent {
  private readonly ordersService = inject(OrdersService);
  readonly orders$ = this.ordersService.list();
}
