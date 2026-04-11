import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SitemapComponent } from './sitemap/sitemap.component';

@NgModule({
  declarations: [
    ContactUsComponent,
    SitemapComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
