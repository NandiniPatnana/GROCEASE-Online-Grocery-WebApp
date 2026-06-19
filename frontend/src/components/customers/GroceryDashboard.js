import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setAuthHeader } from "../../utils/auth";
import axios from "axios";

const GroceryDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartLoading, setCartLoading] = useState({}); // Stores loading state per product
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();

  // Initialize auth header only once when component mounts
  useEffect(() => {
    setAuthHeader(axios);
  }, []);

  // Function to handle manual product reload
  const handleReloadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5432/api/admin/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Try again later.");
    }

    setLoading(false);
  };

  // Fetch products from API
  useEffect(() => {
    handleReloadProducts();
  }, []); // Only run once when component mounts

  const addToCart = async (productId) => {
    // If already loading for this product, don't do anything
    if (cartLoading[productId]) {
      return;
    }

    if (!getToken()) {
      navigate("/login");
      return;
    }
  
    setCartLoading((prev) => ({ ...prev, [productId]: true }));
    setCartMessage("");
  
    try {
        const response = await axios.post("http://localhost:5432/api/customer/add-to-cart", { 
        productId,
        userEmail: sessionStorage.getItem('userEmail')
      });
      
      if (response.data.success) {
        alert("Product added to cart successfully!");
      } else {
        alert(response.data.message || "Failed to add product to cart.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add product to cart.");
      
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Fresh Groceries</h1>
          <p className="text-gray-600">Fast delivery to your doorstep</p>
        </div>
        <button
          onClick={handleReloadProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          Reload Products
        </button>
      </div>

      {/* Handle Loading & Errors */}
      {loading && <p className="text-center text-gray-600">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {cartMessage && <p className="text-center text-green-600">{cartMessage}</p>}



      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Product Image */}
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            
            {/* Product Details */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{product.quantity}</span>
                  <span className="font-bold">${product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <span
                    className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={!product.inStock || cartLoading[product._id]}
                    className={`w-full py-2 px-4 rounded-lg ${
                      !product.inStock
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : cartLoading[product._id]
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {cartLoading[product._id] 
                      ? "Adding..." 
                      : !product.inStock 
                      ? "Out of Stock" 
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryDashboard;
