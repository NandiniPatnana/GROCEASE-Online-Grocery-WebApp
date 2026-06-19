const express = require("express");
const {addProduct,getAllProducts, getProductById, updateProduct, deleteProduct}=require("../../controllers/admin/handleProducts")

const router = express.Router();
router.post("/add-product",addProduct)
router.get("/products",getAllProducts)
router.get("/products/:id",getProductById)
router.put("/products/:id",updateProduct)
router.delete("/products/:id",deleteProduct)

module.exports = router;
