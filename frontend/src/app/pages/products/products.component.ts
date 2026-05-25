import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Product } from '@shared/types';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-products',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  template: `
    <main>
      @if (products$ | async; as response) {
        @if (response.products.length > 0) {
          <div class="grid">
            @for (product of response.products; track product.id) {
              <article class="card product-item">
                <header class="card__header">
                  <h1 class="product__title">{{ product.title }}</h1>
                </header>
                <div class="card__image">
                  <img [src]="product.imageUrl" [alt]="product.title">
                </div>
                <div class="card__content">
                  <h2 class="product__price">{{ product.price | currency }}</h2>
                  <p class="product__description">{{ product.description }}</p>
                </div>
                <div class="card__actions">
                  <a class="btn" [routerLink]="['/products', product.id]">Details</a>
                  @if (authService.user$ | async) {
                    <button class="btn" type="button" (click)="addToCart(product)">Add to Cart</button>
                  }
                </div>
              </article>
            }
          </div>
        } @else {
          <h1>No Products Found!</h1>
        }
      }
    </main>
  `
})
export class ProductsComponent {
  readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsService);
  readonly products$: Observable<{ products: Product[] }> = this.productsService.list();

  addToCart(product: Product): void {
    this.cartService.addItem(product.id).subscribe();
  }
}
