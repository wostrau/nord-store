import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';

import { CartService } from '../../core/cart.service';
import { OrdersService } from '../../core/orders.service';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe],
  template: `
    <main>
      @if (cart$ | async; as cart) {
        @if (cart.items.length > 0) {
          <ul class="cart__item-list">
            @for (item of cart.items; track item.product.id) {
              <li class="cart__item">
                <h1>{{ item.product.title }}</h1>
                <h2>Quantity: {{ item.quantity }}</h2>
                <button class="btn danger" type="button" (click)="remove(item.product.id)">Delete</button>
              </li>
            }
          </ul>
          <hr>
          <div class="centered">
            <button class="btn" type="button" (click)="createOrder()">Order Now!</button>
          </div>
        } @else {
          <h1>No Products in Cart!</h1>
        }
      }
    </main>
  `
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly cart$ = this.refresh$.pipe(switchMap(() => this.cartService.getCart()));

  remove(productId: string): void {
    this.cartService.removeItem(productId).subscribe(() => this.refresh$.next());
  }

  createOrder(): void {
    this.ordersService.create().subscribe(() => {
      void this.router.navigate(['/orders']);
    });
  }
}
