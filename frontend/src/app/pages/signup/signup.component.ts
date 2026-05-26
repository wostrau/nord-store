import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-signup',
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
        <div class="form-control">
          <label for="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" formControlName="confirmPassword">
        </div>
        @if (errorMessage()) {
          <p class="form-error">{{ errorMessage() }}</p>
        }
        <button class="btn" type="submit" [disabled]="form.invalid || isSubmitting()">
          {{ isSubmitting() ? 'Signing up...' : 'Signup' }}
        </button>
        <a class="form-link" routerLink="/login">Use existing account</a>
      </form>
    </main>
  `
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);
    const value = this.form.getRawValue();

    this.authService.signup(value.email, value.password, value.confirmPassword).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => void this.router.navigate(['/']),
      error: (error) => {
        this.errorMessage.set(error.error?.message ?? 'Signup failed.');
      }
    });
  }
}
