const express = require('express');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/orders', optionalAuth, createOrder);
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);

module.exports = router;
