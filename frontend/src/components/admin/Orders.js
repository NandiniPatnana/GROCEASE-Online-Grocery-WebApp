import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, setAuthHeader } from "../../utils/auth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState("all");
  const [uniqueEmails, setUniqueEmails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthHeader(axios);
    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    // Update filtered orders whenever orders or selectedEmail changes
    if (selectedEmail === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.orderedBy === selectedEmail));
    }
  }, [orders, selectedEmail]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await axios.get('http://localhost:5432/api/admin/orders');
      console.log('Response:', response.data);
      
      if (response.data.success) {
        const fetchedOrders = response.data.orders;
        setOrders(fetchedOrders);
        
        // Extract unique emails
        const emails = [...new Set(fetchedOrders.map(order => order.orderedBy))];
        setUniqueEmails(emails);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.response || error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      setError(errorMessage);
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const response = await axios.post(`http://localhost:5432/api/admin/orders/${orderId}`, {
        status: newStatus
      });

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error.response || error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status';
      alert(errorMessage);
    } finally {
      setUpdatingStatus(null);
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

  // Check if order status is cancelled or delivered
  const isStatusLocked = (status) => {
    return status === 'cancelled' || status === 'delivered';
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Orders Management</h1>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Orders Management</h1>
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
    <div className="p-0">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h1>
      
      {/* Email Filter Box */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <label htmlFor="email-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Customer Email
        </label>
        <select
          id="email-filter"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="w-full md:w-64 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Customers</option>
          {uniqueEmails.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: <span className="font-semibold">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer: <span className="font-semibold">{order.orderedBy}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Ordered on: <span className="font-semibold">{formatDate(order.orderDate)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      disabled={updatingStatus === order._id || isStatusLocked(order.status)}
                      className={`px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${isStatusLocked(order.status) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {updatingStatus === order._id ? 'Updating...' : 
                        order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Products */}
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold mb-2">Products</h3>
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div key={product._id} className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {product.quantity} • Price: ₹{product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Expected Delivery: <span className="font-semibold">{formatDate(order.expectedDeliveryDate)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment: <span className="font-semibold">{order.paymentMethod.toUpperCase()}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs
                        ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>
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

export default Orders;