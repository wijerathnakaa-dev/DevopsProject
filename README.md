# ChaCeylon (Nature's Blend) — Frontend Application

**Module:** DevOps Engineering  
**Group No.:** 87  
**Project Title:** Sri Lankan Tea and Herbal Drink E-Commerce Platform  
**Technology Stack:** React 19, Vite, Docker, Nginx, Node.js + Express (Backend), MySQL (Database)

---

## 🍃 Project Overview

ChaCeylon is a modern e-commerce web platform for authentic single-origin Sri Lankan orthodox black, green, and white teas, Ayurvedic herbal infusions, and organic cold-extracted Moringa oleifera elixirs.

This frontend connects to the Express backend via REST APIs adhering strictly to the **Frontend–Backend Integration and REST API Specification (Group 87)**.

---

## 🛠️ Key Features Implemented

1. **Brand Aesthetic & Hero Showcase:**
   - Authentic Ceylon typography, rich forest green & amber gold palettes, and elephant motif logo.
   - High-impact hero section with single-origin highlights and trust badges.
   - Factory & processing showcase featuring the modern packaging plant.
   - Ayurvedic herbal and organic Moringa wellness spotlight.
2. **Product Catalogue & Search (`/products`):**
   - Category filtering (Black Tea, Green Tea, Herbal Drinks, Wellness & Moringa, White Tea).
   - Real-time search by name, notes, and description.
   - In-stock availability filtering and price sorting.
   - Interactive Product Quick View modal with botanical and brewing guidelines.
3. **Shopping Cart & Stepper (`/cart`):**
   - Real-time quantity adjustment, line-item totals, and remove-item controls.
   - Dynamic islandwide shipping calculation (Free for orders > LKR 5,000).
   - Toast notification feedback on adding items.
4. **Checkout & Order Creation (`/checkout`):**
   - Implements `POST /api/orders` matching Section 7.5.
   - Sri Lankan delivery address validation (recipient name, phone, address, city, district).
   - Payment method selection (Cash on Delivery / Direct Bank Transfer).
   - Instant order confirmation screen with order reference number (`ORD-2026-XXXX`).
5. **Customer Order History (`/orders`):**
   - Implements `GET /api/orders/my-orders` matching Section 6.3.
   - Order status badges (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`).
   - Itemized purchase breakdown and delivery details.
6. **Administrator Portal (`/admin`):**
   - Implements Section 6.4 & 6.5 (`/api/admin/products`, `/api/admin/orders`).
   - Metric overview (Total Revenue LKR, Total Orders, Active Teas, Low Stock Alerts).
   - Products Table with "Add New Product" modal and "Edit / Deactivate" actions.
   - Orders Table with interactive status changer dropdown.
7. **Authentication & Role Switching (`/login`, `/register`):**
   - Implements `POST /api/auth/login` and `POST /api/auth/register`.
   - One-click demo fast-fill buttons for evaluator testing (Customer / Admin).
   - Quick role switcher badge in navigation bar to test customer vs. admin permissions effortlessly.
8. **Resilient Integration & Health Monitoring:**
   - Header status badge tracking `GET /api/health` at `http://localhost:5000/api`.
   - Seamless fallback mock layer matching Section 7 JSON schemas so the frontend is 100% testable even before the backend is booted up.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Environment Configuration
Create a `.env` file in the `tea-shop-frontend` root (a `.env.example` is provided):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

---

## 🐳 Running with Docker

### 1. Build the Docker Image
```bash
docker build -t chaceylon-frontend:latest .
```

### 2. Run the Container
```bash
docker run -d -p 80:80 --name chaceylon-ui chaceylon-frontend:latest
```
Access the application at `http://localhost`. Client-side routing is handled via `nginx.conf`.

---

## 🔌 Agreed REST API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status check |
| `GET` | `/api/products` | Retrieve active products (supports `?search=` and `?category_id=`) |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `GET` | `/api/categories` | Retrieve product categories |
| `POST` | `/api/auth/register` | Register customer (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Authenticate customer (`email`, `password`) |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile |
| `POST` | `/api/orders` | Create order (`items`, `delivery_address`, `payment_method`) |
| `GET` | `/api/orders/my-orders` | Retrieve customer order history |
| `GET` | `/api/admin/products` | Admin retrieve all products |
| `POST` | `/api/admin/products` | Admin add product |
| `PATCH`| `/api/admin/products/:id` | Admin update product price / stock |
| `DELETE`| `/api/admin/products/:id` | Admin deactivate product |
| `GET` | `/api/admin/orders` | Admin retrieve customer orders |
| `PATCH`| `/api/admin/orders/:id/status`| Admin update order status |
