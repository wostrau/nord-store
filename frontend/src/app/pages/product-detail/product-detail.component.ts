import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-product-detail',
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    <main class="centered">
      @if (product$ | async; as response) {
        <h1>{{ response.product.title }}</h1>
        <hr>
        <div class="image">
          <img [src]="response.product.imageUrl" [alt]="response.product.title">
        </div>
        <h2>{{ response.product.price | currency }}</h2>
        <p>{{ response.product.description }}</p>
        @if (authService.user$ | async) {
          <button class="btn" type="button" (click)="addToCart(response.product.id)">Add to Cart</button>
        }
      }
    </main>
  `
})
export class ProductDetailComponent {
  readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  readonly product$ = this.route.paramMap.pipe(
    switchMap((params) => this.productsService.get(params.get('id') ?? ''))
  );

  addToCart(productId: string): void {
    this.cartService.addItem(productId).subscribe();
  }
}
