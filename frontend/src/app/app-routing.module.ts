import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmergencyComponent } from './pages/emergency/emergency.component';
import { ServicesComponent } from './pages/services/services.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthComponent } from './pages/auth/auth.component';
import { CaregiversComponent } from './pages/caregivers/caregivers.component';
import { AuthGuard } from './guards/auth.guard';
import { PetCareComponent } from './pages/pet-care/pet-care.component';
import { MealDeliveryComponent } from './pages/meal-delivery/meal-delivery.component';
import { TransportationComponent } from './pages/transportation/transportation.component';
import { MedicationReminderComponent } from './pages/medication-reminder/medication-reminder.component';
import { PrescriptionDeliveryComponent } from './pages/prescription-delivery/prescription-delivery.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'emergency', component: EmergencyComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'pet-care', component: PetCareComponent },
  { path: 'meal-delivery', component: MealDeliveryComponent },
  { path: 'transportation', component: TransportationComponent },
  { path: 'medication-reminder', component: MedicationReminderComponent },
  { path: 'prescription-delivery', component: PrescriptionDeliveryComponent },
  { path: 'caregivers', component: CaregiversComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '/auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
