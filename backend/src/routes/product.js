import express from "express";
import Product from "../models/product.js";
import jwtAuth from "../middleware/jwtAuth.js";

const productRouter = express.Router();

// add, update, delete, fetch
const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

productRouter.post("/addProduct", jwtAuth(), async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const { sku } = req.body;
    if (!sku) {
      return res.status(400).json({ message: "SKU is required" });
    }
    console.log("request : ", req.body);

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: "Product with this SKU already exists" });
    }

    const product = new Product(req.body);
    await product.save();

    res
      .status(201)
      .json({ message: "Product added successfully", data: product });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

productRouter.get("/getById/:id", jwtAuth(), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

productRouter.put("/update/:id", jwtAuth([ROLES.ADMIN]), async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

productRouter.delete("/delete/:id",jwtAuth([ROLES.ADMIN]), async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ 
      message: "Product deleted successfully", 
      data: deletedProduct, 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

productRouter.get("/get/all",jwtAuth(), async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

    try {
      const products = await Product.find();
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No product items found' });
      }
  
      res.status(200).json({ message: 'Products fetched successfully', data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export default productRouter;