const express = require("express");
const Category = require("../models/categorySchema");
const router = express.Router();
const verifyToken = require("./Authorization/verifyToken");

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category with the specified name.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: The name of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *                 savedCategory:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Category already exists or bad request
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.get("/category", verifyToken, async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
