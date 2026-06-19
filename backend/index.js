const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors"); // Import CORS
require("dotenv").config();


// Import routes
const adminRoutes = require('./routes/admin/adminRoutes');
const customerRoutes = require('./routes/customer/customerRoutes');
const orderRoutes = require('./routes/customer/orderRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const commonRoutes = require('./routes/common/commonRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

//This is a default route

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON
connectDB();

// Use routes
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/customer/orders', orderRoutes);
app.use('/', adminOrderRoutes); // Mount at root since routes include full path
app.use('/api/common', commonRoutes);
app.use('/api/users', userRoutes);

// const PORT = 5432;
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
