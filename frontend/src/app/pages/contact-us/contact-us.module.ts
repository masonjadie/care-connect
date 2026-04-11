import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
  { path: '', component: ContactUsComponent }
];

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ContactUsModule { }
