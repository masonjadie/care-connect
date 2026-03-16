import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  highlightSelector?: string;
  buttons?: string[]; // New: Action buttons for seniors
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private isOverlayActiveSubject = new BehaviorSubject<boolean>(false);
  private lastIntent: string | null = null; // Track context for seniors Marc
  
  messages$ = this.messagesSubject.asObservable();
  isOverlayActive$ = this.isOverlayActiveSubject.asObservable();

  private defaultMessages: Message[] = [
    {
      text: "Hey! 👋 I'm your CareConnect assistant here to help you. How can I assist you today? 😊",
      sender: 'ai',
      timestamp: new Date(),
      buttons: ['Book a Ride', 'Manage Medications', 'Meal Delivery', 'Find a Caregiver']
    }
  ];

  private intentMap: { [key: string]: string[] } = {
    'sos': ['sos', 'emergency', 'help', 'ambulance', 'alert', 'scared', 'hurt', 'police', 'call now', 'panic'],
    'ride': ['ride', 'drive', 'transport', 'car', 'pickup', 'doctor', 'visit', 'go to', 'travel', 'book a ride'],
    'caregiver': ['caregiver', 'nurse', 'assistant', 'support worker', 'homemaker', 'companion'],
    'meal': ['meal', 'food', 'hungry', 'dinner', 'lunch', 'eat', 'delivery', 'diet', 'nutrition', 'sugar', 'diabetic', 'diabetes', 'foos', 'blood pressure', 'salt', 'sodium'],
    'medication': ['medication', 'pill', 'medicine', 'prescription', 'pharmacy', 'refill', 'reminder', 'drug', 'tablets', 'meds'],
    'about': ['about', 'who are you', 'how this works', 'info', 'company'],
    'appearance': ['dark mode', 'theme', 'color', 'background', 'night', 'bright', 'light'],
    'font': ['font', 'text', 'size', 'magnify', 'bigger', 'smaller', 'read', 'see'],
    'pet': ['pet', 'animal', 'dog', 'cat', 'companion', 'service', 'assistance', 'furry']
  };

  private knowledgeBase: { [key: string]: string } = {
    'sos': "In an emergency, click the red 'Emergency SOS' button or say 'SOS' aloud. You'll be connected to emergency services and your contacts will be notified.",
    'help': "I can help you with booking rides, managing medications, or finding caregivers. What do you need assistance with?",
    'ride': "We offer senior-friendly drivers for doctor visits. To sign up: 1. Click 'Login' (highlighted). 2. Go to 'Services' -> 'Book a Ride'. 3. Enter your destination.",
    'caregiver': "Our 'Find a Caregiver' service connects you with verified nursing and support professionals. To sign up: Click 'Login' then visit the 'Caregivers' page.",
    'meal': "Nutritional Meals are delivered daily. To sign up: 1. Click 'Login'. 2. Visit 'Services' -> 'Meal Delivery'. 3. Choose your plan.",
    'medication': "Never miss a pill! To sign up: 1. Click 'Login'. 2. Visit 'Medication Reminder'. 3. Add your prescriptions.",
    'about': "CareConnect Hub is dedicated to helping seniors live independently. We've been serving the community for over 10 years.",
    'appearance': "You can toggle dark mode using the moon icon in the navbar. It's great for reducing eye strain!",
    'font': "Use the A- and A+ buttons in the navbar to change the text size. We support up to 150% magnification.",
    'pet': "To get a companion: 1. Click 'Find Service Animal' (highlighted). 2. Browse animals. 3. Click 'Inquire' to start.",
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

  sendMessage(text: string, isFromAI = false) {
    const newMessage: Message = {
      text,
      sender: isFromAI ? 'ai' : 'user',
      timestamp: new Date()
    };

    if (!isFromAI) {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, newMessage]);

      this.getAIResponse(text).subscribe(response => {
        const aiMessage: Message = {
          text: response.text,
          sender: 'ai',
          timestamp: new Date(),
          highlightSelector: response.highlight,
          buttons: response.buttons
        };
        
        if (response.highlight) {
          this.applyHighlight(response.highlight);
        } else {
          this.clearHighlight();
        }

        this.messagesSubject.next([...this.messagesSubject.value, aiMessage]);
      });
    } else {
      this.messagesSubject.next([...this.messagesSubject.value, newMessage]);
    }
  }

  private getAIResponse(userText: string): Observable<{text: string, highlight?: string, buttons?: string[]}> {
    const text = userText.toLowerCase();
    let response = "I'm not sure I understand. Would you like to check one of these services?";
    let highlight: string | undefined;
    let buttons: string[] = ['Book a Ride', 'Manage Medications', 'Meal Delivery', 'Find a Caregiver'];

    // 1. Emergency/SOS takes highest priority
    if (text.includes('sos') || text.includes('emergency') || text.includes('call now') || text.includes('help')) {
      this.lastIntent = 'sos';
      return of({
        text: "🚨 I'm notifying emergency services and your primary contact immediately. Please stay calm. Would you like me to dial for you?",
        highlight: '.btn-sos',
        buttons: ['YES - Call 911', 'I am okay now']
      }).pipe(delay(800));
    }

    // 2. Check for specific services/intents
    for (const intent in this.intentMap) {
      if (this.intentMap[intent].some(keyword => text.includes(keyword))) {
        this.lastIntent = intent;
        response = this.knowledgeBase[intent];
        highlight = this.highlights[intent];
        buttons = ['How to sign up', 'Go back'];
        
        // Context-aware refinements for seniors
        if (text.includes('see diabetic meals')) {
          response = "I've highlighted the 'Diabetic Friendly' filter for you on the meal page. Click it to see all our low-glycemic options!";
          highlight = '.category-tabs button:nth-child(3)'; // Assuming 3rd tab is Diabetic
          buttons = ['How to sign up', 'Help with something else'];
        } else if (text.includes('see low sodium meals')) {
          response = "I've highlighted the 'Low Sodium' filter. Click it to view meals with heart-healthy salt levels!";
          highlight = '.category-tabs button:nth-child(2)'; // Assuming 2nd tab is Low Sodium
          buttons = ['How to sign up', 'Help with something else'];
        } else if (text.includes('sugar') || text.includes('diabetic')) {
          response = "We have specific 'Diabetic Friendly' meal plans designed for low-glycemic needs. Would you like to see those options?";
          buttons = ['See Diabetic Meals', 'How to sign up'];
        } else if (text.includes('salt') || text.includes('sodium') || text.includes('blood pressure')) {
          response = "Our 'Low Sodium' meal category is perfect for managing heart health and blood pressure. Shall I show you the menu?";
          buttons = ['See Low Sodium Meals', 'How to sign up'];
        }
        
        // Customize buttons for specific intents
        if (intent === 'font') buttons = ['Make text bigger', 'Make text smaller', 'Done'];
        if (intent === 'appearance') buttons = ['Switch Theme', 'Okay'];
        
        return of({ text: response, highlight, buttons }).pipe(delay(1000));
      }
    }
    
    // 3. Handle "How to sign up" with context
    if (text.includes('sign up') || text.includes('how to') || text.includes('tell me more')) {
       if (this.lastIntent && this.knowledgeBase[this.lastIntent]) {
         response = this.knowledgeBase[this.lastIntent];
         highlight = this.highlights[this.lastIntent] || highlight;
         buttons = ['I understand', 'Help with something else'];
       } else {
         response = "To sign up for any of our services, you'll first need to click the 'Login' button (highlighted). Which service are you interested in?";
         highlight = '.login-btn';
         buttons = ['Book a Ride', 'Manage Medications', 'Meal Delivery', 'Find a Caregiver'];
       }
       return of({ text: response, highlight, buttons }).pipe(delay(1000));
    }

    // Default Fallback
    return of({ text: response, highlight, buttons }).pipe(delay(1000));
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
