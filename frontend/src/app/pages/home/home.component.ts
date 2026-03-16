import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  contacts = [{ name: 'Emma', relation: 'Daughter' }];

  constructor() {}

  addContact(): void {
    const name = prompt('Enter contact name:');
    const relation = prompt('Enter relationship:');

    if (name && relation) {
      this.contacts.push({ name, relation });
    }
  }
}
