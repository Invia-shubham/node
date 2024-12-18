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
 *     description: Retrieve a list of all categories with pagination.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of categories per page.
 *     responses:
 *       200:
 *         description: A list of categories with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalCategories:
 *                       type: integer
 *                       example: 50
 *       500:
 *         description: Internal server error
 */

router.get("/category", verifyToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const skip = (page - 1) * limit;
    const categories = await Category.find().skip(skip).limit(limit);
    const totalCategory = await Category.countDocuments();
    res
      .status(200)
      .json({
        categories: categories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCategory / limit),
          totalCategory: totalCategory,
        },
      });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
