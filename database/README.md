# ChaCeylon (Nature's Blend) — MySQL Database

**Group No:** 87  
**Database Name:** `tea_herbal_db`  
**Engine:** MySQL 8.0 / InnoDB / utf8mb4

---

## 🗄️ Database Structure

1. **`schema.sql`**:
   - `categories`: Stores product collections (Black Tea, Green Tea, Herbal Drinks, Wellness & Extracts, White Tea).
   - `users`: Customer and admin accounts with bcrypt-hashed passwords.
   - `products`: Authentic Ceylon tea and herbal items with pricing in LKR, stock count, weight, and image paths.
   - `orders`: Customer purchase orders with status tracking and delivery address JSON.
   - `order_items`: Order line items with linked quantities and captured unit prices.

2. **`seed.sql`**:
   - 5 tea categories
   - 6 signature Ceylon tea & herbal elixir items with high-resolution imagery and LKR pricing
   - Default Administrator account:
     - **Email:** `admin@chaceylon.lk`
     - **Password:** `admin123`
     - **Role:** `admin`
   - Default Customer account:
     - **Email:** `customer@chaceylon.lk`
     - **Password:** `customer123`
     - **Role:** `customer`

---

## ⚡ Quick Setup & Seeding

### Method 1: Automated via Backend Script (Recommended)
Configure your MySQL credentials in `backend/.env`, then run:
```bash
cd ../backend
npm run init-db
```

### Method 2: MySQL Command Line / Terminal
```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

### Method 3: MySQL Workbench
1. Open MySQL Workbench and connect to your local MySQL 8.0 instance.
2. Open `schema.sql` (File -> Open SQL Script...) and click the **Lightning Bolt (Execute)** button.
3. Open `seed.sql` and execute it in the same manner.
4. Refresh the schema list on the left to view `tea_herbal_db`.
