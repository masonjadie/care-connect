import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService, DashboardStats } from '../../../services/analytics.service';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  statsData?: DashboardStats;
  private refreshSub?: Subscription;
  loading = true;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    // Live update every 30 seconds
    this.refreshSub = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.analyticsService.getDashboardStats())
      )
      .subscribe({
        next: (data) => {
          this.statsData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch dashboard stats', err);
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  parseEventData(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
}
