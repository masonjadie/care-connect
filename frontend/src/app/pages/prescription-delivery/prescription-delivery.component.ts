import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prescription-delivery',
  templateUrl: './prescription-delivery.component.html',
  styleUrls: ['./prescription-delivery.component.scss']
})
export class PrescriptionDeliveryComponent implements OnInit {
  prescriptionForm: FormGroup;
  submitted = false;
  successMessage = '';
  autoRefillEnabled = false;

  howItWorks = [
    { step: '1', icon: '📸', title: 'Upload Prescription', desc: 'Take a photo of your prescription or upload it from your device.' },
    { step: '2', icon: '✅', title: 'We Verify & Fill', desc: 'Our licensed pharmacists verify and prepare your medication.' },
    { step: '3', icon: '🚚', title: 'Delivered to You', desc: 'Medications are packaged safely and delivered to your door.' }
  ];

  benefits = [
    { icon: '🔒', title: 'Safe & Secure', desc: 'HIPAA-compliant handling of all your prescription data.' },
    { icon: '⏱️', title: 'Same-Day Delivery', desc: 'Prescriptions submitted before noon can arrive the same day.' },
    { icon: '💬', title: 'Pharmacist Support', desc: 'Chat or call a licensed pharmacist anytime, 7 days a week.' },
    { icon: '♻️', title: 'Auto-Refills', desc: 'Set up automatic refills so you never run out of your medication.' }
  ];

  refillFrequencies = ['Every 30 days', 'Every 60 days', 'Every 90 days', 'Custom'];
  durationUnits = ['Days', 'Weeks', 'Months'];

  constructor(private fb: FormBuilder) {
    this.prescriptionForm = this.fb.group({
      patientName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      doctorName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      deliveryAddress: ['', Validators.required],
      notes: [''],
      // Auto-refill fields
      autoRefill: [false],
      medicationDuration: [''],
      durationUnit: ['Days'],
      refillFrequency: ['Every 30 days'],
      // Payment fields
      enableRecurringPayment: [false],
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      billingAddress: ['']
    });
  }

  ngOnInit(): void {
    // Toggle required validators for auto-refill and payment fields
    this.f['autoRefill'].valueChanges.subscribe((enabled: boolean) => {
      this.autoRefillEnabled = enabled;
      if (enabled) {
        this.f['medicationDuration'].setValidators([Validators.required]);
      } else {
        this.f['medicationDuration'].clearValidators();
      }
      this.f['medicationDuration'].updateValueAndValidity();
    });

    this.f['enableRecurringPayment'].valueChanges.subscribe((enabled: boolean) => {
      const paymentFields = ['cardholderName', 'cardNumber', 'expiryDate', 'cvv', 'billingAddress'];
      paymentFields.forEach(field => {
        if (enabled) {
          this.f[field].setValidators([Validators.required]);
        } else {
          this.f[field].clearValidators();
        }
        this.f[field].updateValueAndValidity();
      });
    });
  }

  get f() { return this.prescriptionForm.controls; }
  get recurringPaymentEnabled() { return this.f['enableRecurringPayment'].value; }

  onSubmit(): void {
    this.submitted = true;
    if (this.prescriptionForm.invalid) return;

    const autoRefill = this.f['autoRefill'].value;
    const recurring = this.f['enableRecurringPayment'].value;

    let msg = `Thank you, ${this.f['patientName'].value}! Your prescription request has been received.`;
    if (autoRefill) {
      msg += ` Auto-refill is set for ${this.f['medicationDuration'].value} ${this.f['durationUnit'].value} (${this.f['refillFrequency'].value}).`;
    }
    if (recurring) {
      msg += ' Recurring payment has been set up securely.';
    }
    msg += ' Our pharmacist will contact you shortly.';

    this.successMessage = msg;
    this.prescriptionForm.reset();
    this.submitted = false;
    this.autoRefillEnabled = false;
    setTimeout(() => this.successMessage = '', 8000);
  }
}
