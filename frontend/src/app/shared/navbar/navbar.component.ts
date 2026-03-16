import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from 'src/app/core/services/accessibility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  currentTheme$ = this.accessibilityService.theme$;
  currentScale$ = this.accessibilityService.fontScale$;
  voiceActive$ = this.accessibilityService.voiceCommandsActive$;
  isSpeaking$ = this.accessibilityService.isSpeaking$;
  isSpeaking = false;
  voiceActive = false;
  private speaksSub?: Subscription;
  private voiceSub?: Subscription;

  constructor(
    public router: Router,
    private accessibilityService: AccessibilityService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.menuOpen = false;
    });

    this.speaksSub = this.isSpeaking$.subscribe(val => this.isSpeaking = val);
    this.voiceSub = this.voiceActive$.subscribe(val => this.voiceActive = val);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  get userName(): string {
    const userStr = localStorage.getItem('careconnect_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.name || user.email || '';
      } catch (e) { }
    }
    return '';
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    localStorage.removeItem('careconnect_user');
    this.router.navigate(['/home']);
  }

  toggleTheme(): void {
    this.accessibilityService.toggleTheme();
  }

  increaseFont(): void {
    this.accessibilityService.increaseFontSize();
  }

  decreaseFont(): void {
    this.accessibilityService.decreaseFontSize();
  }

  toggleVoice(): void {
    this.accessibilityService.toggleVoiceCommands();
  }

  readPage(): void {
    const mainContent = document.querySelector('main') || document.querySelector('.container') || document.body;
    const text = (mainContent as HTMLElement).innerText;
    this.accessibilityService.speak(text);
  }

  stopReading(): void {
    this.accessibilityService.stopSpeaking();
  }

  handleReadToggle(): void {
    if (this.isSpeaking) {
      this.stopReading();
    } else {
      this.readPage();
    }
  }

  ngOnDestroy(): void {
    if (this.speaksSub) this.speaksSub.unsubscribe();
    if (this.voiceSub) this.voiceSub.unsubscribe();
  }
}
