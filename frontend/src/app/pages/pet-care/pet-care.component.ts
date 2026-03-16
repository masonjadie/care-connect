import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pet-care',
  templateUrl: './pet-care.component.html',
  styleUrls: ['./pet-care.component.scss']
})
export class PetCareComponent implements OnInit {
  services = [
    {
      title: 'Medical Alert Service Dogs',
      description: 'Specially trained companions that detect seizures, diabetic changes, or provide stability for mobility.',
      icon: '🐕‍🦺',
      features: ['24/7 Monitoring', 'Mobility Assistance', 'Emergency Alert Training']
    },
    {
      title: 'Therapeutic Pet Visits',
      description: 'Scheduled visits from certified therapy animals to improve emotional well-being and reduce stress.',
      icon: '🐈',
      features: ['Certified Handlers', 'Emotional Support', 'Stress Reduction']
    },
    {
      title: 'Senior Pet Support',
      description: 'Mobile veterinary care and grooming services tailored for the pets of elderly owners.',
      icon: '🦴',
      features: ['In-home Grooming', 'Vet Check-ups', 'Pet Med Management']
    }
  ];

  conditionMatches = [
    {
      condition: 'Diabetes',
      petType: 'Diabetic Alert Dog (DAD)',
      benefit: 'Trained to detect blood sugar highs and lows via scent before they become dangerous.'
    },
    {
      condition: 'Epilepsy & Seizures',
      petType: 'Seizure Response Dog',
      benefit: 'Can fetch help, clear the area, or provide physical support during and after a seizure.'
    },
    {
      condition: 'Mobility & Arthritis',
      petType: 'Mobility/Stability Dog',
      benefit: 'Assists with balance, opening doors, retrieving dropped items, and providing physical bracing.'
    },
    {
      condition: 'Anxiety & PTSD',
      petType: 'Psychiatric Service Dog',
      benefit: 'Provides grounding, interrupts panic attacks, and offers deep pressure therapy.'
    },
    {
      condition: 'Hearing Impairment',
      petType: 'Hearing Dog',
      benefit: 'Alerts owners to sounds like doorbells, smoke alarms, or their name being called.'
    },
    {
      condition: 'Chronic Loneliness',
      petType: 'Emotional Support Animal',
      benefit: 'Provides companionship and a routine that significantly improves mental well-on seniors.'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
