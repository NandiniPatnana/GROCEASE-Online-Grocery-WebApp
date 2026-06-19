import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import GroceryDashboard from "./components/customers/GroceryDashboard";
import Cart from "./components/customers/Cart";
import MyOrders from "./components/customers/MyOrders";
import CustomerLayout from "./components/customers/CustomerLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Orders from "./components/admin/Orders";
import Products from "./components/admin/Products";
import AddProduct from "./components/admin/AddProduct";
import LandingPage from "./components/common/index";
import AdminDashboard from "./components/admin/adminDashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Main content with padding for fixed navbar */}
        <main className="flex-grow pt-16">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<GroceryDashboard />} />
              <Route path="cart" element={<Cart />} />
              <Route path="orders" element={<MyOrders />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
