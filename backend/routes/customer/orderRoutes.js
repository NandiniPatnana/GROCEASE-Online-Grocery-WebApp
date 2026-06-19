const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../../controllers/customer/orderController');

// Place new order
router.post('/place-order', placeOrder);

// Get user's orders
router.get('/get-orders', getOrders);

module.exports = router;
