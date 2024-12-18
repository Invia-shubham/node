const express = require("express");
const Category = require("../models/categorySchema");
const router = express.Router();
const verifyToken = require("./Authorization/verifyToken");


router.post("/category", verifyToken, async (req, res) => {
  const { categoryName } = req.body;

  const existingCategory = await Category.findOne({ categoryName });
  if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const newCategory = new Category({
    categoryName,
  });

  try {
    const savedCategory = await newCategory.save();
    res
      .status(201)
      .json({ message: "Category created successfully", savedCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/category", verifyToken, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
