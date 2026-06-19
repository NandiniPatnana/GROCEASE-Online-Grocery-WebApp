const Product = require("../../models/Product");

// @desc    Add a new product
// @route   POST /api/admin/add-product
// @access  Admin
const addProduct = async (req, res) => {
  try {
    const { name, price, quantity,imageUrl, category, inStock, deliveryTime } = req.body;

    if (!name || !price || !quantity || !category) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const newProduct = new Product({
      name,
      price,
      quantity,
      imageUrl,
      category,
      inStock,
      deliveryTime,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Admin
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/admin/products/:id
// @access  Admin
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Invalid Product ID" });
  }
};

// @desc    Update a product by ID
// @route   PUT /api/admin/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: "Invalid Product ID" });
  }
};

// @desc    Delete a product by ID
// @route   DELETE /api/admin/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Invalid Product ID" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
