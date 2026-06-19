const Product = require("../../models/Product"); // Import Product model
const Cart = require("../../models/Cart")

const addToCart = async (req, res) => {
  try {
    const { productId, userEmail } = req.body;

    // Basic validation
    if (!productId || !userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID and user email are required" 
      });
    }

    // First check if the product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    if (!product.inStock) {
      return res.status(400).json({ 
        success: false, 
        message: "Product is out of stock" 
      });
    }

    const products = await Cart.findOne({ orderedBy: userEmail });
    if (products !== null) {
      console.log(products['products']);
    }
    // Check if this product is already in user's cart
    const existingCart = await Cart.findOne({
      orderedBy: userEmail,
      "products.productId": String(productId)
    });

    if (existingCart) {
      return res.status(400).json({ 
        success: false, 
        message: "This product is already in your cart" 
      });
    }

    // At this point, we know:
    // 1. Product exists and is in stock
    // 2. Product is not in user's cart

    // Find or create cart
    let cart = await Cart.findOne({ orderedBy: userEmail });
    if (!cart) {
      cart = new Cart({ orderedBy: userEmail, products: [] });
    }

    // Add the product
    cart.products.push({
      productId: String(product._id),
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      deliveryTime: product.deliveryTime
    });

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart
    });

  } catch (error) {
    console.error("Error in addToCart:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ success: false, message: "User email is required" });
    }

    // Find cart for the user
    const cart = await Cart.findOne({ orderedBy: userEmail });

    if (!cart) {
      return res.status(200).json({ success: true, cart: { products: [] } });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, userEmail } = req.body;

    // Basic validation
    if (!productId || !userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID and user email are required" 
      });
    }

    // Find the cart and remove the product
    const cart = await Cart.findOne({ orderedBy: userEmail });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart not found" 
      });
    }

    // Remove the product from the products array
    cart.products = cart.products.filter(product => product.productId !== productId);
    
    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart
    });

  } catch (error) {
    console.error("Error in removeFromCart:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart
};
