import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private renderer: Renderer2;
  
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.themeSubject.asObservable();

  private fontScaleSubject = new BehaviorSubject<number>(1);
  fontScale$ = this.fontScaleSubject.asObservable();

  // Speech Features
  private isSpeakingSubject = new BehaviorSubject<boolean>(false);
  isSpeaking$ = this.isSpeakingSubject.asObservable();

  private voiceCommandsSubject = new BehaviorSubject<boolean>(false);
  voiceCommandsActive$ = this.voiceCommandsSubject.asObservable();

  private commandProcessedSubject = new Subject<string>();
  commandEmitted$ = this.commandProcessedSubject.asObservable();

  private recognition: any;
  private synth = window.speechSynthesis;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadSettings();
    // Speech Recognition is now lazily initialized only when requested
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('data-theme', theme);
    });
    
    localStorage.setItem('careconnect_theme', theme);
  }

  increaseFontSize(): void {
    if (this.fontScaleSubject.value < 1.5) {
      this.setFontScale(this.fontScaleSubject.value + 0.1);
    }
  }

  decreaseFontSize(): void {
    if (this.fontScaleSubject.value > 0.8) {
      this.setFontScale(this.fontScaleSubject.value - 0.1);
    }
  }

  setFontScale(scale: number): void {
    const roundedScale = Math.round(scale * 10) / 10;
    this.fontScaleSubject.next(roundedScale);
    
    // Use native setProperty for CSS variables to ensure reliable browser rendering
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--font-scale', roundedScale.toString());
    });
    
    localStorage.setItem('careconnect_font_scale', roundedScale.toString());
  }

  // TTS Methods
  speak(text: string): void {
    this.stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => this.isSpeakingSubject.next(true);
    utterance.onend = () => this.isSpeakingSubject.next(false);
    this.synth.speak(utterance);
  }

  stopSpeaking(): void {
    this.synth.cancel();
    this.isSpeakingSubject.next(false);
  }

  // STT Methods
  toggleVoiceCommands(): void {
    const newState = !this.voiceCommandsSubject.value;
    this.voiceCommandsSubject.next(newState);
    if (newState) {
      if (!this.recognition) {
        this.initSpeechRecognition();
      }
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  private initSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('Voice Command recognized:', command);
        this.commandProcessedSubject.next(command);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          this.voiceCommandsSubject.next(false);
        }
      };

      this.recognition.onend = () => {
        if (this.voiceCommandsSubject.value) {
          this.recognition.start(); // Restart if still active
        }
      };
    }
  }

  private startListening(): void {
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Recognition already started');
      }
    }
  }

  private stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  private loadSettings(): void {
    const savedTheme = localStorage.getItem('careconnect_theme') as 'light' | 'dark';
    if (savedTheme) {
      this.setTheme(savedTheme);
    }

    const savedScale = localStorage.getItem('careconnect_font_scale');
    if (savedScale) {
      // Small delay to ensure browser is ready for font scale animation
      setTimeout(() => {
        this.setFontScale(parseFloat(savedScale));
      }, 50);
    }
  }
}
