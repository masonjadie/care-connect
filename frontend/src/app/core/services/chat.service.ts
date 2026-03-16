import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  highlightSelector?: string; // CSS selector to highlight
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private isOverlayActiveSubject = new BehaviorSubject<boolean>(false);
  
  messages$ = this.messagesSubject.asObservable();
  isOverlayActive$ = this.isOverlayActiveSubject.asObservable();

  private defaultMessages: Message[] = [
    {
      text: "Hello! I'm your CareConnect assistant. How can I help you navigate our services today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ];

  private intentMap: { [key: string]: string[] } = {
    'sos': ['sos', 'emergency', 'help', 'ambulance', 'alert', 'scared', 'hurt', 'police'],
    'ride': ['ride', 'drive', 'transport', 'car', 'pickup', 'doctor', 'visit', 'go to', 'travel'],
    'caregiver': ['caregiver', 'nurse', 'assistant', 'support worker', 'homemaker', 'companion'],
    'meal': ['meal', 'food', 'hungry', 'dinner', 'lunch', 'eat', 'delivery', 'diet', 'nutrition'],
    'medication': ['medication', 'pill', 'medicine', 'prescription', 'pharmacy', 'refill', 'reminder', 'drug'],
    'about': ['about', 'who are you', 'how this works', 'info', 'company'],
    'appearance': ['dark mode', 'theme', 'color', 'background', 'night', 'bright', 'light'],
    'font': ['font', 'text', 'size', 'magnify', 'bigger', 'smaller', 'read', 'see'],
    'pet': ['pet', 'animal', 'dog', 'cat', 'companion', 'service', 'assistance', 'furry']
  };

  private knowledgeBase: { [key: string]: string } = {
    'sos': "In an emergency, click the red 'Emergency SOS' button or say 'SOS' aloud. You'll be connected to emergency services and your contacts will be notified.",
    'help': "I can help you with booking rides, managing medications, or finding caregivers. What do you need assistance with?",
    'ride': "I can help you with that! You mentioned needing a drive or transport. You can 'Book a Ride' through our transportation service (highlighted). We offer senior-friendly drivers for doctor visits.",
    'caregiver': "Our 'Find a Caregiver' service connects you with verified nursing and support professionals for your specific needs.",
    'meal': "Nutritional Meals Delivery can be scheduled daily. We offer special dietary plans for seniors, including diabetic-friendly and low-sodium options.",
    'medication': "Use our 'Medication Reminder' to set alerts for your pills. You can also use 'Prescription Fill & Delivery' to have them sent to your door.",
    'about': "CareConnect Hub is dedicated to helping seniors live independently. We've been serving the community for over 10 years.",
    'appearance': "You can toggle dark mode using the moon icon in the navbar. It's great for reducing eye strain!",
    'font': "Use the A- and A+ buttons in the navbar to change the text size. We support up to 150% magnification.",
    'pet': "I can definitely help you with that! Look at the green 'Find Service Animal' button I'm highlighting for you. Click it to see our available support animals.",
    'sign up': "The sign-up process is simple! First, click the 'Login' button in the top right. I'll highlight it for you now."
  };

  private highlights: { [key: string]: string } = {
    'pet': '.btn-service.green',
    'ride': '.btn-service.teal',
    'sign up': '.login-btn',
    'sos': '.btn-sos',
    'meal': '.btn-service.blue',
    'medication': '.btn-service.purple'
  };

  constructor() {
    this.messagesSubject.next(this.defaultMessages);
  }

  sendMessage(text: string) {
    const userMessage: Message = {
      text,
      sender: 'user',
      timestamp: new Date()
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    this.getAIResponse(text).subscribe(response => {
      const aiMessage: Message = {
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        highlightSelector: response.highlight
      };
      
      if (response.highlight) {
        this.applyHighlight(response.highlight);
      } else {
        this.clearHighlight();
      }

      this.messagesSubject.next([...this.messagesSubject.value, aiMessage]);
    });
  }

  private getAIResponse(userText: string): Observable<{text: string, highlight?: string}> {
    const text = userText.toLowerCase();
    let response = "I'm not sure I understand. Could you rephrase that? You can ask about 'SOS', 'rides', 'meals', or 'medications'.";
    let highlight: string | undefined;

    // Check intents first
    for (const intent in this.intentMap) {
      if (this.intentMap[intent].some(keyword => text.includes(keyword))) {
        response = this.knowledgeBase[intent];
        highlight = this.highlights[intent];
        break;
      }
    }

    // Direct knowledge base check for specific phrases
    for (const key in this.knowledgeBase) {
      if (text.includes(key)) {
        response = this.knowledgeBase[key];
        highlight = this.highlights[key] || highlight;
        break;
      }
    }

    // Simulate network delay
    return of({ text: response, highlight }).pipe(delay(1000));
  }

  private applyHighlight(selector: string) {
    this.clearHighlight(); // Clear previous
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('ai-highlight-target');
      this.isOverlayActiveSubject.next(true);
      
      // Auto-clear after 8 seconds
      setTimeout(() => this.clearHighlight(), 8000);
    }
  }

  private clearHighlight() {
    const elements = document.querySelectorAll('.ai-highlight-target');
    elements.forEach(el => el.classList.remove('ai-highlight-target'));
    this.isOverlayActiveSubject.next(false);
  }

  clearHistory() {
    this.messagesSubject.next([{
      text: "Hello! History cleared. How else can I help you?",
      sender: 'ai',
      timestamp: new Date()
    }]);
  }
}
