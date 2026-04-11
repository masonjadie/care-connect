import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AuthOverlayComponent } from './auth-overlay/auth-overlay.component';
import { ChatAssistantComponent } from './chat-assistant/chat-assistant.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    AuthOverlayComponent,
    ChatAssistantComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    AuthOverlayComponent,
    ChatAssistantComponent
  ]
})
export class SharedModule { }
