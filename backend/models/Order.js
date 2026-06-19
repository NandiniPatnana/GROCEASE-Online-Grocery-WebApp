// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     orderedBy: {
//       type: String, // User's email
//       required: true,
//       trim: true,
//     },
//     products: [
//       {
//         name: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         productId: {
//           type: String,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         category: {
//           type: String,
//           required: true,
//         },
//         imageUrl: {
//           type: String,
//           trim: true,
//         }
//       }
//     ],
//     status: {
//       type: String,
//       required: true,
//       enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
//       default: "pending"
//     },
//     totalCost: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     shippingAddress: {
//       street: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       city: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       state: {
//         type: String,
//         required: true,
//         trim: true,
//       },
//       pincode: {
//         type: String,
//         required: true,
//         trim: true,
//       }
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//       enum: ["cod", "online"],
//       default: "cod"
//     },
//     paymentStatus: {
//       type: String,
//       required: true,
//       enum: ["pending", "completed", "failed"],
//       default: "completed"
//     },
//     orderDate: {
//       type: Date,
//       default: Date.now,
//     },
//     expectedDeliveryDate: {
//       type: Date,
//       required: true,
//     }
//   },
//   { timestamps: true }
// );

// // Calculate expected delivery date (2 days from order date)
// OrderSchema.pre('save', function(next) {
//   if (!this.expectedDeliveryDate) {
//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + 2);
//     this.expectedDeliveryDate = deliveryDate;
//   }
//   next();
// });

// const Order = mongoose.model("Order", OrderSchema);

// module.exports = Order;




















const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    orderedBy: {
      type: String, // User's email
      required: true,
      trim: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        productId: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        category: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          trim: true,
        }
      }
    ],
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        required: true,
        trim: true,
      }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "online"],
      default: "cod"
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending"   // 🔴 CHANGED: was "completed", now correctly starts as "pending"
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

// Calculate expected delivery date (2 days from order date)
OrderSchema.pre('save', function(next) {
  if (!this.expectedDeliveryDate) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    this.expectedDeliveryDate = deliveryDate;
  }


  // Only auto-manage this for COD orders — online payments are handled separately at checkout
  if (this.paymentMethod === "cod") {
    if (this.status === "delivered") {
      this.paymentStatus = "completed";
    } else if (
      this.status === "pending" ||
      this.status === "processing" ||
      this.status === "shipped" ||
      this.status === "cancelled"
    ) {
      this.paymentStatus = "pending";
    }
  }

  next();
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;