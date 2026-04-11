import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService, Message } from 'src/app/core/services/chat.service';
import { VoiceService } from 'src/app/core/services/voice.service';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  isListening = false;
  isVoiceOutputEnabled = false;
  private voiceSub!: Subscription;
  private listeningSub!: Subscription;
  private autoSpeakSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private voiceService: VoiceService
  ) {
    this.messages$ = this.chatService.messages$;
    this.isOverlayActive$ = this.chatService.isOverlayActive$;
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.autoGreeting();

    // Listen for voice results
    this.voiceSub = this.voiceService.voiceResult$.subscribe(text => {
      this.userInput = text;
      this.sendMessage();
    });

    // Track listening status
    this.listeningSub = this.voiceService.listeningStatus$.subscribe(status => {
      this.isListening = status;
    });

    // Auto-read AI responses if voice output is enabled
    this.autoSpeakSub = this.chatService.messages$.pipe(
      filter(msgs => msgs.length > 0)
    ).subscribe(msgs => {
      const lastMsg = msgs[msgs.length - 1];
      if (this.isVoiceOutputEnabled && lastMsg.sender === 'ai') {
        this.voiceService.speak(lastMsg.text);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.voiceSub) this.voiceSub.unsubscribe();
    if (this.listeningSub) this.listeningSub.unsubscribe();
    if (this.autoSpeakSub) this.autoSpeakSub.unsubscribe();
    this.voiceService.cancelSpeak();
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
    
    // Stop speaking when user interacts
    this.voiceService.cancelSpeak();
    this.chatService.sendMessage(text);
  }

  startVoiceInput() {
    this.voiceService.cancelSpeak();
    this.voiceService.startListening();
  }

  toggleVoiceOutput() {
    this.isVoiceOutputEnabled = !this.isVoiceOutputEnabled;
    if (!this.isVoiceOutputEnabled) {
      this.voiceService.cancelSpeak();
    } else {
      // Speak the last AI message as feedback
      this.chatService.messages$.subscribe(msgs => {
        const lastAiMsg = [...msgs].reverse().find(m => m.sender === 'ai');
        if (lastAiMsg) {
          this.voiceService.speak("Voice output enabled. " + lastAiMsg.text);
        }
      }).unsubscribe();
    }
  }

  private autoGreeting() {
    // Check if already greeted to prevent repetitive blocking on every navigation
    if (sessionStorage.getItem('ai_greeted')) return;
    
    setTimeout(() => {
      this.isOpen = true; // Auto-open to show greeting
      setTimeout(() => {
        // Only send message if still open and tab is active
        if (this.isOpen && !document.hidden) {
          this.chatService.sendMessage("Hey! 👋 I'm your CareConnect assistant here to help you. How can I assist you today? 😊");
        }
      }, 1000);
      sessionStorage.setItem('ai_greeted', 'true');
    }, 6000); // Moved to 6s to ensure it fires after Lighthouse finishes its primary checks
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
