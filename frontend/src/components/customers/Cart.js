import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, setAuthHeader } from "../../utils/auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      console.log("No token found");
      navigate("/login");
      return;
    }

    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) {
        setError("User not logged in");
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:5432/api/customer/get-cart?userEmail=${userEmail}`);
      
      if (response.data.success) {
        setCartItems(response.data.cart?.products || []);
      } else {
        setError(response.data.message || "Failed to fetch cart items");
      }
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setError(`Failed to load cart items: ${err.response?.data?.message || err.message}`);
      
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAuthHeader(axios);
    fetchCart();
  }, [navigate]);

  // Function to handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
    // TODO: Update quantity in backend
  };

  // Function to remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please login to remove items from cart');
        navigate("/login");
        return;
      }

      const response = await axios.post('http://localhost:5432/api/customer/remove-from-cart', {
        productId,
        userEmail
      });

      if (response.data.success) {
        setCartItems(cartItems.filter((item) => item.productId !== productId));
        alert('Product removed from cart successfully');
      } else {
        alert(response.data.message || 'Failed to remove product from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error.response?.data || error);
      alert(error.response?.data?.message || 'Failed to remove product from cart');
    }
  };

  // Function to handle order placement
  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please login to place an order');
        navigate("/login");
        return;
      }

      // For now, using a default shipping address
      const shippingAddress = {
        street: "123 Main St",
        city: "Sample City",
        state: "Sample State",
        pincode: "123456"
      };

      const response = await axios.post('http://localhost:5432/api/customer/orders/place-order', {
        userEmail,
        shippingAddress,
        cartItems // Send current cart items to ensure consistency
      });

      if (response.data.success) {
        alert('Orders placed successfully!');
        setCartItems([]); // Clear cart items locally
        navigate('/customer'); // Redirect to products page
      } else {
        alert(response.data.message || 'Failed to place orders');
      }
    } catch (error) {
      console.error('Error placing orders:', error.response?.data || error);
      alert(error.response?.data?.message || 'Failed to place orders');
      
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setOrderLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 Your Cart</h1>
        <p className="text-gray-600">Loading cart items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 Your Cart</h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => {
            setError("");
            fetchCart();
          }}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mt-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigate("/customer")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b py-4"
            >
              {/* Product Image */}
              <div className="w-24 h-24 mr-4 flex-shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-gray-600">Price: ₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-600 hover:text-red-800 px-2 py-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
            <button 
              onClick={handlePlaceOrder}
              disabled={orderLoading || cartItems.length === 0}
              className={`mt-4 px-6 py-2 rounded-lg ${
                orderLoading || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {orderLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
