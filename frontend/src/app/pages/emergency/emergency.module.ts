import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmergencyComponent } from './emergency.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EmergencyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: EmergencyComponent }])
  ]
})
export class EmergencyModule { }
