import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmergencyComponent } from './pages/emergency/emergency.component';
import { ServicesComponent } from './pages/services/services.component';
import { AboutComponent } from './pages/about/about.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthComponent } from './pages/auth/auth.component';
import { CaregiversComponent } from './pages/caregivers/caregivers.component';
import { AuthOverlayComponent } from './shared/auth-overlay/auth-overlay.component';
import { PetCareComponent } from './pages/pet-care/pet-care.component';
import { TransportationComponent } from './pages/transportation/transportation.component';
import { MedicationReminderComponent } from './pages/medication-reminder/medication-reminder.component';
import { MealDeliveryComponent } from './pages/meal-delivery/meal-delivery.component';
import { PrescriptionDeliveryComponent } from './pages/prescription-delivery/prescription-delivery.component';
import { ChatAssistantComponent } from './shared/chat-assistant/chat-assistant.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    EmergencyComponent,
    ServicesComponent,
    AboutComponent,
    AuthComponent,
    CaregiversComponent,
    NavbarComponent,
    FooterComponent,
    AuthOverlayComponent,
    PetCareComponent,
    TransportationComponent,
    MedicationReminderComponent,
    MealDeliveryComponent,
    PrescriptionDeliveryComponent,
    ChatAssistantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
