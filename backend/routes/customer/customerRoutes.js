const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../../controllers/customer/customerController');

// Add product to cart
router.post('/add-to-cart', addToCart);

// Get cart items
router.get('/get-cart', getCart);

// Remove product from cart
router.post('/remove-from-cart', removeFromCart);

module.exports = router;
