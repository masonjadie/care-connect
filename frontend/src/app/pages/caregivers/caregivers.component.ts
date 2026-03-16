import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ApiService,
  Caregiver,
  CaregiverRegistrationPayload
} from '../../services/api.service';

@Component({
  selector: 'app-caregivers',
  templateUrl: './caregivers.component.html',
  styleUrls: ['./caregivers.component.scss']
})
export class CaregiversComponent implements OnInit {
  caregivers: Caregiver[] = [];
  caregiverSuccessMessage = '';
  caregiverErrorMessage = '';
  caregiverSubmitting = false;
  myProfile: Caregiver | null = null;
  currentUserEmail = '';

  caregiverForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required]],
    specialty: ['', [Validators.required]],
    experienceYears: [1, [Validators.required, Validators.min(0), Validators.max(60)]],
    certification: ['', [Validators.required]],
    location: ['', [Validators.required]],
    availability: ['', [Validators.required]],
    bio: ['', [Validators.required, Validators.minLength(20)]]
  });

  constructor(private api: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('careconnect_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserEmail = user.email;
      this.caregiverForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
    this.loadCaregivers();
  }

  loadCaregivers(): void {
    this.api.getCaregivers().subscribe({
      next: (caregivers) => {
        this.caregivers = caregivers;
        if (this.currentUserEmail) {
          this.myProfile = caregivers.find(c => c.email.toLowerCase() === this.currentUserEmail.toLowerCase()) || null;
        }
      },
      error: (error) => {
        console.error('Failed to load caregivers', error);
      }
    });
  }

  submitCaregiverForm(): void {
    this.caregiverSuccessMessage = '';
    this.caregiverErrorMessage = '';

    if (this.caregiverForm.invalid) {
      this.caregiverForm.markAllAsTouched();
      return;
    }

    this.caregiverSubmitting = true;
    const formValue = this.caregiverForm.getRawValue();
    const payload: CaregiverRegistrationPayload = {
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      phone: formValue.phone ?? '',
      specialty: formValue.specialty ?? '',
      experienceYears: Number(formValue.experienceYears ?? 0),
      certification: formValue.certification ?? '',
      location: formValue.location ?? '',
      availability: formValue.availability ?? '',
      bio: formValue.bio ?? ''
    };

    this.api.registerCaregiver(payload).subscribe({
      next: (response) => {
        this.caregiverSubmitting = false;
        this.caregiverSuccessMessage = response.message;
        this.caregiverForm.reset({
          name: '',
          email: '',
          password: '',
          phone: '',
          specialty: '',
          experienceYears: 1,
          certification: '',
          location: '',
          availability: '',
          bio: ''
        });
        this.loadCaregivers();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.caregiverSubmitting = false;
        this.caregiverErrorMessage =
          error?.error?.error ||
          (error?.status === 0
            ? 'Backend is unavailable. Start the backend server and try again.'
            : 'Caregiver registration failed.');
      }
    });
  }
}
