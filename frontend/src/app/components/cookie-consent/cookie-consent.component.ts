import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem('careconnect_cookie_consent');
      if (!consent) {
        this.showBanner = true;
      }
    }
  }

  acceptCookies(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('careconnect_cookie_consent', 'true');
      this.showBanner = false;
    }
  }
}
