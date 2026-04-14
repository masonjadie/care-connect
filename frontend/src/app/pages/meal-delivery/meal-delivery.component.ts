import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

interface Meal {
  id: number;
  name: string;
  description: string;
  category: string;
  calories: number;
  protein: string;
  price: number;
  tags: string[];
  image: string;
}

@Component({
  selector: 'app-meal-delivery',
  templateUrl: './meal-delivery.component.html',
  styleUrls: ['./meal-delivery.component.scss']
})
export class MealDeliveryComponent implements OnInit {
  categories: string[] = ['All', 'Low Sodium', 'Diabetic Friendly', 'Vegetarian', 'Heart Healthy'];
  selectedCategory = 'All';
  
  meals: Meal[] = [
    {
      id: 1,
      name: 'Roasted Salmon with Asparagus',
      description: 'Fresh Atlantic salmon roasted with lemon and herbs, served over steamed asparagus and quinoa.',
      category: 'Heart Healthy',
      calories: 420,
      protein: '32g',
      price: 14.50,
      tags: ['Omega-3', 'Gluten Free'],
      image: 'meals/roasted-salmon.png'
    },
    {
      id: 2,
      name: 'Mediterranean Chickpea Salad',
      description: 'Crunchy chickpeas, cucumbers, cherry tomatoes, and feta cheese with a light lemon-olive oil dressing.',
      category: 'Vegetarian',
      calories: 350,
      protein: '12g',
      price: 11.00,
      tags: ['Fiber Rich', 'Fresh'],
      image: 'meals/mediterranean-salad.png'
    },
    {
      id: 3,
      name: 'Turkey Meatloaf & Sweet Potato',
      description: 'Lean ground turkey meatloaf served with mashed sweet potatoes and sautéed green beans.',
      category: 'Low Sodium',
      calories: 380,
      protein: '28g',
      price: 13.00,
      tags: ['Low Fat', 'Filling'],
      image: 'meals/turkey-meatloaf.png'
    },
    {
      id: 4,
      name: 'Grilled Chicken Stir-Fry',
      description: 'Sliced chicken breast with bell peppers, broccoli, and snap peas in a low-glycemic ginger soy sauce.',
      category: 'Diabetic Friendly',
      calories: 310,
      protein: '24g',
      price: 12.50,
      tags: ['No Sugar Added', 'High Protein'],
      image: 'meals/chicken-stirfry.png'
    },
    {
      id: 5,
      name: 'Lentil & Vegetable Soup',
      description: 'Hearty soup made with brown lentils, carrots, celery, and spinach. Served with a whole grain roll.',
      category: 'Vegetarian',
      calories: 290,
      protein: '15g',
      price: 9.50,
      tags: ['Plant Based', 'Low Calorie'],
      image: 'meals/roasted-salmon.png' // Fallback for failed soup image
    }
  ];

  filteredMeals: Meal[] = [];
  successMessage = '';

  // Confirmation state
  isConfirming = false;
  orderToConfirm: Meal | null = null;
  deliveryAddress = '123 Care Street, Medical District'; // Default demo address
  paymentMethod = 'Cash on Delivery';

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.filteredMeals = this.meals;
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
      error: (err) => {
        console.error('Order failed', err);
        this.successMessage = 'Sorry, we could not process your order at this time.';
        this.orderToConfirm = null;
      }
    });
  }
}
