const pool = require('../config/db');

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { items, delivery_address, payment_method } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: { message: 'Order must contain at least one item' } });
    }

    // Extract product IDs
    const productIds = items.map((i) => i.product_id);
    const [dbProducts] = await connection.query(
      `SELECT id, name, price, stock_quantity, image_url FROM products WHERE id IN (?)`,
      [productIds]
    );

    const productMap = new Map();
    dbProducts.forEach((p) => productMap.set(p.id, p));

    // Validate stock and compute server total
    let totalAmount = 0;
    const enrichedItems = [];

    for (const item of items) {
      const prod = productMap.get(item.product_id);
      if (!prod) {
        return res.status(400).json({
          error: { message: `Product ID ${item.product_id} was not found in our catalog` }
        });
      }

      const qty = parseInt(item.quantity, 10) || 1;
      if (prod.stock_quantity < qty) {
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

    // Determine user info
    const userId = req.user ? req.user.id : null;
    const userEmail = req.user ? req.user.email : (delivery_address?.email || 'customer@chaceylon.lk');
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Start Transaction
    await connection.beginTransaction();

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
    await connection.rollback();
    console.error('[CreateOrder Error]:', err);
    res.status(500).json({ error: { message: 'Order processing failed due to database error' } });
  } finally {
    connection.release();
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
