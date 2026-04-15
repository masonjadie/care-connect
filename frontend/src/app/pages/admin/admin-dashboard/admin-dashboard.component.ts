import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService, DashboardStats } from '../../../services/analytics.service';
import { MealService, Meal } from '../../../services/meal.service';
import { interval, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  statsData?: DashboardStats;
  private refreshSub?: Subscription;
  loading = true;

  // All staff lists
  allOrders: any[] = [];
  pendingCaregivers: any[] = [];
  pendingSpecialists: any[] = [];
  verifiedCaregivers: any[] = [];
  verifiedSpecialists: any[] = [];
  allMeals: Meal[] = [];
  allUsers: any[] = [];

  activeTab: 'summary' | 'orders' | 'verification' | 'verified' | 'transport' | 'meals' | 'users' = 'summary';
  transportationBookings: any[] = [];

  // Meal Form State
  isMealModalOpen = false;
  currentMeal: Partial<Meal> = this.resetMealForm();
  isEditingMeal = false;
  
  // Driver Modal State
  isDriverModalOpen = false;
  activeBookingId: number | null = null;
  driverDetails = {
    driverName: '',
    licensePlate: '',
    carModel: '',
    driverPhone: ''
  };

  constructor(
    private analyticsService: AnalyticsService,
    private mealService: MealService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
    // Live update stats every 60 seconds
    this.refreshSub = interval(60000)
      .pipe(startWith(0))
      .subscribe(() => this.loadStats());
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  loadAllData(): void {
    this.loading = true;
    this.loadStats();
    this.loadOrders();
    this.loadVerifications();
    this.loadVerifiedStaff();
    this.loadTransportation();
    this.loadMeals();
    this.loadUsers();
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

  loadVerifiedStaff(): void {
    this.analyticsService.getVerifiedCaregivers().subscribe({
      next: (data) => this.verifiedCaregivers = data,
      error: () => this.verifiedCaregivers = []
    });
    this.analyticsService.getVerifiedPetSpecialists().subscribe({
      next: (data) => this.verifiedSpecialists = data,
      error: () => this.verifiedSpecialists = []
    });
  }

  loadMeals(): void {
    this.mealService.getMeals().subscribe({
      next: (meals: Meal[]) => this.allMeals = meals,
      error: (err: any) => console.error('Failed to load meals', err)
    });
  }

  verifyCaregiver(id: number): void {
    this.analyticsService.verifyCaregiver(id).subscribe(() => {
      this.loadVerifications();
      this.loadVerifiedStaff();
    });
  }

  verifySpecialist(id: number): void {
    this.analyticsService.verifySpecialist(id).subscribe(() => {
      this.loadVerifications();
      this.loadVerifiedStaff();
    });
  }

  get prescriptionOrders(): any[] {
    return this.allOrders.filter(o =>
      o.item_type === 'prescription' || (o.item_name || '').toLowerCase().includes('prescription')
    );
  }

  get caregiverRequests(): any[] {
    return this.allOrders.filter(o => o.item_type === 'caregiver_request');
  }

  get petSpecialistRequests(): any[] {
    return this.allOrders.filter(o => o.item_type === 'pet_specialist_request');
  }

  get fulfillmentRate(): number {
    if (!this.statsData) return 0;
    const total = this.statsData.stats.totalOrders;
    return total > 0 ? Math.min(Math.round(((total - 1) / total) * 100), 98) : 0;
  }

  get platformHealth(): number {
    return this.loading ? 0 : 99;
  }

  parseEventData(data: string): any {
    try {
      return JSON.parse(data);
    } catch {
      return { ip: 'Unknown', email: 'N/A' };
    }
  }

  // Delivery status progression
  readonly statusSteps = ['pending', 'fulfilled', 'out_for_delivery', 'delivered'];

  statusProgress(status: string): number {
    const idx = this.statusSteps.indexOf(status);
    return idx < 0 ? 0 : Math.round((idx / (this.statusSteps.length - 1)) * 100);
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      fulfilled: 'Fulfilled',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered'
    };
    return labels[status] ?? status;
  }

  nextStatus(status: string): string | null {
    const idx = this.statusSteps.indexOf(status);
    return idx >= 0 && idx < this.statusSteps.length - 1 ? this.statusSteps[idx + 1] : null;
  }

  nextStatusLabel(status: string): string {
    const next = this.nextStatus(status);
    if (!next) return '';
    const labels: Record<string, string> = {
      fulfilled: '✔ Fulfill',
      out_for_delivery: '🚚 Out for Delivery',
      delivered: '📦 Delivered'
    };
    return labels[next] ?? next;
  }

  updateOrderStatus(orderId: number, currentStatus: string): void {
    const next = this.nextStatus(currentStatus);
    if (!next) return;
    this.analyticsService.updateOrderStatus(orderId, next).subscribe({
      next: () => {
        const order = this.statsData?.recentOrders.find((o: any) => o.id === orderId);
        if (order) order.status = next;
        const allOrder = this.allOrders.find(o => o.id === orderId);
        if (allOrder) allOrder.status = next;
      },
      error: (err: any) => console.error('Status update failed', err)
    });
  }

  // ── Transportation Trip Status ────────────────────────────────────────
  loadTransportation(): void {
    this.analyticsService.getTransportationBookings().subscribe({
      next: (data) => this.transportationBookings = data,
      error: () => this.transportationBookings = []
    });
  }

  readonly tripStatusSteps = ['booked', 'picked_up', 'on_route', 'dropped_off'];

  tripProgress(status: string): number {
    const idx = this.tripStatusSteps.indexOf(status);
    return idx < 0 ? 0 : Math.round((idx / (this.tripStatusSteps.length - 1)) * 100);
  }

  tripStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      booked:      'Booked',
      picked_up:   'Picked Up',
      on_route:    'On Route',
      dropped_off: 'Dropped Off'
    };
    return labels[status] ?? status;
  }

  nextTripStatus(status: string): string | null {
    const idx = this.tripStatusSteps.indexOf(status);
    return idx >= 0 && idx < this.tripStatusSteps.length - 1 ? this.tripStatusSteps[idx + 1] : null;
  }

  nextTripStatusLabel(status: string): string {
    const next = this.nextTripStatus(status);
    if (!next) return '';
    const labels: Record<string, string> = {
      picked_up:   '🚗 Picked Up',
      on_route:    '🛣️ On Route',
      dropped_off: '📍 Dropped Off'
    };
    return labels[next] ?? next;
  }

  updateTripStatus(bookingId: number, currentStatus: string): void {
    const next = this.nextTripStatus(currentStatus);
    if (!next) return;
    
    // If we are moving to 'picked_up', ask for driver details first
    if (next === 'picked_up') {
      this.activeBookingId = bookingId;
      this.driverDetails = { driverName: '', licensePlate: '', carModel: '', driverPhone: '' };
      this.isDriverModalOpen = true;
      return;
    }

    this.executeTripStatusUpdate(bookingId, next);
  }

  confirmDriverAssignment(): void {
    if (!this.activeBookingId) return;
    this.executeTripStatusUpdate(this.activeBookingId, 'picked_up', this.driverDetails);
    this.isDriverModalOpen = false;
    this.activeBookingId = null;
  }

  private executeTripStatusUpdate(id: number, status: string, driverData?: any): void {
    this.analyticsService.updateTripStatus(id, status, driverData).subscribe({
      next: () => {
        const booking = this.transportationBookings.find(b => b.id === id);
        if (booking) {
          booking.status = status;
          if (driverData) {
            Object.assign(booking, driverData);
          }
        }
      },
      error: (err: any) => console.error('Trip status update failed', err)
    });
  }

  // ── Meal Management ───────────────────────────────────────────────
  resetMealForm(): Partial<Meal> {
    return {
      name: '',
      description: '',
      category: 'Heart Healthy',
      calories: 0,
      protein: '',
      price: 0,
      tags: [],
      image: 'meals/roasted-salmon.png'
    };
  }

  openAddMealModal(): void {
    this.currentMeal = this.resetMealForm();
    this.isEditingMeal = false;
    this.isMealModalOpen = true;
  }

  openEditMealModal(meal: Meal): void {
    this.currentMeal = { ...meal };
    this.isEditingMeal = true;
    this.isMealModalOpen = true;
  }

  closeMealModal(): void {
    this.isMealModalOpen = false;
  }

  saveMeal(): void {
    if (this.isEditingMeal && this.currentMeal.id) {
      this.mealService.updateMeal(this.currentMeal.id, this.currentMeal as Meal).subscribe({
        next: () => {
          this.loadMeals();
          this.closeMealModal();
        },
        error: (err: any) => console.error('Failed to update meal', err)
      });
    } else {
      this.mealService.createMeal(this.currentMeal as Meal).subscribe({
        next: () => {
          this.loadMeals();
          this.closeMealModal();
        },
        error: (err: any) => console.error('Failed to create meal', err)
      });
    }
  }

  deleteMeal(id: number): void {
    if (confirm('Are you sure you want to delete this meal?')) {
      this.mealService.deleteMeal(id).subscribe({
        next: () => this.loadMeals(),
        error: (err: any) => console.error('Failed to delete meal', err)
      });
    }
  }

  updateTags(tagsString: string): void {
    this.currentMeal.tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => !!tag);
  }

  // ── User Management ───────────────────────────────────────────────
  loadUsers(): void {
    this.analyticsService.getAllUsers().subscribe({
      next: (users) => this.allUsers = users,
      error: () => this.allUsers = []
    });
  }

  changeUserPlan(userId: number, event: any): void {
    const newTier = event.target.value;
    if (!newTier) return;
    
    this.analyticsService.updateUserPlan(userId, newTier).subscribe({
      next: () => {
        const user = this.allUsers.find(u => u.id === userId);
        if (user) user.subscription_tier = newTier;
      },
      error: (err) => console.error('Failed to update plan', err)
    });
  }
}
