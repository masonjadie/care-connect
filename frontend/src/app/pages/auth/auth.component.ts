import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  loading = false;
  successMessage = '';
  errorMessage = '';

  authForm = this.fb.group({
    name: [''],
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { }

  setMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.successMessage = '';
    this.errorMessage = '';

    const nameControl = this.authForm.get('name');
    if (this.mode === 'register') {
      nameControl?.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      nameControl?.clearValidators();
    }
    nameControl?.updateValueAndValidity();
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.mode === 'login') {
      this.authForm.get('name')?.setValue('');
    }

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const identifier = this.authForm.value.identifier ?? '';
    const password = this.authForm.value.password ?? '';
    const name = this.authForm.value.name ?? '';

    // ADVANCED VALIDATION
    const lettersOnly = password.replace(/[0-9]/g, '');
    if (lettersOnly.length < 7) {
      this.errorMessage = 'Password must contain at least 7 letters or symbols (numbers are allowed but don\'t count toward the required length).';
      return;
    }

    if (this.mode === 'register' && !identifier.includes('@')) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;

    const request$ =
      this.mode === 'register'
        ? this.api.register({ name, email: identifier, password })
        : this.api.login({ email: identifier, password });

    request$.subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
        this.errorMessage = '';
        localStorage.setItem('careconnect_user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('careconnect_token', response.token);
        }
        const user = response.user;
        const targetRoute = (user.role === 'admin' || user.email === 'admin@careconnect.com') ? '/admin' : '/dashboard';
        this.router.navigate([targetRoute]);
      },
      error: (error) => {
        this.loading = false;
        if (error?.status === 0) {
          this.errorMessage = 'Cannot reach backend API. Start backend server on port 3000.';
          return;
        }

        // Handle specific friendly error from backend (lockout, attempts, etc)
        this.errorMessage =
          error?.error?.error ||
          error?.error?.message ||
          'Request failed. Please try again.';
      }
    });
  }
}
