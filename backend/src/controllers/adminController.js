const pool = require('../config/db');

// --- Product Management ---

exports.getAdminProducts = async (req, res) => {
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
      ORDER BY p.id DESC
    `;

    const [rows] = await pool.query(query);

    const formatted = rows.map((p) => ({
      ...p,
      price: parseFloat(p.price) || 0,
      rating: parseFloat(p.rating) || 5.0,
      stock_quantity: parseInt(p.stock_quantity, 10) || 0
    }));

    res.json({ data: formatted });
  } catch (err) {
    console.error('[Admin GetProducts Error]:', err);
    res.status(500).json({ error: { message: 'Failed to retrieve products for administration' } });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      stock_quantity,
      image_url,
      category_id,
      badge,
      rating,
      weight
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: { message: 'Product name and price are required' } });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, currency, stock_quantity, image_url, category_id, is_active, badge, rating, weight)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
      [
        name,
        description || '',
        parseFloat(price) || 0,
        currency || 'LKR',
        parseInt(stock_quantity, 10) || 0,
        image_url || '/images/ceylon-black-tea.jpg',
        category_id ? parseInt(category_id, 10) : 1,
        badge || 'Authentic Ceylon',
        parseFloat(rating) || 5.0,
        weight || '250g'
      ]
    );

    const newId = result.insertId;
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [newId]
    );

    const prod = rows[0] || {};
    prod.price = parseFloat(prod.price) || 0;
    prod.rating = parseFloat(prod.rating) || 5.0;
    prod.stock_quantity = parseInt(prod.stock_quantity, 10) || 0;

    res.status(201).json({ data: prod });
  } catch (err) {
    console.error('[Admin CreateProduct Error]:', err);
    res.status(500).json({ error: { message: 'Failed to create product' } });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: { message: 'No fields provided to update' } });
    }

    const allowed = ['name', 'description', 'price', 'currency', 'stock_quantity', 'image_url', 'category_id', 'is_active', 'badge', 'rating', 'weight'];
    const fields = [];
    const values = [];

    for (const [k, v] of Object.entries(updates)) {
      if (allowed.includes(k)) {
        fields.push(`${k} = ?`);
        values.push(v);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: { message: 'No valid update fields provided' } });
    }

    values.push(id);
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    const prod = rows[0];
    prod.price = parseFloat(prod.price) || 0;
    prod.rating = parseFloat(prod.rating) || 5.0;
    prod.stock_quantity = parseInt(prod.stock_quantity, 10) || 0;

    res.json({ data: prod });
  } catch (err) {
    console.error('[Admin UpdateProduct Error]:', err);
    res.status(500).json({ error: { message: 'Failed to update product' } });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Product deactivated successfully' });
  } catch (err) {
    console.error('[Admin DeleteProduct Error]:', err);
    res.status(500).json({ error: { message: 'Failed to deactivate product' } });
  }
};

// --- Order Management ---

exports.getAdminOrders = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');

    if (orders.length === 0) {
      return res.json({ data: [] });
    }

    const orderIds = orders.map((o) => o.id);
    const [items] = await pool.query(
      `SELECT 
         oi.order_id,
         oi.product_id,
         p.name,
         oi.quantity,
         CAST(oi.unit_price AS DECIMAL(10,2)) AS unit_price,
         p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    const itemsByOrder = new Map();
    items.forEach((item) => {
      if (!itemsByOrder.has(item.order_id)) {
        itemsByOrder.set(item.order_id, []);
      }
      itemsByOrder.get(item.order_id).push({
        product_id: item.product_id,
        name: item.name || 'Ceylon Tea',
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price) || 0,
        image_url: item.image_url || '/images/ceylon-black-tea.jpg'
      });
    });

    const result = orders.map((o) => ({
      ...o,
      total_amount: parseFloat(o.total_amount) || 0,
      delivery_address: typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : o.delivery_address,
      items: itemsByOrder.get(o.id) || []
    }));

    res.json({ data: result });
  } catch (err) {
    console.error('[Admin GetOrders Error]:', err);
    res.status(500).json({ error: { message: 'Failed to retrieve administrative orders' } });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` } });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    const order = rows[0];
    order.total_amount = parseFloat(order.total_amount) || 0;
    order.delivery_address = typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address || '{}') : order.delivery_address;

    res.json({ data: order });
  } catch (err) {
    console.error('[Admin UpdateOrderStatus Error]:', err);
    res.status(500).json({ error: { message: 'Failed to update order status' } });
  }
};
