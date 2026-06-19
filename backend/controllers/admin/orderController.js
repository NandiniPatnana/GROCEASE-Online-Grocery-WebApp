const Order = require("../../models/Order");
const Product = require("../../models/Product");

const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Most recent orders first
      .lean(); // Convert to plain JS objects for better performance

    console.log(`Found ${orders.length} orders`);
    console.log(orders);
    
    return res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // If status is being updated to delivered, update product stock
    if (status === "delivered") {
      try {
        // Update stock for each product in the order
        for (const product of order.products) {
          const productDoc = await Product.findById(product.productId);
          if (productDoc) {
            console.log(`Updating stock for product ${product.name}`);
            console.log(`Current stock: ${productDoc.quantity}, Ordered quantity: ${product.quantity}`);
            productDoc.quantity = Math.max(0, productDoc.quantity - product.quantity);
            console.log(`New stock: ${productDoc.quantity}`);
            await productDoc.save();
          }
        }
      } catch (error) {
        console.error("Error updating product stock:", error);
        return res.status(500).json({
          success: false,
          message: "Error updating product stock",
          error: error.message
        });
      }
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus
};
