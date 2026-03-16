import { Component, OnInit } from '@angular/core';
import { ApiService, Service } from '../../services/api.service';

interface ServiceCard extends Service {
  icon: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  services: ServiceCard[] = [];

  private serviceMeta: Record<string, { icon: string; features: string[]; color: string }> = {
    'Professional Caregiving': {
      icon: '👩‍⚕️',
      features: ['24/7 Availability', 'Background Checked', 'Specialized Dementia Care'],
      color: 'orange'
    },
    'Reliable Transportation': {
      icon: '🚗',
      features: ['Wheelchair Accessible', 'Door-to-Door Service', 'Scheduled Pickups'],
      color: 'teal'
    },
    'Nutritious Meal Delivery': {
      icon: '🍲',
      features: ['Dietary Planning', 'Fresh Ingredients', 'Contactless Delivery'],
      color: 'blue'
    },
    'Medication Management': {
      icon: '💊',
      features: ['Smart Reminders', 'Pharmacist Consultation', 'Refill Tracking'],
      color: 'purple'
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
            color: 'blue'
          };

          return {
            ...service,
            icon: meta.icon,
            features: meta.features,
            color: meta.color
          };
        });
      },
      error: (error) => {
        console.error('Failed to load services', error);
      }
    });
  }
}
