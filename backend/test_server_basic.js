import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Meal {
  id?: number;
  name: string;
  description: string;
  category: string;
  calories: number;
  protein: string;
  price: number;
  tags: string[];
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private apiUrl = `${environment.apiUrl}/meals`;

  constructor(private http: HttpClient) { }

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(this.apiUrl);
  }

  createMeal(meal: Meal): Observable<any> {
    return this.http.post(this.apiUrl, meal);
  }

  updateMeal(id: number, meal: Meal): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, meal);
  }

  deleteMeal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
