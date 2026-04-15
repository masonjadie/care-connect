import { Component, OnInit } from '@angular/core';
import { ApiService, Contact, Reminder, Appointment } from '../../services/api.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  contacts: Contact[] = [];
  reminders: Reminder[] = [];
  appointments: Appointment[] = [];
  user: any = null;
  trialDaysRemaining: number | null = null;
  
  // Real-time tracking data
  userOrders: any[] = [];
  userBookings: any[] = [];
  loadingTracking = true;

  // Status mapping for visual progress
  statusSteps = ['pending', 'fulfilled', 'out_for_delivery', 'delivered'];
  tripSteps = ['booked', 'picked_up', 'on_route', 'dropped_off'];

  constructor(private api: ApiService, private analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.api.getContacts().subscribe({
      next: (data) => this.contacts = data,
      error: (error) => console.error('Failed to load contacts', error)
    });

    this.api.getReminders().subscribe({
      next: (data) => this.reminders = data,
      error: (error) => console.error('Failed to load reminders', error)
    });

    const userStr = localStorage.getItem('careconnect_user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.calculateTrial();
      this.loadUserTracking();
    }

    this.loadAppointments();
  }

  calculateTrial(): void {
    if (this.user?.trial_ends_at) {
      const ends = new Date(this.user.trial_ends_at);
      const now = new Date();
      const diff = ends.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      this.trialDaysRemaining = days > 0 ? days : 0;
    }
  }

  loadAppointments(): void {
    this.api.getAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: (error) => console.error('Failed to load appointments', error)
    });
  }

  loadUserTracking(): void {
    if (!this.user?.id) return;
    this.loadingTracking = true;

    this.analytics.getUserOrders(this.user.id).subscribe({
      next: (orders) => {
        this.userOrders = orders;
        this.loadingTracking = false;
      },
      error: () => this.loadingTracking = false
    });

    this.analytics.getUserBookings(this.user.id).subscribe({
      next: (bookings) => this.userBookings = bookings,
      error: (err) => console.error('Failed to load bookings', err)
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.api.deleteAppointment(id).subscribe({
        next: () => this.loadAppointments(),
        error: (error) => console.error('Failed to delete appointment', error)
      });
    }
  }

  // Helper methods for UI
  getStatusProgress(status: string): number {
    const idx = this.statusSteps.indexOf(status);
    return ((idx + 1) / this.statusSteps.length) * 100;
  }

  getTripProgress(status: string): number {
    const idx = this.tripSteps.indexOf(status);
    return ((idx + 1) / this.tripSteps.length) * 100;
  }

  getStatusLabel(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Categorized Getters
  get categorizedRideBookings(): any[] {
    return this.userBookings || [];
  }

  get categorizedMealOrders(): any[] {
    return this.userOrders.filter(o => o.item_type === 'meal');
  }

  get categorizedPrescriptionOrders(): any[] {
    return this.userOrders.filter(o => o.item_type === 'prescription');
  }

  get categorizedProfessionalCare(): any[] {
    return this.userOrders.filter(o => 
      o.item_type === 'caregiver_request' || 
      o.item_type === 'pet_specialist_request'
    );
  }
}
