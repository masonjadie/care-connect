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
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        if (error?.status === 0) {
          this.errorMessage = 'Cannot reach backend API. Start backend server on port 3000.';
          return;
        }

        this.errorMessage =
          error?.error?.error ||
          error?.error?.message ||
          'Request failed. Please try again.';
      }
    });
  }
}
