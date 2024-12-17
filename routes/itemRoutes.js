const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Category = require("../models/categorySchema");
const mongoose = require("mongoose");

router.post("/item", async (req, res) => {
  const { name, description, quantity, categoryId } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  const newItem = new Item({
    name,
    description,
    quantity,
    category: category._id,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Item created successfully", savedItem });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const item = await Item.find().populate("category");
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/item/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/items/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const items = await Item.find({ category: categoryId }).populate(
      "category"
    );

    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this category", items });
    }

    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Item by ID (U)
router.put("/item/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Item by ID (D)
router.delete("/item/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (deletedItem) {
      res.json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
