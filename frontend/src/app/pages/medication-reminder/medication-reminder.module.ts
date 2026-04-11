import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicationReminderComponent } from './medication-reminder.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MedicationReminderComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: MedicationReminderComponent }])
  ]
})
export class MedicationReminderModule { }
