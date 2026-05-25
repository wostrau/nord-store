import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import type { Product } from '../../core/api.types';
import { ProductsService } from '../../core/products.service';

@Component({
  selector: 'app-product-form',
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    <main>
      @if (product$ | async) {}
      <form class="product-form" [formGroup]="form" (ngSubmit)="save()">
        <div class="form-control">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title">
        </div>
        <div class="form-control">
          <label for="imageUrl">Image URL</label>
          <input id="imageUrl" type="text" formControlName="imageUrl">
        </div>
        <div class="form-control">
          <label for="price">Price</label>
          <input id="price" type="number" step="0.01" formControlName="price">
        </div>
        <div class="form-control">
          <label for="description">Description</label>
          <textarea id="description" rows="5" formControlName="description"></textarea>
        </div>
        <button class="btn" type="submit" [disabled]="form.invalid">
          {{ productId ? 'Update Product' : 'Add Product' }}
        </button>
      </form>
    </main>
  `
})
export class ProductFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  productId = '';
  product$: Observable<Product | null> = of(null);
  readonly form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    imageUrl: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      tap((id) => {
        this.productId = id;
      }),
      switchMap((id) => (id ? this.productsService.get(id).pipe(map(({ product }) => product)) : of(null))),
      tap((product) => {
        if (product) {
          this.form.patchValue(product);
        }
      })
    );
  }

  save(): void {
    const payload = this.form.getRawValue();
    const request = this.productId
      ? this.productsService.update(this.productId, payload)
      : this.productsService.create(payload);

    request.subscribe(() => {
      void this.router.navigate(['/admin/products']);
    });
  }
}
