import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CaregiversComponent } from './caregivers.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CaregiversComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CaregiversComponent }])
  ]
})
export class CaregiversModule { }
