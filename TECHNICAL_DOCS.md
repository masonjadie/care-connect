# CareConnect Technical Documentation

## 🏗️ System Architecture

CareConnect is a full-stack health and care management platform designed for seniors and caregivers. The architecture follows a modern decoupled approach:

### **Frontend (Angular 13+)**
- **Framework:** Angular 13 with RxJS for reactive data handling.
- **Styling:** Vanilla SCSS with a custom design system based on CSS variables (Design Tokens).
- **Core Modules:** 
    - `Auth`: Handles login, registration, and security lockout feedback.
    - `Dashboard`: Personalized tracking hub for service requests and medical data.
    - `Services`: Specialized modules for Meals, Transportation, and Caregivers.
- **State Management:** LocalStorage persisted user sessions and subscription states.

### **Backend (Node.js & Express)**
- **Runtime:** Node.js.
- **API Style:** RESTful JSON API.
- **Database:** MySQL (Managed via `mysql2/promise`).
- **Authentication:** JWT (JSON Web Tokens) with a 7-day expiration.
- **Middlewares:**
    - `auth.middleware`: Protective layer verifying JWT tokens for sensitive routes.
    - `cors`: Configured for both local and production (Railway/Vercel) environments.

### **Database (MySQL)**
- Relational schema optimized for tracking service orders and associations between users, caregivers, and pet specialists.

---

## 🔐 Security & Access Control

### **Brute-Force Protection**
The platform implements a multi-tier lockout system to prevent unauthorized access:
- **Attempt Tracking:** Failed logins are logged per user in the DB.
- **Warning Threshold:** After **3 failed attempts**, a friendly warning message indicates remaining tries.
- **Lockout:** After **7 failed attempts**, the account is locked for a **15-minute cooldown period**.
- **Auth Rules:** Passwords must contain at least **7 non-numeric characters** to ensure high entropy.

### **Feature Gating**
Feature access is controlled via `ApiService.checkAccess()`:
- **Guests:** Can browse all service descriptions but are prompted to **Login** before placing any request.
- **Free Users:** Prompted to **Choose a Plan** or start a **7-Day Trial** when attempting to use premium features (Rides, Caregiver bookings).

---

## 📡 API Reference

### **Authentication**
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Registers a new user. Req: `name, email, password`. |
| `/api/auth/login` | `POST` | Authenticates user and returns JWT. Tracks failed attempts. |

### **Subscriptions**
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/subscriptions/start-trial` | `POST` | Sets `trial_ends_at` (7 days from now). |
| `/api/subscriptions/update` | `POST` | Upgrades user to `basic`, `premium`, or `family`. |

### **Service Requests (Orders)**
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/orders/place-order` | `POST` | Universal endpoint for meals, prescriptions, and caregiver requests. |
| `/api/orders/my-orders/:userId`| `GET` | Retrieves real-time tracking data for a specific user. |

### **Transportation**
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/transportation/book` | `POST` | Creates a ride booking. |
| `/api/transportation/my-bookings/:id`| `GET` | Fetches active and past ride tracking. |

---

## 🛠️ Setup & Deployment

### **Local Environment**
1. **Repository:** `git clone https://github.com/masonjadie/care-connect.git`
2. **Backend:**
   - `cd backend`
   - `npm install`
   - Create `.env` with `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.
   - Run migrations: `node src/scripts/migrate-lockout.js` (and others in `scripts/`).
   - `npm start` (Port 3000).
3. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm start` (Port 4200).

### **Production Deployment**
- **Frontend:** Automatically deployed to **Vercel** on push to `main`. Build command: `npm run build`.
- **Backend:** Hosted on **Railway** with an auto-scaling MySQL instance.
- **Production API:** `https://care-connect-production-b10d.up.railway.app/api`.

---

## 🛤️ Database Schema Updates (Latest)
- **`users` table:** Added `failed_login_attempts` (INT) and `lockout_until` (DATETIME).
- **`transportation_bookings` table:** Added `user_id` foreign key for personal dashboard tracking.
- **`orders` table:** Added `request_time`, `request_location`, `request_duration`, and `request_rate` for detailed service history.

---
*Documentation Version: 1.2.0*
*Last Updated: 2026-04-14*
