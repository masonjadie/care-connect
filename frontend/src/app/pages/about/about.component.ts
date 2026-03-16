import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    team = [
        { name: 'Dr. Sarah Wilson', role: 'Medical Director', bio: 'Expert in geriatric care with over 15 years of experience.' },
        { name: 'James Miller', role: 'Head of Caregiving', bio: 'Passionate about providing compassionate support for seniors.' },
        { name: 'Emma Thompson', role: 'Nutrition Specialist', bio: 'Dedicated to designing healthy and delicious meal plans.' }
    ];

    values = [
        { title: 'Compassion', description: 'We treat every client with kindness, respect, and empathy.' },
        { title: 'Reliability', description: 'You can count on us to be there whenever you need support.' },
        { title: 'Quality', description: 'We provide the highest standard of care and professional services.' }
    ];
}
