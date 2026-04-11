import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PrescriptionDeliveryComponent } from './prescription-delivery.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PrescriptionDeliveryComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: PrescriptionDeliveryComponent }])
  ]
})
export class PrescriptionDeliveryModule { }