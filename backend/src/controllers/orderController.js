const crypto = require('crypto');
const pool = require('../config/db');

// Collision-safe order number, e.g. ORD-LZ4K2Q-9F3A
const generateOrderNumber = () =>
  `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

exports.createOrder = async (req, res) => {
  const { items, delivery_address, payment_method } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: { message: 'Order must contain at least one item' } });
  }

  // Merge duplicate lines for the same product so stock is checked against the real total
  const quantities = new Map();
  for (const item of items) {
    const productId = parseInt(item.product_id, 10);
    const qty = parseInt(item.quantity, 10);
    if (!productId || !qty || qty < 1) {
      return res.status(400).json({ error: { message: 'Each item needs a valid product_id and a quantity of at least 1' } });
    }
    quantities.set(productId, (quantities.get(productId) || 0) + qty);
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Lock the product rows so two simultaneous orders cannot both buy the last unit
    const productIds = [...quantities.keys()];
    const [dbProducts] = await connection.query(
      `SELECT id, name, price, stock_quantity, image_url FROM products
       WHERE id IN (?) AND is_active = 1 FOR UPDATE`,
      [productIds]
    );

    const productMap = new Map();
    dbProducts.forEach((p) => productMap.set(p.id, p));

    let totalAmount = 0;
    const enrichedItems = [];

    for (const [productId, qty] of quantities) {
      const prod = productMap.get(productId);
      if (!prod) {
        await connection.rollback();
        return res.status(400).json({
          error: { message: `Product ID ${productId} was not found in our catalog` }
        });
      }

      if (prod.stock_quantity < qty) {
        await connection.rollback();
        return res.status(400).json({
          error: { message: `Insufficient inventory for "${prod.name}". Available: ${prod.stock_quantity}, Requested: ${qty}` }
        });
      }

      const unitPrice = parseFloat(prod.price);
      totalAmount += unitPrice * qty;

      enrichedItems.push({
        product_id: prod.id,
        name: prod.name,
        quantity: qty,
        unit_price: unitPrice,
        image_url: prod.image_url
      });
    }

    // Orders always belong to the logged-in user (route is protected)
    const userId = req.user.id;
    const userEmail = req.user.email;
    const orderNumber = generateOrderNumber();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_number, user_id, user_email, total_amount, status, payment_method, payment_status, delivery_address)
       VALUES (?, ?, ?, ?, 'pending', ?, 'pending', ?)`,
      [
        orderNumber,
        userId,
        userEmail,
        totalAmount,
        payment_method || 'cash_on_delivery',
        JSON.stringify(delivery_address || {})
      ]
    );

    const orderId = orderResult.insertId;

    // Insert line items and decrement stock
    for (const item of enrichedItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.unit_price]
      );

      await connection.query(
        `UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    const createdOrder = {
      id: orderId,
      order_number: orderNumber,
      user_id: userId,
      user_email: userEmail,
      total_amount: totalAmount,
      status: 'pending',
      payment_method: payment_method || 'cash_on_delivery',
      payment_status: 'pending',
      delivery_address: delivery_address || {},
      items: enrichedItems,
      created_at: new Date().toISOString()
    };

    res.status(201).json({ data: createdOrder });
  } catch (err) {
    if (connection) {
      try { await connection.rollback(); } catch (_) { /* connection already broken */ }
    }
    console.error('[CreateOrder Error]:', err);
    res.status(500).json({ error: { message: 'Order processing failed due to database error' } });
  } finally {
    if (connection) connection.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId && !userEmail) {
      return res.status(401).json({ error: { message: 'Authentication required to view orders' } });
    }

    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? OR user_email = ? ORDER BY created_at DESC`,
      [userId, userEmail]
    );

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
    console.error('[GetMyOrders Error]:', err);
    res.status(500).json({ error: { message: 'Failed to retrieve orders' } });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    const order = rows[0];

    // Authorization check: customer can only view own order, admin can view all
    if (req.user && req.user.role !== 'admin') {
      if (order.user_id !== req.user.id && order.user_email !== req.user.email) {
        return res.status(403).json({ error: { message: 'Access denied to this order' } });
      }
    }

    const [items] = await pool.query(
      `SELECT 
         oi.product_id,
         p.name,
         oi.quantity,
         CAST(oi.unit_price AS DECIMAL(10,2)) AS unit_price,
         p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    const formattedOrder = {
      ...order,
      total_amount: parseFloat(order.total_amount) || 0,
      delivery_address: typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address || '{}') : order.delivery_address,
      items: items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        unit_price: parseFloat(i.unit_price) || 0,
        image_url: i.image_url
      }))
    };

    res.json({ data: formattedOrder });
  } catch (err) {
    console.error('[GetOrderById Error]:', err);
    res.status(500).json({ error: { message: 'Failed to retrieve order' } });
  }
};
