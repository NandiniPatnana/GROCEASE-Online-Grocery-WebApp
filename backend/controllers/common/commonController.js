const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a strong secret in production

// Controller to Add a New User
const addUser = async (req, res) => {
  try {
    const { fullName, email, mobile, address, role, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobile || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role (optional)
    if (role && !["customer", "shop-owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Choose 'customer' or 'shop-owner'." });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if the mobile number is already in use
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ message: "Mobile number already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salt
    // Create a new user
    const newUser = new User({
      fullName,
      email,
      mobile,
      address,
      role: role || "customer", // Default role is "customer"
      password: hashedPassword, // Store the hashed password
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// User Login Function
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if(email==="admin@gmail.com" && password==="admin@123"){
      console.log("admin login");
      // Generate JWT Token for admin
      const token = jwt.sign(
        { role: 'admin' },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          email: email,
          role: 'admin'
        }
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { addUser, userLogin };
