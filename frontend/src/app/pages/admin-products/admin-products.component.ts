import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';

import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-admin-products',
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
                  <a class="btn" [routerLink]="['/admin/products', product.id, 'edit']">Edit</a>
                  <button class="btn" type="button" (click)="deleteProduct(product.id)">Delete</button>
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
export class AdminProductsComponent {
  private readonly productsService = inject(ProductsService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  readonly products$ = this.refresh$.pipe(switchMap(() => this.productsService.listAdmin()));

  deleteProduct(productId: string): void {
    this.productsService.delete(productId).subscribe(() => this.refresh$.next());
  }
}
