import { Component, OnInit } from '@angular/core';
import { ApiService, Contact, Reminder } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  contacts: Contact[] = [];
  reminders: Reminder[] = [];

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
  }
}
