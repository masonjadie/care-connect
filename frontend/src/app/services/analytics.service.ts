import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalVisits: number;
    failedLogins: number;
    totalOrders: number;
    totalRevenue: number;
    foodOrders: number;
  };
  recentOrders: any[];
  recentEvents: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;
  private ordersUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  trackVisit(page: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/track-visit`, { page });
  }

  placeOrder(orderData: { userId?: number, itemName: string, itemType: string, amount: number }): Observable<any> {
    return this.http.post(`${this.ordersUrl}/place-order`, orderData);
  }
}
