import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Truck, Clock, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    { id: 1, title: "Total Orders", value: "1,245", color: "bg-blue-500" },
    { id: 2, title: "Total Revenue", value: "₹58,340", color: "bg-green-500" },
    { id: 3, title: "Total Users", value: "3,520", color: "bg-yellow-500" },
    { id: 4, title: "Total Products", value: "245", color: "bg-purple-500" },
  ];

  const features = [
    { icon: <ShoppingBag size={24} />, title: 'Fresh Products', description: 'Hand-picked fresh groceries from local farms' },
    { icon: <Truck size={24} />, title: 'Fast Delivery', description: 'Same-day delivery to your doorstep' },
    { icon: <Clock size={24} />, title: '24/7 Support', description: 'Round-the-clock customer service' },
    { icon: <Shield size={24} />, title: 'Secure Payments', description: 'Safe and secure payment methods' }
  ];

  const categories = [
    { name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { name: 'Bakery Items', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            alt="Fresh groceries"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to Admin Dashboard</h1>
            <p className="text-xl mb-8">Manage your products, orders, and customers all in one place.</p>
            <Link
              to="/admin/products"
              className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={index} to="/admin/products" className="group">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
