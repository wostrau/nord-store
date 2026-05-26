import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let authService: { signup: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      signup: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();
  });

  function createComponent(): ComponentFixture<SignupComponent> {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the backend error and resets submit state when signup fails', () => {
    authService.signup.mockReturnValue(throwError(() => ({
      error: { message: 'Passwords do not match.' }
    })));
    const fixture = createComponent();

    fixture.componentInstance.form.setValue({
      email: 'user@example.com',
      password: 'password',
      confirmPassword: 'different-password'
    });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(fixture.componentInstance.isSubmitting()).toBe(false);
    expect(fixture.componentInstance.errorMessage()).toBe('Passwords do not match.');
    expect(button.disabled).toBe(false);
    expect(button.textContent?.trim()).toBe('Signup');
    expect(fixture.nativeElement.textContent).toContain('Passwords do not match.');
  });
});
