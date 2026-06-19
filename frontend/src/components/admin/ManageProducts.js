import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5432/api/admin/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle input change for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  // Handle product update
  const handleUpdate = async () => {
    if (!editProduct) return;
    
    setLoading(true);
    try {
      await axios.put(`http://localhost:5432/api/admin/products/${editProduct._id}`, editProduct);
      setProducts(products.map((p) => (p._id === editProduct._id ? editProduct : p)));
      setMessage("Product updated successfully!");
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage("Error updating product. Try again.");
    }
    setLoading(false);
  };

  // Handle product delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5432/api/admin/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      setMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product. Try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-12">
      <h2 className="text-2xl font-bold mb-4 mt-12">Manage Products</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Price ($)</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center border">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => setEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>

            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={editProduct.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2"
            />

            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={editProduct.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2"
            />

            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={editProduct.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2"
            />

            <label className="block text-gray-700">Stock</label>
            <select
              name="inStock"
              value={editProduct.inStock}
              onChange={(e) =>
                setEditProduct({ ...editProduct, inStock: e.target.value === "true" })
              }
              className="w-full p-2 border rounded-md mb-2"
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
