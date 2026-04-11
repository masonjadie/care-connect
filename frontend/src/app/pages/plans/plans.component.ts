import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  currentTier = 'free';
  userId: number | null = null;
  message = '';
  isSuccess = false;
  hasTrialUsed = false;
  isLoading = false;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('careconnect_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
      this.currentTier = user.subscription_tier || 'free';
      this.hasTrialUsed = !!user.trial_ends_at;
    } else {
      // Redirect to login if not logged in
      this.router.navigate(['/auth']);
    }
  }

  selectPlan(tier: string): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.api.updateSubscription(this.userId, tier).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = res.message;
        this.isSuccess = true;
        this.currentTier = tier;
        
        // Update local storage
        const userStr = localStorage.getItem('careconnect_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.subscription_tier = tier;
          localStorage.setItem('careconnect_user', JSON.stringify(user));
        }

        // Hard redirect for reliability
        window.location.href = '/home';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.error || 'Failed to update subscription.';
        this.isSuccess = false;
      }
    });
  }

  startTrial(): void {
    if (!this.userId) {
      console.error('No userId found in localStorage');
      this.message = 'Please log in again to start your trial.';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.api.startTrial(this.userId).subscribe({
      next: (res) => {
        console.log('Trial started:', res);
        this.isLoading = false;
        this.message = res.message;
        this.isSuccess = true;
        this.hasTrialUsed = true;
        
        // Update local storage
        const userStr = localStorage.getItem('careconnect_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.trial_ends_at = res.trial_ends_at;
          user.subscription_tier = 'trial';
          localStorage.setItem('careconnect_user', JSON.stringify(user));
        }

        // Hard redirect for reliability
        window.location.href = '/home';
      },
      error: (err) => {
        console.error('Trial error:', err);
        this.isLoading = false;
        if (err.status === 0) {
          this.message = 'Unable to connect to the server. Please ensure the backend is running.';
        } else {
          this.message = err.error?.error || 'An unexpected error occurred while starting your trial.';
        }
        this.isSuccess = false;
      }
    });
  }
}
