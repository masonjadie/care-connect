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
    const defaultServices: Service[] = [
      { id: 1, title: 'Professional Caregiving', description: 'Certified caregivers providing daily assistance and specialized care.' },
      { id: 2, title: 'Reliable Transportation', description: 'Safe, accessible rides for medical appointments and errands.' },
      { id: 3, title: 'Nutritious Meal Delivery', description: 'Dietician-approved meals delivered directly to your door.' },
      { id: 4, title: 'Medication Management', description: 'Never miss a dose with our automated reminders and pharmacy sync.' },
      { id: 5, title: 'Service Animal & Pet Care', description: 'Support for your furry companions, plus service animal matching.' },
      { id: 6, title: 'Prescription Delivery', description: 'Fast, secure delivery of your essential medications.' }
    ];

    this.api.getServices().subscribe({
      next: (data) => {
        const finalData = Array.isArray(data) && data.length > 0 ? data : defaultServices;
        this.services = finalData.map((service) => {
          const meta = this.serviceMeta[service.title] ?? {
            icon: '✅',
            features: ['Professional support', 'Personalized care', 'Trusted providers'],
            color: 'blue',
            route: '/contact-us'
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
        this.services = defaultServices.map((service) => {
          const meta = this.serviceMeta[service.title] ?? {
            icon: '✅',
            features: ['Professional support', 'Personalized care', 'Trusted providers'],
            color: 'blue',
            route: '/contact-us'
          };
          return { ...service, icon: meta.icon, features: meta.features, color: meta.color, route: meta.route };
        });
      }
    });
  }
}
