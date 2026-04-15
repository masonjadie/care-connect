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
  private caregiversUrl = `${environment.apiUrl}/caregivers`;
  private specialistsUrl = `${environment.apiUrl}/pet-specialists`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.ordersUrl);
  }

  getAllCaregivers(): Observable<any[]> {
    return this.http.get<any[]>(this.caregiversUrl);
  }

  getAllPetSpecialists(): Observable<any[]> {
    return this.http.get<any[]>(this.specialistsUrl);
  }

  verifyCaregiver(id: number): Observable<any> {
    return this.http.patch(`${this.caregiversUrl}/${id}/verify`, {});
  }

  verifySpecialist(id: number): Observable<any> {
    return this.http.patch(`${this.specialistsUrl}/${id}/verify`, {});
  }

  getVerifiedCaregivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.caregiversUrl}/verified`);
  }

  getVerifiedPetSpecialists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.specialistsUrl}/verified`);
  }

  registerPetSpecialist(data: any): Observable<any> {
    return this.http.post(`${this.specialistsUrl}/register`, data);
  }

  trackVisit(page: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/track-visit`, { page });
  }

  placeOrder(orderData: { 
    userId?: number, 
    itemName: string, 
    itemType: string, 
    amount: number,
    requestTime?: string,
    requestLocation?: string,
    requestDuration?: string,
    requestRate?: string
  }): Observable<any> {
    return this.http.post(`${this.ordersUrl}/place-order`, orderData);
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.ordersUrl}/my-orders/${userId}`);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.ordersUrl}/${id}/status`, { status });
  }

  // ── Transportation ──────────────────────────────────────────────────
  private transportUrl = `${environment.apiUrl}/transportation`;

  getTransportationBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.transportUrl);
  }

  getUserBookings(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.transportUrl}/my-bookings/${userId}`);
  }

  createTransportationBooking(data: {
    userId?: number;
    passengerName?: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    vehicleType: string;
    tripType: string;
    notes?: string;
  }): Observable<any> {
    return this.http.post(this.transportUrl, data);
  }

  updateTripStatus(id: number, status: string, driverData?: any): Observable<any> {
    const payload = { status, ...driverData };
    return this.http.patch(`${this.transportUrl}/${id}/status`, payload);
  }
}

