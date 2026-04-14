import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pet-care',
  templateUrl: './pet-care.component.html',
  styleUrls: ['./pet-care.component.scss']
})
export class PetCareComponent implements OnInit {
  services = [
    {
      id: 'medical-alert',
      title: 'Medical Alert Service Dogs',
      description: 'Specially trained companions that detect seizures, diabetic changes, or provide stability for mobility.',
      icon: '🐕‍🦺',
      image: 'service_dog_alert.webp',
      features: ['24/7 Monitoring', 'Mobility Assistance', 'Emergency Alert Training'],
      details: 'Our Service Dog program provides life-saving assistance for seniors managing chronic conditions. Each animal is specifically trained for 18-24 months to recognize metabolic changes or physical distress. We handle the matching process, certification, and ongoing training support to ensure a perfect partnership.',
      price: 'Starting from $1,200 (Grant assistance available)'
    },
    {
      id: 'therapy-visits',
      title: 'Therapeutic Pet Visits',
      description: 'Scheduled visits from certified therapy animals to improve emotional well-being and reduce stress.',
      icon: '🐈',
      image: 'therapy_cat.webp',
      features: ['Certified Handlers', 'Emotional Support', 'Stress Reduction'],
      details: 'Bring comfort directly to your door. Our therapy teams consist of a certified animal and a trained handler who facilitate interaction sessions designed to reduce cortisol levels and alleviate feelings of isolation. Perfect for home-bound seniors or those in assisted living communities.',
      price: '$45 / 60-minute session'
    },
    {
      id: 'senior-pet',
      title: 'Senior Pet Support',
      description: 'Mobile veterinary care and grooming services tailored for the pets of elderly owners.',
      icon: '🦴',
      image: 'senior_pet_care.webp',
      features: ['In-home Grooming', 'Vet Check-ups', 'Pet Med Management'],
      details: 'Caring for your own pet shouldn\'t be a burden. We provide full-service mobile support including grooming, routine veterinary check-ups, and medication management for your furry companions. We ensure your pets stay healthy so they can continue to support you.',
      price: 'Plans starting at $99/month'
    }
  ];

  conditionMatches = [
    {
      condition: 'Diabetes',
      petType: 'Diabetic Alert Dog (DAD)',
      benefit: 'Trained to detect blood sugar highs and lows via scent before they become dangerous.'
    },
    {
      condition: 'Epilepsy & Seizures',
      petType: 'Seizure Response Dog',
      benefit: 'Can fetch help, clear the area, or provide physical support during and after a seizure.'
    },
    {
      condition: 'Mobility & Arthritis',
      petType: 'Mobility/Stability Dog',
      benefit: 'Assists with balance, opening doors, retrieving dropped items, and providing physical bracing.'
    },
    {
      condition: 'Anxiety & PTSD',
      petType: 'Psychiatric Service Dog',
      benefit: 'Provides grounding, interrupts panic attacks, and offers deep pressure therapy.'
    },
    {
      condition: 'Hearing Impairment',
      petType: 'Hearing Dog',
      benefit: 'Alerts owners to sounds like doorbells, smoke alarms, or their name being called.'
    },
    {
      condition: 'Chronic Loneliness',
      petType: 'Emotional Support Animal',
      benefit: 'Provides companionship and a routine that significantly improves mental well-on seniors.'
    }
  ];

  toastMessage = '';
  selectedService: any = null;

  constructor() { }

  ngOnInit(): void { }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3500);
  }

  learnMore(service: any): void {
    this.selectedService = service;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeModal(): void {
    this.selectedService = null;
    document.body.style.overflow = 'auto';
  }

  bookConsultation(): void {
    const serviceName = this.selectedService.title;
    this.closeModal();
    this.showToast(`📅 Consulting request for ${serviceName} sent!`);
    // Scroll to specialists registration
    document.getElementById('specialist-registration')?.scrollIntoView({ behavior: 'smooth' });
  }

  registerSpecialist(form: NgForm): void {
    if (form.invalid) {
      this.showToast('⚠️ Please fill in all required fields.');
      form.control.markAllAsTouched();
      return;
    }
    this.showToast('✅ Registration submitted! We\'ll reach out within 48 hours.');
    form.resetForm();
  }
}
