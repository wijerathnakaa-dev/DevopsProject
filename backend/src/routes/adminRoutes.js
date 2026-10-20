const express = require('express');
const {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection & admin privilege to all admin routes
router.use(protect, adminOnly);

router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
