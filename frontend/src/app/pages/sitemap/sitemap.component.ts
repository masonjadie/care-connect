import { Component } from '@angular/core';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent {
  links = [
    { label: 'Home', url: '/' },
    { label: 'Services', url: '/services' },
    { label: 'Meal Delivery', url: '/meal-delivery' },
    { label: 'Medication Reminder', url: '/medication-reminder' },
    { label: 'Pet Care', url: '/pet-care' },
    { label: 'Prescription Delivery', url: '/prescription-delivery' },
    { label: 'Transportation', url: '/transportation' },
    { label: 'Contact Us', url: '/contact-us' },
  ];
}
