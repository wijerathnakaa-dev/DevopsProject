const pool = require('../config/db');

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Black Tea', description: 'World-renowned brisk orthodox and single estate Ceylon black teas' },
  { id: 2, name: 'Green Tea', description: 'Fresh, antioxidant-rich organic green tea leaves from high-grown slopes' },
  { id: 3, name: 'Herbal Drinks', description: 'Ayurvedic spiced infusions with indigenous Sri Lankan herbs & spices' },
  { id: 4, name: 'Wellness & Extracts', description: 'Therapeutic Moringa leaf extracts and superfood wellness tonics' },
  { id: 5, name: 'White Tea', description: 'Rare velvet Silver Tips hand-harvested at mountain dawn' },
];

let FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Ceylon Single Estate Black Tea',
    description: 'Masterfully harvested loose leaf orthodox black tea from Dimbula estates. Notes of citrus zest and golden caramel.',
    price: 1250.00,
    currency: 'LKR',
    stock_quantity: 24,
    image_url: '/images/ceylon-black-tea.jpg',
    category_id: 1,
    category_name: 'Black Tea',
    is_active: 1,
    badge: 'Best Seller',
    rating: 4.9,
    weight: '250g Tin'
  },
  {
    id: 2,
    name: 'Ceylon Organic Green Tea (Jasmine Blossom)',
    description: 'Single-origin steamed green tea layered with fragrant Ceylon night jasmine buds. Light, floral, and deeply revitalizing.',
    price: 1450.00,
    currency: 'LKR',
    stock_quantity: 18,
    image_url: '/images/ceylon-green-tea.jpg',
    category_id: 2,
    category_name: 'Green Tea',
    is_active: 1,
    badge: 'Organic',
    rating: 4.8,
    weight: '150g Ceramic Jar'
  },
  {
    id: 3,
    name: 'Artisan Ceylon Spiced Chai Infusion',
    description: 'A traditional royal Ceylon Ayurvedic elixir blending true Ceylon cinnamon, star anise, cardamom, clove, and warm herbs.',
    price: 1680.00,
    currency: 'LKR',
    stock_quantity: 15,
    image_url: '/images/herbal_tea.png',
    category_id: 3,
    category_name: 'Herbal Drinks',
    is_active: 1,
    badge: 'Ayurvedic Heritage',
    rating: 5.0,
    weight: '200g Pouch'
  },
  {
    id: 4,
    name: 'Pure Moringa Leaf Extract & Wellness Elixir',
    description: '100% Organic cold-extracted Sri Lankan Moringa oleifera. Packed with 46 antioxidants, essential plant proteins, and immune minerals.',
    price: 2850.00,
    currency: 'LKR',
    stock_quantity: 30,
    image_url: '/images/moringa.jpg',
    category_id: 4,
    category_name: 'Wellness & Extracts',
    is_active: 1,
    badge: 'Superfood',
    rating: 4.9,
    weight: '50ml Glass Dropper'
  },
  {
    id: 5,
    name: 'Royal Silver Tips Hand-Plucked White Tea',
    description: 'The pinnacle of Ceylon tea artistry. Handpicked unopened velvety silver buds gently sun-withered in high Nuwara Eliya mist.',
    price: 4200.00,
    currency: 'LKR',
    stock_quantity: 8,
    image_url: '/images/silver-tips.jpg',
    category_id: 5,
    category_name: 'White Tea',
    is_active: 1,
    badge: 'Ultra Rare',
    rating: 5.0,
    weight: '80g Luxury Box'
  },
  {
    id: 6,
    name: 'Sun-Cured Lemongrass & Ginger Herbal Tonic',
    description: 'Crisp aromatic Sri Lankan lemongrass combined with spicy sun-dried wild ginger. Naturally caffeine-free digestive harmony.',
    price: 1100.00,
    currency: 'LKR',
    stock_quantity: 20,
    image_url: '/images/herbal_tea.png',
    category_id: 3,
    category_name: 'Herbal Drinks',
    is_active: 1,
    badge: 'Caffeine Free',
    rating: 4.7,
    weight: '120g Kraft Bag'
  }
];

exports.getProducts = async (req, res) => {
  const { search, category_id } = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        CAST(p.price AS DECIMAL(10,2)) AS price,
        p.currency,
        p.stock_quantity,
        p.image_url,
        p.category_id,
        c.name AS category_name,
        p.is_active,
        p.badge,
        p.rating,
        p.weight,
        p.created_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;

    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(parseInt(category_id, 10));
    }

    if (search && search.trim()) {
      query += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY p.id ASC';

    const [rows] = await pool.query(query, params);

    const formatted = rows.map((p) => ({
      ...p,
      price: parseFloat(p.price) || 0,
      rating: parseFloat(p.rating) || 5.0,
      stock_quantity: parseInt(p.stock_quantity, 10) || 0
    }));

    return res.json({ data: formatted });
  } catch (err) {
    console.warn('[GetProducts Fallback]: MySQL query failed (' + err.message + '). Serving seeded products.');
    
    let filtered = FALLBACK_PRODUCTS.filter((p) => p.is_active !== 0);
    if (category_id) {
      filtered = filtered.filter((p) => String(p.category_id) === String(category_id));
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return res.json({ data: filtered });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        CAST(p.price AS DECIMAL(10,2)) AS price,
        p.currency,
        p.stock_quantity,
        p.image_url,
        p.category_id,
        c.name AS category_name,
        p.is_active,
        p.badge,
        p.rating,
        p.weight,
        p.created_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    const product = {
      ...rows[0],
      price: parseFloat(rows[0].price) || 0,
      rating: parseFloat(rows[0].rating) || 5.0,
      stock_quantity: parseInt(rows[0].stock_quantity, 10) || 0
    };

    return res.json({ data: product });
  } catch (err) {
    const prod = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
    if (prod) {
      return res.json({ data: prod });
    }
    return res.status(404).json({ error: { message: 'Product not found' } });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM categories ORDER BY id ASC');
    return res.json({ data: rows });
  } catch (err) {
    console.warn('[GetCategories Fallback]: Serving seeded categories due to:', err.message);
    return res.json({ data: FALLBACK_CATEGORIES });
  }
};

exports.FALLBACK_PRODUCTS = FALLBACK_PRODUCTS;
exports.FALLBACK_CATEGORIES = FALLBACK_CATEGORIES;
