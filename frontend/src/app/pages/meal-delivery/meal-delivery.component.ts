import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { MealService, Meal } from '../../services/meal.service';

@Component({
  selector: 'app-meal-delivery',
  templateUrl: './meal-delivery.component.html',
  styleUrls: ['./meal-delivery.component.scss']
})
export class MealDeliveryComponent implements OnInit {
  categories: string[] = ['All', 'Low Sodium', 'Diabetic Friendly', 'Vegetarian', 'Heart Healthy'];
  selectedCategory = 'All';
  
  meals: Meal[] = [];
  filteredMeals: Meal[] = [];
  successMessage = '';

  // Confirmation state
  isConfirming = false;
  orderToConfirm: Meal | null = null;
  deliveryAddress = '123 Care Street, Medical District'; // Default demo address
  paymentMethod = 'Cash on Delivery';

  constructor(
    private analyticsService: AnalyticsService,
    private mealService: MealService
  ) { }

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {
    this.mealService.getMeals().subscribe({
      next: (meals: Meal[]) => {
        this.meals = meals;
        this.filteredMeals = meals;
      },
      error: (err: any) => {
        console.error('Failed to load meals', err);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredMeals = this.meals;
    } else {
      this.filteredMeals = this.meals.filter(meal => meal.category === category);
    }
  }

  requestMeal(meal: Meal): void {
    this.orderToConfirm = meal;
    this.isConfirming = true;
  }

  cancelOrder(): void {
    this.isConfirming = false;
    this.orderToConfirm = null;
  }

  confirmOrder(): void {
    if (!this.orderToConfirm) return;

    const orderData = {
      itemName: this.orderToConfirm.name,
      itemType: 'meal',
      amount: this.orderToConfirm.price,
      address: this.deliveryAddress,
      payment: this.paymentMethod
    };

    this.isConfirming = false;

    this.analyticsService.placeOrder(orderData).subscribe({
      next: () => {
        this.successMessage = `Order for ${this.orderToConfirm?.name} confirmed! It will be delivered to ${this.deliveryAddress} via ${this.paymentMethod}.`;
        this.orderToConfirm = null;
      },
      error: (err: any) => {
        console.error('Order failed', err);
        this.successMessage = 'Sorry, we could not process your order at this time.';
        this.orderToConfirm = null;
      }
    });
  }
}
