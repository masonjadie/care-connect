import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
}

export interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
}

export interface Reminder {
  id: number;
  title: string;
  time: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
}

export interface EmergencyAlertResponse {
  message: string;
  alert: {
    id: number;
    message: string;
    location: string;
    createdAt: string;
  };
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: any;
  token?: string;
}

export interface Caregiver {
  id: number;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  availability: string;
  phone: string;
  bio: string;
  certification: string;
  location: string;
  email: string;
  verified?: number;
}

export interface CaregiverRegistrationPayload {
  name: string;
  specialty: string;
  experienceYears: number;
  availability: string;
  phone: string;
  bio: string;
  certification: string;
  location: string;
  email: string;
  password?: string;
}

export interface CaregiverRegistrationResponse {
  message: string;
  caregiver: Caregiver;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`);
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/contacts`);
  }

  getReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/reminders`);
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }

  sendEmergency(payload?: { message?: string; location?: string }): Observable<EmergencyAlertResponse> {
    return this.http.post<EmergencyAlertResponse>(`${this.apiUrl}/emergency`, payload ?? {});
  }

  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload);
  }

  getCaregivers(): Observable<Caregiver[]> {
    return this.http.get<Caregiver[]>(`${this.apiUrl}/caregivers`);
  }

  registerCaregiver(
    payload: CaregiverRegistrationPayload
  ): Observable<CaregiverRegistrationResponse> {
    return this.http.post<CaregiverRegistrationResponse>(`${this.apiUrl}/caregivers`, payload);
  }

  updateSubscription(userId: number, tier: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subscriptions/update`, { userId, tier });
  }

  startTrial(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subscriptions/start-trial`, { userId });
  }

  /**
   * Central helper to check if the current visitor can use a feature.
   * Returns 'authorized', 'no-login', or 'no-plan'
   */
  checkAccess(): 'authorized' | 'no-login' | 'no-plan' {
    const userStr = localStorage.getItem('careconnect_user');
    if (!userStr) return 'no-login';
    
    try {
      const user = JSON.parse(userStr);
      // Admin bypass
      if (user.role === 'admin' || user.email === 'admin@careconnect.com') return 'authorized';
      
      const tier = user.subscription_tier || user.subscriptionTier;
      const trialEndsAt = user.trial_ends_at || user.trialEndsAt;

      // Robust check for any plan selection
      const hasPaidPlan = tier && !['none', 'free', ''].includes(tier.toLowerCase());
      
      // Check for active trial
      let hasActiveTrial = false;
      if (trialEndsAt) {
        const expiry = new Date(trialEndsAt).getTime();
        hasActiveTrial = expiry > Date.now();
      }

      if (hasPaidPlan || hasActiveTrial || tier === 'trial') return 'authorized';
      
      // If none of the above, they need to select a plan (or are on free tier and trying a paid feature)
      return 'no-plan';
    } catch (e) {
      return 'no-login';
    }
  }
}
