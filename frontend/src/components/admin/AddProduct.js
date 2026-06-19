import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    imageUrl: "",
    inStock: true,
    deliveryTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!product.name || !product.price || !product.quantity || !product.category || !product.imageUrl) {
      setMessage("Please fill all required fields.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5432/api/admin/add-product", product);
      setMessage("Product added successfully!");
      setProduct({ 
        name: "", 
        price: "", 
        quantity: "", 
        category: "", 
        imageUrl: "",
        inStock: true, 
        deliveryTime: "" 
      });
    } catch (error) {
      setMessage("Error adding product. Try again.");
      console.error("Add Product Error:", error);
    }
    setLoading(false);
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {message && <p className="text-red-500 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700">Price ($)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-gray-700">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Vegetables">Vegetables</option>
          </select>
        </div>

        {/* In Stock */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={product.inStock}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-gray-700">In Stock</label>
        </div>

        {/* Delivery Time */}
        <div>
          <label className="block text-gray-700 hidden">Delivery Time</label>
          <input
            type="text"
            name="deliveryTime"
            value={product.deliveryTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-md hidden"
            placeholder="e.g., 30-45 min"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
