import { Component, OnInit } from '@angular/core';
import { ApiService, Contact } from '../../services/api.service';
import { AccessibilityService } from 'src/app/core/services/accessibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss']
})
export class EmergencyComponent implements OnInit {
  showModal = false;
  alertSent = false;
  alertMessage = '';

  contacts: Contact[] = [];
  private voiceSub?: Subscription;

  emergencyResources = [
    { title: 'Local Emergency', number: '911', icon: '🚓' },
    { title: 'Poison Control', number: '1-800-222-1222', icon: '🧪' },
    { title: 'Non-Emergency Police', number: '(555) 111-0000', icon: '📞' }
  ];

  survivalTips = [
    { title: 'Stay Calm', text: 'Take deep breaths. Panicking can cloud judgment.' },
    { title: 'Safe Position', text: 'If you feel faint, sit or lie down on the floor immediately.' },
    { title: 'Identify Hazards', text: 'Check for smoke, fire, or other immediate dangers around you.' }
  ];

  locationInfo = {
    address: '123 Care Street, Springfield, ST 12345',
    coords: '37.7749 N, 122.4194 W',
    status: 'Tracking Active'
  };

  constructor(
    private api: ApiService,
    private a11y: AccessibilityService
  ) {}

  ngOnInit(): void {
    this.api.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (error) => {
        console.error('Failed to load contacts', error);
      }
    });

    // Listen for voice commands
    this.voiceSub = this.a11y.commandEmitted$.subscribe(command => {
      if (command.includes('sos') || command.includes('alert') || command.includes('help')) {
        this.a11y.speak('Emergency detected. Triggering SOS alert now.');
        this.triggerSOS();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.voiceSub) {
      this.voiceSub.unsubscribe();
    }
  }

  openSOS(): void {
    this.showModal = true;
  }

  closeSOS(): void {
    this.showModal = false;
  }

  triggerSOS(): void {
    this.api
      .sendEmergency({
        message: 'Emergency SOS triggered from frontend',
        location: this.locationInfo.address
      })
      .subscribe({
        next: (response) => {
          this.alertMessage = response.message;
          this.showModal = false;
          this.alertSent = true;
        },
        error: (error) => {
          console.error('Failed to send emergency alert', error);
        }
      });
  }
}
