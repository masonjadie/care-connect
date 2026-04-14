import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlansComponent } from './plans.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PlansComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: PlansComponent }])
  ]
})
export class PlansModule { }
