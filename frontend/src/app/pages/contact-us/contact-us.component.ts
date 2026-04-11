import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  submitted = false;
  successMessage = '';

  onSubmit(e: Event): void {
    e.preventDefault();
    this.submitted = true;
    setTimeout(() => {
      this.successMessage = 'Thank you for reaching out to us. We will get back to you shortly!';
      this.submitted = false;
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1500);
  }
}
