const pool = require('../config/db');

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
    console.error('[GetProducts Error]:', err.message);
    return res.status(503).json({ error: { message: 'Product catalog is temporarily unavailable' } });
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
    console.error('[GetProductById Error]:', err.message);
    return res.status(503).json({ error: { message: 'Product catalog is temporarily unavailable' } });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM categories ORDER BY id ASC');
    return res.json({ data: rows });
  } catch (err) {
    console.error('[GetCategories Error]:', err.message);
    return res.status(503).json({ error: { message: 'Categories are temporarily unavailable' } });
  }
};
