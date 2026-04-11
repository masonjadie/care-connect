import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { SubscriptionGuard } from '../guards/subscription.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), data: { title: 'Home | CareConnect Hub' } },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), data: { title: 'Home | CareConnect Hub' } },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Dashboard | CareConnect Hub' } },
  { path: 'emergency', loadChildren: () => import('./emergency/emergency.module').then(m => m.EmergencyModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Emergency SOS | CareConnect Hub' } },
  { path: 'services', loadChildren: () => import('./services/services.module').then(m => m.ServicesModule), data: { title: 'Our Services | CareConnect Hub' } },
  { path: 'pet-care', loadChildren: () => import('./pet-care/pet-care.module').then(m => m.PetCareModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Service Animal Care | CareConnect Hub' } },
  { path: 'meal-delivery', loadChildren: () => import('./meal-delivery/meal-delivery.module').then(m => m.MealDeliveryModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Meal Delivery | CareConnect Hub' } },
  { path: 'transportation', loadChildren: () => import('./transportation/transportation.module').then(m => m.TransportationModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Transportation | CareConnect Hub' } },
  { path: 'medication-reminder', loadChildren: () => import('./medication-reminder/medication-reminder.module').then(m => m.MedicationReminderModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Medication Reminders | CareConnect Hub' } },
  { path: 'prescription-delivery', loadChildren: () => import('./prescription-delivery/prescription-delivery.module').then(m => m.PrescriptionDeliveryModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Prescription Delivery | CareConnect Hub' } },
  { path: 'plans', loadChildren: () => import('./plans/plans.module').then(m => m.PlansModule), canActivate: [AuthGuard], data: { title: 'Choose Your Plan | CareConnect Hub' } },
  { path: 'caregivers', loadChildren: () => import('./caregivers/caregivers.module').then(m => m.CaregiversModule), canActivate: [AuthGuard, SubscriptionGuard], data: { title: 'Caregiver Directory | CareConnect Hub' } },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule), data: { title: 'About Us | CareConnect Hub' } },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), data: { title: 'Login or Register | CareConnect Hub' } },
  { path: 'contact-us', loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule), data: { title: 'Contact Us | CareConnect Hub' } },
  { path: 'sitemap', loadChildren: () => import('./sitemap/sitemap.module').then(m => m.SitemapModule), data: { title: 'Sitemap | CareConnect Hub' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
