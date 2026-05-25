import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  template: `
    <div class="backdrop" [class.visible]="menuOpen()" (click)="closeMenu()"></div>
    <header class="main-header">
      <button id="side-menu-toggle" type="button" (click)="toggleMenu()">Menu</button>
      <nav class="main-header__nav">
        <ul class="main-header__item-list">
          <li class="main-header__item"><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Shop</a></li>
          <li class="main-header__item"><a routerLink="/products" routerLinkActive="active">Products</a></li>
          @if (authService.user$ | async) {
            <li class="main-header__item"><a routerLink="/cart" routerLinkActive="active">Cart</a></li>
            <li class="main-header__item"><a routerLink="/orders" routerLinkActive="active">Orders</a></li>
            <li class="main-header__item"><a routerLink="/admin/products/new" routerLinkActive="active">Add Product</a></li>
            <li class="main-header__item"><a routerLink="/admin/products" routerLinkActive="active">Admin Products</a></li>
          }
        </ul>
        <ul class="main-header__item-list">
          @if (authService.user$ | async) {
            <li class="main-header__item"><button type="button" (click)="logout()">Logout</button></li>
          } @else {
            <li class="main-header__item"><a routerLink="/login" routerLinkActive="active">Login</a></li>
            <li class="main-header__item"><a routerLink="/signup" routerLinkActive="active">Signup</a></li>
          }
        </ul>
      </nav>
    </header>

    <nav class="mobile-nav" [class.open]="menuOpen()">
      <ul class="mobile-nav__item-list">
        <li class="mobile-nav__item"><a routerLink="/" (click)="closeMenu()">Shop</a></li>
        <li class="mobile-nav__item"><a routerLink="/products" (click)="closeMenu()">Products</a></li>
        @if (authService.user$ | async) {
          <li class="mobile-nav__item"><a routerLink="/cart" (click)="closeMenu()">Cart</a></li>
          <li class="mobile-nav__item"><a routerLink="/orders" (click)="closeMenu()">Orders</a></li>
          <li class="mobile-nav__item"><a routerLink="/admin/products/new" (click)="closeMenu()">Add Product</a></li>
          <li class="mobile-nav__item"><a routerLink="/admin/products" (click)="closeMenu()">Admin Products</a></li>
          <li class="mobile-nav__item"><button type="button" (click)="logout()">Logout</button></li>
        } @else {
          <li class="mobile-nav__item"><a routerLink="/login" (click)="closeMenu()">Login</a></li>
          <li class="mobile-nav__item"><a routerLink="/signup" (click)="closeMenu()">Signup</a></li>
        }
      </ul>
    </nav>
  `
})
export class HeaderComponent {
  readonly menuOpen = signal(false);

  constructor(
    readonly authService: AuthService,
    private readonly router: Router
  ) {}

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    void this.router.navigate(['/']);
  }
}
