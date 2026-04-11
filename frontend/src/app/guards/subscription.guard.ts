import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean | UrlTree {
    const userStr = localStorage.getItem('careconnect_user');
    if (!userStr) {
      return this.router.parseUrl('/auth');
    }

    const user = JSON.parse(userStr);
    
    // Check if trial is still active
    if (user.trial_ends_at) {
      const trialEnds = new Date(user.trial_ends_at);
      if (trialEnds > new Date()) {
        return true;
      }
    }

    // If trial expired, require a subscription tier selection
    // Explicitly check for 'none' or null/falsy tier
    if (user.subscription_tier && user.subscription_tier !== 'none') {
      return true;
    }

    return this.router.parseUrl('/plans');
  }
}
