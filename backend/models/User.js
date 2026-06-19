const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: [/^\d{10}$/, "Enter a valid 10-digit mobile number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    role: {
      type: String,
      enum: ["customer", "shop-owner"], // Allowed values
      default: "customer", // Default role is "customer"
    },
    password:{
      type:String,
      required:true
    }
  },
  { timestamps: true } // Adds createdAt & updatedAt fields automatically
);

module.exports = mongoose.model("User", UserSchema);
