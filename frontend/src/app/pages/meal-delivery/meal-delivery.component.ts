import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { ApiService } from '../../services/api.service';
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
    private mealService: MealService,
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {
    const defaultMeals: Meal[] = [
      { id: 1, name: 'Grilled Lemon Herb Salmon', description: 'Fresh salmon with steamed asparagus and quinoa.', category: 'Heart Healthy', calories: 450, protein: '35g', price: 14.99, tags: ['Omega-3', 'Gluten-Free'], image: 'salmon_meal.webp' },
      { id: 2, name: 'Low-Sodium Turkey Meatballs', description: 'Served with zucchini noodles and sugar-free marinara.', category: 'Low Sodium', calories: 380, protein: '30g', price: 12.99, tags: ['Low Carb', 'Heart Healthy'], image: 'turkey_meatballs.webp' },
      { id: 3, name: 'Diabetic-Friendly Chicken Stir-Fry', description: 'Lean chicken breast with broccoli, bell peppers, and brown rice.', category: 'Diabetic Friendly', calories: 410, protein: '32g', price: 13.50, tags: ['High Fiber', 'Low Glycemic'], image: 'chicken_stirfry.webp' },
      { id: 4, name: 'Mediterranean Buddha Bowl', description: 'Chickpeas, cucumber, tomatoes, olives, and feta over crisp greens.', category: 'Vegetarian', calories: 350, protein: '15g', price: 11.99, tags: ['Plant Based', 'High Fiber'], image: 'buddha_bowl.webp' },
      { id: 5, name: 'Hearty Beef Stew', description: 'Tender beef slow-cooked with carrots, potatoes, and peas.', category: 'All', calories: 480, protein: '28g', price: 15.00, tags: ['Comfort Food', 'High Protein'], image: 'beef_stew.webp' },
      { id: 6, name: 'Oatmeal & Berry Breakfast Bowl', description: 'Steel-cut oats with fresh mixed berries and walnuts.', category: 'Heart Healthy', calories: 310, protein: '10g', price: 8.99, tags: ['Breakfast', 'Superfood'], image: 'oatmeal_bowl.webp' }
    ];

    this.mealService.getMeals().subscribe({
      next: (meals: Meal[]) => {
        const finalMeals = meals && meals.length > 0 ? meals : defaultMeals;
        this.meals = finalMeals;
        this.filteredMeals = finalMeals;
      },
      error: (err: any) => {
        console.error('Failed to load meals', err);
        this.meals = defaultMeals;
        this.filteredMeals = defaultMeals;
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

    const userStr = localStorage.getItem('careconnect_user');
    const user = userStr ? JSON.parse(userStr) : null;

    const orderData = {
      userId: user?.id,
      itemName: this.orderToConfirm.name,
      itemType: 'meal',
      amount: this.orderToConfirm.price,
      requestLocation: this.deliveryAddress,
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
