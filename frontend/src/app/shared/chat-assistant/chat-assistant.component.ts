import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService, Message } from 'src/app/core/services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.scss']
})
export class ChatAssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  isOpen = false;
  userInput = '';
  messages$: Observable<Message[]>;
  isOverlayActive$: Observable<boolean>;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
    this.isOverlayActive$ = this.chatService.isOverlayActive$;
  }

  ngOnInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.chatService.sendMessage(this.userInput);
      this.userInput = '';
    }
  }

  quickAction(text: string) {
    this.chatService.sendMessage(text);
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
