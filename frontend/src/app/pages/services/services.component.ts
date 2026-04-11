import { Component, OnInit } from '@angular/core';
import { ApiService, Service } from '../../services/api.service';

interface ServiceCard extends Service {
  icon: string;
  features: string[];
  color: string;
  route: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: ServiceCard[] = [];

  private serviceMeta: Record<string, { icon: string; features: string[]; color: string; route: string }> = {
    'Professional Caregiving': {
      icon: '👩‍⚕️',
      features: ['24/7 Availability', 'Background Checked', 'Specialized Dementia Care'],
      color: 'orange',
      route: '/caregivers'
    },
    'Reliable Transportation': {
      icon: '🚗',
      features: ['Wheelchair Accessible', 'Door-to-Door Service', 'Scheduled Pickups'],
      color: 'teal',
      route: '/transportation'
    },
    'Nutritious Meal Delivery': {
      icon: '🍲',
      features: ['Dietary Planning', 'Fresh Ingredients', 'Contactless Delivery'],
      color: 'blue',
      route: '/meal-delivery'
    },
    'Medication Management': {
      icon: '💊',
      features: ['Smart Reminders', 'Pharmacist Consultation', 'Refill Tracking'],
      color: 'purple',
      route: '/medication-reminder'
    },
    'Service Animal & Pet Care': {
      icon: '🦮',
      features: ['Dog Walking & Exercise', 'Feeding & Grooming', 'Vet Visit Assistance'],
      color: 'green',
      route: '/pet-care'
    },
    'Prescription Delivery': {
      icon: '💉',
      features: ['Secure Courier Drop-off', 'Pharmacy Coordination', 'Auto-Refill Processing'],
      color: 'rose',
      route: '/prescription-delivery'
    }
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getServices().subscribe({
      next: (data) => {
        this.services = data.map((service) => {
          const meta = this.serviceMeta[service.title] ?? {
            icon: '✅',
            features: ['Professional support', 'Personalized care', 'Trusted providers'],
            color: 'blue',
            route: '/emergency'
          };

          return {
            ...service,
            icon: meta.icon,
            features: meta.features,
            color: meta.color,
            route: meta.route
          };
        });
      },
      error: (error) => {
        console.error('Failed to load services', error);
      }
    });
  }
}
