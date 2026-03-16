import { Component, OnInit } from '@angular/core';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  color: string;
}

@Component({
  selector: 'app-medication-reminder',
  templateUrl: './medication-reminder.component.html',
  styleUrls: ['./medication-reminder.component.scss']
})
export class MedicationReminderComponent implements OnInit {
  medications: Medication[] = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily (Morning)',
      nextDose: 'Tomorrow, 8:00 AM',
      color: 'blue'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily (With meals)',
      nextDose: 'Today, 6:00 PM',
      color: 'green'
    },
    {
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily (Evening)',
      nextDose: 'Today, 9:00 PM',
      color: 'purple'
    },
    {
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Once daily',
      nextDose: 'Tomorrow, 8:00 AM',
      color: 'orange'
    }
  ];

  safetyTips: string[] = [
    'Always take your medication with a full glass of water unless directed otherwise.',
    'Do not crush or split pills without consulting your pharmacist.',
    'Keep a list of all your medications in your wallet for emergencies.',
    'Discard any medications that have passed their expiration date.'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
