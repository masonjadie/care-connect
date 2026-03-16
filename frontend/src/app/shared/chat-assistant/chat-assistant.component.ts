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
    this.autoGreeting();
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
    if (text === 'YES - Call 911') {
      this.chatService.sendMessage("🚨 *Simulating Emergency Call to 911...* Services have been notified of your location.", true);
      return;
    }
    if (text === 'I am okay now' || text === 'Done') {
      this.chatService.sendMessage("Glad to hear you are okay! Let me know if you need anything else.", true);
      return;
    }
    this.chatService.sendMessage(text);
  }

  private autoGreeting() {
    // Force reset for this session if the user is actively testing
    sessionStorage.removeItem('ai_greeted'); 
    
    setTimeout(() => {
      this.isOpen = true; // Auto-open to show greeting
      setTimeout(() => {
        this.chatService.sendMessage("Hey! 👋 I'm your CareConnect assistant here to help you. How can I assist you today? 😊");
      }, 500);
      sessionStorage.setItem('ai_greeted', 'true');
    }, 1500);
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
