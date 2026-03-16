import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.scss']
})
export class TransportationComponent implements OnInit {
  bookingForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
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
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Your ride has been successfully booked! A driver will contact you shortly.';
      this.bookingForm.reset({
        vehicleType: 'standard',
        tripType: 'one-way'
      });
    }, 1500);
  }
}
