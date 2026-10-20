-- ========================================================
-- Sri Lankan Tea & Herbal Drink E-Commerce Platform
-- Initial Seed Data (Group 87)
-- ========================================================

USE tea_herbal_db;

-- 1. Seed Product Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Black Tea', 'World-renowned brisk orthodox and single estate Ceylon black teas'),
(2, 'Green Tea', 'Fresh, antioxidant-rich organic green tea leaves from high-grown slopes'),
(3, 'Herbal Drinks', 'Ayurvedic spiced infusions with indigenous Sri Lankan herbs & spices'),
(4, 'Wellness & Extracts', 'Therapeutic Moringa leaf extracts and superfood wellness tonics'),
(5, 'White Tea', 'Rare velvet Silver Tips hand-harvested at mountain dawn')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 2. Seed Default Users
-- Default Admin: admin@chaceylon.lk / admin123
-- Default Customer: customer@chaceylon.lk / customer123
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'System Admin', 'admin@chaceylon.lk', '$2a$10$qNIOGdWq2XaRamsUt.LA9.9xg9TJABHi3fSDjoE0tcxS7WmX6AzxO', 'admin'),
(2, 'Kavindu Wijerathna', 'customer@chaceylon.lk', '$2a$10$4FKPUCJp2Q/lg57vIVXruemzVsj/Dd2vI8A52Capz1bq.P.EZ2HzC', 'customer')
ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role);

-- 3. Seed Authentic Ceylon Teas & Herbal Products
INSERT INTO products (id, name, description, price, currency, stock_quantity, image_url, category_id, is_active, badge, rating, weight) VALUES
(
  1,
  'Ceylon Single Estate Black Tea',
  'Masterfully harvested loose leaf orthodox black tea from Dimbula estates. Notes of citrus zest and golden caramel.',
  1250.00,
  'LKR',
  24,
  '/images/ceylon-black-tea.jpg',
  1,
  1,
  'Best Seller',
  4.90,
  '250g Tin'
),
(
  2,
  'Ceylon Organic Green Tea (Jasmine Blossom)',
  'Single-origin steamed green tea layered with fragrant Ceylon night jasmine buds. Light, floral, and deeply revitalizing.',
  1450.00,
  'LKR',
  18,
  '/images/ceylon-green-tea.jpg',
  2,
  1,
  'Organic',
  4.80,
  '150g Ceramic Jar'
),
(
  3,
  'Artisan Ceylon Spiced Chai Infusion',
  'A traditional royal Ceylon Ayurvedic elixir blending true Ceylon cinnamon, star anise, cardamom, clove, and warm herbs.',
  1680.00,
  'LKR',
  15,
  '/images/herbal_tea.png',
  3,
  1,
  'Ayurvedic Heritage',
  5.00,
  '200g Pouch'
),
(
  4,
  'Pure Moringa Leaf Extract & Wellness Elixir',
  '100% Organic cold-extracted Sri Lankan Moringa oleifera. Packed with 46 antioxidants, essential plant proteins, and immune minerals.',
  2850.00,
  'LKR',
  30,
  '/images/moringa.jpg',
  4,
  1,
  'Superfood',
  4.90,
  '50ml Glass Dropper'
),
(
  5,
  'Royal Silver Tips Hand-Plucked White Tea',
  'The pinnacle of Ceylon tea artistry. Handpicked unopened velvety silver buds gently sun-withered in high Nuwara Eliya mist.',
  4200.00,
  'LKR',
  8,
  '/images/silver-tips.jpg',
  5,
  1,
  'Ultra Rare',
  5.00,
  '80g Luxury Box'
),
(
  6,
  'Sun-Cured Lemongrass & Ginger Herbal Tonic',
  'Crisp aromatic Sri Lankan lemongrass combined with spicy sun-dried wild ginger. Naturally caffeine-free digestive harmony.',
  1100.00,
  'LKR',
  20,
  '/images/herbal_tea.png',
  3,
  1,
  'Caffeine Free',
  4.70,
  '120g Kraft Bag'
)
ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  description=VALUES(description),
  price=VALUES(price),
  stock_quantity=VALUES(stock_quantity),
  image_url=VALUES(image_url),
  category_id=VALUES(category_id);
