import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  voiceResult$ = new Subject<string>();
  listeningStatus$ = new Subject<boolean>();

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.setupRecognition();
  }

  private setupRecognition() {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        this.voiceResult$.next(text);
      };

      this.recognition.onstart = () => {
        this.isListening = true;
        this.listeningStatus$.next(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.listeningStatus$.next(false);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.listeningStatus$.next(false);
      };
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Recognition already started');
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text: string) {
    if (!this.synthesis) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for seniors
    utterance.pitch = 1.0;
    
    // Pick a friendly female voice if available
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Female')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synthesis.speak(utterance);
  }

  cancelSpeak() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}
