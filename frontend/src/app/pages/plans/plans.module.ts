import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlansComponent } from './plans.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PlansComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: PlansComponent }])
  ]
})
export class PlansModule { }
