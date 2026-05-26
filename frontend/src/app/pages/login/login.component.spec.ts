import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { AuthService } from '../../core/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authService: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();
  });

  function createComponent(): ComponentFixture<LoginComponent> {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the backend error and resets submit state when login fails', () => {
    authService.login.mockReturnValue(throwError(() => ({
      error: { message: 'Invalid email or password.' }
    })));
    const fixture = createComponent();

    fixture.componentInstance.form.setValue({
      email: 'user@example.com',
      password: 'wrong-password'
    });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(fixture.componentInstance.isSubmitting()).toBe(false);
    expect(fixture.componentInstance.errorMessage()).toBe('Invalid email or password.');
    expect(button.disabled).toBe(false);
    expect(button.textContent?.trim()).toBe('Login');
    expect(fixture.nativeElement.textContent).toContain('Invalid email or password.');
  });
});
