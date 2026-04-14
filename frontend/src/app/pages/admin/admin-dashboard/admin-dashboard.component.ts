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

  // New Admin Sections
  allOrders: any[] = [];
  pendingCaregivers: any[] = [];
  pendingSpecialists: any[] = [];
  activeTab: 'summary' | 'orders' | 'verification' = 'summary';

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadAllData();
    // Live update stats every 60 seconds
    this.refreshSub = interval(60000)
      .pipe(startWith(0))
      .subscribe(() => this.loadStats());
  }

  loadAllData(): void {
    this.loading = true;
    this.loadStats();
    this.loadOrders();
    this.loadVerifications();
  }

  loadStats(): void {
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => {
        this.statsData = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadOrders(): void {
    this.analyticsService.getAllOrders().subscribe(orders => {
      this.allOrders = orders;
    });
  }

  loadVerifications(): void {
    this.analyticsService.getAllCaregivers().subscribe(caregivers => {
      this.pendingCaregivers = caregivers.filter(c => !c.verified);
    });
    this.analyticsService.getAllPetSpecialists().subscribe(specialists => {
      this.pendingSpecialists = specialists.filter(s => !s.verified);
    });
  }

  verifyCaregiver(id: number): void {
    this.analyticsService.verifyCaregiver(id).subscribe(() => {
      this.loadVerifications();
    });
  }

  verifySpecialist(id: number): void {
    this.analyticsService.verifySpecialist(id).subscribe(() => {
      this.loadVerifications();
    });
  }

  get prescriptionOrders(): any[] {
    return this.allOrders.filter(o => o.item_type === 'prescription' || o.item_name.toLowerCase().includes('prescription'));
  }

  get caregiverRequests(): any[] {
    return this.allOrders.filter(o => o.item_type === 'caregiver_request');
  }

  parseEventData(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return { ip: 'Unknown', email: 'N/A' };
    }
  }
}
