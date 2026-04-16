import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  contacts = [{ name: 'Emma', relation: 'Daughter' }];
  
  showContactModal = false;
  newContactName = '';
  newContactRelation = '';

  constructor() {}

  openAddContactModal(): void {
    this.newContactName = '';
    this.newContactRelation = '';
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
  }

  saveContact(): void {
    if (this.newContactName.trim() && this.newContactRelation.trim()) {
      this.contacts.push({ 
        name: this.newContactName.trim(), 
        relation: this.newContactRelation.trim() 
      });
      this.showContactModal = false;
    }
  }

  showComingSoon = false;
  comingSoonMessage = '';

  reminders = [
    { icon: '💊', text: 'Blood Pressure', time: '8:00 AM' },
    { icon: '🏃', text: 'Stretching', time: '3:00 PM' }
  ];

  showReminderModal = false;
  newReminderText = '';
  newReminderTime = '';
  newReminderIcon = '⏰';

  openAddReminderModal(): void {
    this.newReminderText = '';
    this.newReminderTime = '';
    this.newReminderIcon = '⏰';
    this.showReminderModal = true;
  }

  closeReminderModal(): void {
    this.showReminderModal = false;
  }

  saveReminder(): void {
    if (this.newReminderText.trim() && this.newReminderTime.trim()) {
      this.reminders.push({
        icon: this.newReminderIcon,
        text: this.newReminderText.trim(),
        time: this.newReminderTime.trim()
      });
      this.showReminderModal = false;
    }
  }

  deleteReminder(index: number): void {
    this.reminders.splice(index, 1);
  }

  comingSoon(feature: string): void {
    this.comingSoonMessage = `${feature} feature is coming in our next major update!`;
    this.showComingSoon = true;
  }

  closeComingSoon(): void {
    this.showComingSoon = false;
  }

  showArticleModal = false;
  currentArticle = {
    title: '',
    content: ''
  };

  openArticle(): void {
    this.currentArticle = {
      title: '5 Easy Exercises for Joint Health',
      content: `Staying active is one of the best ways to maintain joint flexibility and reduce stiffness. Here are five easy exercises you can do anywhere: \n\n
1. **Shoulder Rolls**: Gently roll your shoulders forward, then backward to relieve tension.\n\n
2. **Wrist Rotations**: Extend your arms and rotate your wrists clockwise, then counterclockwise.\n\n
3. **Ankle Circles**: While seated, lift one foot off the ground and rotate your ankle slowly.\n\n
4. **Neck Stretches**: Gently tilt your head toward each shoulder, holding for a few seconds.\n\n
5. **Seated Leg Extensions**: Sitting in a chair, slowly extend your legs out straight and lower them down.\n\n
Always consult with your primary care provider before beginning any new exercise routine.`
    };
    this.showArticleModal = true;
  }

  closeArticleModal(): void {
    this.showArticleModal = false;
  }
}
