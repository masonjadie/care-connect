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
    this.messages$ = new Observable<Message[]>(); // Initialized later
    this.isOverlayActive$ = this.chatService.isOverlayActive$;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.isInitialized) {
      this.initChatLogic();
    }
  }

  private isInitialized = false;

  ngOnInit(): void {
    // Check if it should be open by default (e.g. from Emergency)
    this.isOverlayActive$.subscribe(active => {
      if (active && !this.isOpen) {
        this.toggleChat();
      }
    });
  }

  private initChatLogic(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load messages stream only now
    this.messages$ = this.chatService.messages$;

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

    this.scrollToBottom();
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

  // Removed toggleChat from here as it's defined above

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
    // Disabled auto-greeting to reach 95+ Performance score.
    // Chat now only initializes fully when the user interacts.
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
