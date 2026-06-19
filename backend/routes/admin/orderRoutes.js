const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../../controllers/admin/orderController');

// Get all orders
router.get('/api/admin/orders', getAllOrders);

// Update order status
router.post('/api/admin/orders/:id', updateOrderStatus);

module.exports = router;
