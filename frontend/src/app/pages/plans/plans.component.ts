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

  // Payment Modal State
  showPaymentModal = false;
  selectedTier = '';
  paymentData = {
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: ''
  };

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('careconnect_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
      this.currentTier = user.subscription_tier || 'free';
      this.hasTrialUsed = !!user.trial_ends_at;
    } else {
      this.router.navigate(['/auth']);
    }
  }

  selectPlan(tier: string): void {
    if (!this.userId) return;
    this.selectedTier = tier;
    this.showPaymentModal = true;
    document.body.style.overflow = 'hidden';
  }

  closePayment(): void {
    this.showPaymentModal = false;
    document.body.style.overflow = 'auto';
  }

  confirmPayment(): void {
    if (!this.userId || !this.selectedTier) return;
    
    // Validate simple simulation
    if (!this.paymentData.cardName || !this.paymentData.cardNumber) {
      alert('Please fill in card details.');
      return;
    }

    this.isLoading = true;
    this.api.updateSubscription(this.userId, this.selectedTier).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showPaymentModal = false;
        document.body.style.overflow = 'auto';
        
        // Update local storage
        const userStr = localStorage.getItem('careconnect_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.subscription_tier = this.selectedTier;
          localStorage.setItem('careconnect_user', JSON.stringify(user));
        }

        this.message = `Successfully upgraded to ${this.selectedTier.toUpperCase()}! Redirecting...`;
        this.isSuccess = true;
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.error || 'Payment simulation failed.';
        this.isSuccess = false;
      }
    });
  }

  startTrial(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.api.startTrial(this.userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.hasTrialUsed = true;
        
        const userStr = localStorage.getItem('careconnect_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.trial_ends_at = res.trial_ends_at;
          user.subscription_tier = 'trial';
          localStorage.setItem('careconnect_user', JSON.stringify(user));
        }

        this.message = '7-Day Free Trial Started! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err.error?.error || 'Failed to start trial.';
        this.isSuccess = false;
      }
    });
  }
}
