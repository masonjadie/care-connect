import { Component, OnInit } from '@angular/core';
import { ApiService, Contact, Reminder, Appointment } from '../../services/api.service';

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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (error) => {
        console.error('Failed to load contacts', error);
      }
    });

    this.api.getReminders().subscribe({
      next: (data) => {
        this.reminders = data;
      },
      error: (error) => {
        console.error('Failed to load reminders', error);
      }
    });

    const userStr = localStorage.getItem('careconnect_user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.calculateTrial();
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
      next: (data) => {
        this.appointments = data;
      },
      error: (error) => {
        console.error('Failed to load appointments', error);
      }
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.api.deleteAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Failed to delete appointment', error);
        }
      });
    }
  }
}
