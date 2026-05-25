import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main>
      <form class="login-form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-control">
          <label for="email">E-Mail</label>
          <input id="email" type="email" formControlName="email">
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password">
        </div>
        @if (errorMessage) {
          <p class="form-error">{{ errorMessage }}</p>
        }
        <button class="btn" type="submit" [disabled]="form.invalid || isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
        <a class="form-link" routerLink="/signup">Create account</a>
      </form>
    </main>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  errorMessage = '';
  isSubmitting = false;
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.authService.login(this.form.value.email ?? '', this.form.value.password ?? '').subscribe({
      next: () => void this.router.navigate(['/']),
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Login failed.';
        this.isSubmitting = false;
      }
    });
  }
}
