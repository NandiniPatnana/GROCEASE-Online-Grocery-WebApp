import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5432/api/admin/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5432/api/admin/products/${productId}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleUpdateQuantity = async (productId, currentQuantity) => {
    const newQuantity = window.prompt('Enter new quantity:', currentQuantity);
    if (newQuantity === null || newQuantity === '') return;

    const quantityNumber = parseInt(newQuantity);
    if (isNaN(quantityNumber) || quantityNumber < 0) {
      alert('Please enter a valid number for quantity');
      return;
    }

    try {
      await axios.put(`http://localhost:5432/api/admin/products/${productId}`, {
        quantity: quantityNumber
      });
      fetchProducts();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <Link
          to="/admin/add-product"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg p-4 shadow bg-white">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="font-bold mb-2">₹{product.price}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
            <p className="text-sm text-gray-500 mb-4">Quantity: {product.quantity}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleUpdateQuantity(product._id, product.quantity)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Update Quantity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
