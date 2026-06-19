import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, setAuthHeader } from "../../utils/auth";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAuthHeader(axios);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5432/api/customer/orders/get-orders?userEmail=${userEmail}`);
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders');
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Orders</h1>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Orders</h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/customer')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: <span className="font-semibold">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Ordered on: <span className="font-semibold">{formatDate(order.orderDate)}</span>
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Products */}
              {order.products.map((product) => (
                <div key={product._id} className="px-6 py-4 border-b last:border-0">
                  <div className="flex items-center">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">
                        Quantity: {product.quantity} • Price: ₹{product.price}
                      </p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Expected Delivery: <span className="font-semibold">{formatDate(order.expectedDeliveryDate)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment Method: <span className="font-semibold">{order.paymentMethod.toUpperCase()}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      Total: ₹{order.totalCost}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
