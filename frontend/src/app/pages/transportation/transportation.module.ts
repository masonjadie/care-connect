import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TransportationComponent } from './transportation.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TransportationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TransportationComponent }])
  ]
})
export class TransportationModule { }
