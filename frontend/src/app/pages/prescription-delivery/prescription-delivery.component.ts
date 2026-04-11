import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prescription-delivery',
  templateUrl: './prescription-delivery.component.html',
  styleUrls: ['./prescription-delivery.component.scss']
})
export class PrescriptionDeliveryComponent implements OnInit {
  prescriptionForm: FormGroup;
  successMessage = '';
  submitted = false;
  toastMessage = '';
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
      patientName: [''],
      dateOfBirth: [''],
      doctorName: [''],
      phone: [''],
      deliveryAddress: [''],
      notes: [''],
      autoRefill: [false],
      medicationDuration: [''],
      durationUnit: ['Days'],
      refillFrequency: ['Every 30 days'],
      enableRecurringPayment: [false],
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      billingAddress: ['']
    });
  }

  ngOnInit(): void {
    this.f['autoRefill'].valueChanges.subscribe((enabled: boolean) => {
      this.autoRefillEnabled = enabled;
    });
  }

  get f() { return this.prescriptionForm.controls; }
  get recurringPaymentEnabled() { return this.f['enableRecurringPayment'].value; }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 5000);
  }

  onSubmit(): void {
    this.submitted = true;
    const missing: string[] = [];
    
    // Core fields
    if (!this.f['patientName'].value?.trim()) missing.push('Patient Name');
    if (!this.f['dateOfBirth'].value?.trim()) missing.push('Date of Birth');
    if (!this.f['doctorName'].value?.trim()) missing.push('Doctor Name');
    if (!this.f['phone'].value?.trim()) missing.push('Phone Number');
    if (!this.f['deliveryAddress'].value?.trim()) missing.push('Delivery Address');

    // Payment fields only if enabled
    if (this.f['enableRecurringPayment'].value) {
      if (!this.f['cardholderName'].value?.trim()) missing.push('Cardholder Name');
      if (!this.f['cardNumber'].value?.trim()) missing.push('Card Number');
      if (!this.f['expiryDate'].value?.trim()) missing.push('Expiry Date');
      if (!this.f['cvv'].value?.trim()) missing.push('CVV');
      if (!this.f['billingAddress'].value?.trim()) missing.push('Billing Address');
    }

    if (missing.length > 0) {
      this.showToast(`⚠️ Missing: ${missing.join(', ')}`);
      return; 
    }

    const name = this.f['patientName'].value;
    this.successMessage = `✅ Success! Thank you ${name}. Your request is being processed.`;
    this.showToast('✅ Prescription Request Submitted!');

    // Reset after success
    setTimeout(() => {
      this.prescriptionForm.reset({
        autoRefill: false,
        enableRecurringPayment: false,
        durationUnit: 'Days',
        refillFrequency: 'Every 30 days'
      });
      this.autoRefillEnabled = false;
      this.successMessage = '';
      this.submitted = false;
    }, 6000);
  }
}
