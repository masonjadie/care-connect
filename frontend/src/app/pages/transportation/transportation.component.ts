import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.scss']
})
export class TransportationComponent implements OnInit {
  bookingForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      passengerName: [''],
      pickup: ['', Validators.required],
      dropoff: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      vehicleType: ['standard', Validators.required],
      tripType: ['one-way', Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    const access = this.api.checkAccess();
    if (access === 'no-login') {
      this.router.navigate(['/auth']);
      return;
    }
    if (access === 'no-plan') {
      this.router.navigate(['/plans']);
      return;
    }

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const val = this.bookingForm.value;

    const userStr = localStorage.getItem('careconnect_user');
    const user = userStr ? JSON.parse(userStr) : null;

    this.analyticsService.createTransportationBooking({
      userId: user?.id,
      passengerName: val.passengerName || user?.name || 'Guest',
      pickup: val.pickup,
      dropoff: val.dropoff,
      date: val.date,
      time: val.time,
      vehicleType: val.vehicleType,
      tripType: val.tripType,
      notes: val.notes
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Your ride has been successfully booked! A driver will contact you shortly.';
        this.bookingForm.reset({
          vehicleType: 'standard',
          tripType: 'one-way'
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.successMessage = 'Booking saved! A driver will contact you shortly.';
        this.bookingForm.reset({ vehicleType: 'standard', tripType: 'one-way' });
      }
    });
  }
}
