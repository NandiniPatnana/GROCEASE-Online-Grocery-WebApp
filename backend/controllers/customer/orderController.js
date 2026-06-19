const Order = require("../../models/Order");
const Cart = require("../../models/Cart");

const placeOrder = async (req, res) => {
  try {
    const { userEmail, shippingAddress, cartItems } = req.body;

    // Basic validation
    if (!userEmail || !shippingAddress || !cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User email, shipping address and cart items are required"
      });
    }

    // Calculate expected delivery date (2 days from now)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 2);

    // Create individual orders for each product
    const orderPromises = cartItems.map(async (product) => {
      const order = new Order({
        orderedBy: userEmail,
        products: [product],
        totalCost: product.price * product.quantity,
        shippingAddress,
        paymentMethod: "cod",
        status: "pending",
        expectedDeliveryDate // Add expected delivery date
      });
      return order.save();
    });

    // Wait for all orders to be created
    const orders = await Promise.all(orderPromises);

    // Clear the cart after successful order placement
    await Cart.findOneAndUpdate(
      { orderedBy: userEmail },
      { $set: { products: [] } }
    );

    return res.status(200).json({
      success: true,
      message: "Orders placed successfully",
      orders
    });

  } catch (error) {
    console.error("Error in placeOrder:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required"
      });
    }

    const orders = await Order.find({ orderedBy: userEmail })
      .sort({ createdAt: -1 }); // Most recent orders first

    return res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("Error in getOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  placeOrder,
  getOrders
};
