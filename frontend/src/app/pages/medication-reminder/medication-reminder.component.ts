import { Component, OnInit } from '@angular/core';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  color: string;
  taken?: boolean;
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

  toastMessage = '';

  constructor() { }

  ngOnInit(): void { }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3500);
  }

  showModal = false;
  isEditing = false;
  editingIndex = -1;
  currentMedication: Medication = {
    name: '',
    dosage: '',
    frequency: '',
    nextDose: '',
    color: 'blue'
  };

  markAsTaken(): void {
    const med = this.medications.find(m => m.name === 'Metformin');
    if (med) {
      med.taken = true;
      med.nextDose = 'Tomorrow, 6:00 PM';
      this.showToast('✅ Metformin (500mg) marked as taken!');
    }
  }

  editMedication(med: Medication, index: number): void {
    this.isEditing = true;
    this.editingIndex = index;
    this.currentMedication = { ...med };
    this.showModal = true;
  }

  addMedication(): void {
    this.isEditing = false;
    this.currentMedication = {
      name: '',
      dosage: '',
      frequency: '',
      nextDose: '',
      color: 'blue'
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveMedication(): void {
    if (this.currentMedication.name.trim() && this.currentMedication.dosage.trim()) {
      if (this.isEditing) {
        this.medications[this.editingIndex] = { ...this.currentMedication };
      } else {
        this.medications.push({ ...this.currentMedication });
      }
      this.showModal = false;
      this.showToast(this.isEditing ? '✏️ Medication updated!' : '➕ Medication added!');
    }
  }

  deleteMedication(): void {
    if (this.isEditing && this.editingIndex !== -1) {
      this.medications.splice(this.editingIndex, 1);
      this.showModal = false;
      this.showToast('🗑️ Medication deleted!');
    }
  }

  callDoctor(): void {
    window.open('tel:5559876543');
    this.showToast('📞 Calling Dr. Sarah Johnson…');
  }

}
