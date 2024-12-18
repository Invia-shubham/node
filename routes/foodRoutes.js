const express = require("express");
const Food = require("../models/foodSchema");
const router = express.Router();
const verifyToken = require("./Authorization/verifyToken");

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Operations related to food items
 */

/**
 * @swagger
 * /food:
 *   post:
 *     summary: Add a new food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Paneer Butter Masala"
 *               description:
 *                 type: string
 *                 example: "A creamy dish made with paneer"
 *               price:
 *                 type: number
 *                 example: 150
 *               image:
 *                 type: string
 *                 example: "https://example.com/paneer.jpg"
 *               category:
 *                 type: string
 *                 example: "vegetarian"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paneer", "Tomato", "Butter", "Spices"]
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               servings:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Food item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Food item added successfully"
 *                 savedFoodItem:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: Bad Request, missing required fields
 *       500:
 *         description: Internal Server Error
 */

router.post("/food", verifyToken, async (req, res) => {
  const {
    name,
    description,
    price,
    image,
    category,
    ingredients,
    isAvailable,
    rating,
    servings,
  } = req.body;
  try {
    if (
      !name ||
      !price ||
      !image ||
      !category ||
      !ingredients ||
      !rating ||
      !servings
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const newFoodItem = new Food({
      name,
      description,
      price,
      image,
      category,
      ingredients,
      isAvailable,
      rating,
      servings,
    });

    const savedFoodItem = await newFoodItem.save();
    res
      .status(201)
      .json({ message: "Food item added successfully", savedFoodItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding food item" });
  }
});

/**
 * @swagger
 * /food:
 *   get:
 *     summary: Get food items with filters
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filter food items by category (e.g., vegetarian, non-vegetarian)
 *         required: false
 *         schema:
 *           type: string
 *           example: "vegetarian"
 *       - name: isAvailable
 *         in: query
 *         description: Filter food items by availability (true/false)
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: minPrice
 *         in: query
 *         description: Filter food items by minimum price
 *         required: false
 *         schema:
 *           type: number
 *           example: 100
 *       - name: maxPrice
 *         in: query
 *         description: Filter food items by maximum price
 *         required: false
 *         schema:
 *           type: number
 *           example: 500
 *     responses:
 *       200:
 *         description: Successfully fetched the list of food items based on provided filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Food items fetched successfully"
 *                 foodItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Bad Request, invalid query parameters
 */

router.get("/food", verifyToken, async (req, res) => {
  try {
    const { category, isAvailable, minPrice, maxPrice } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (isAvailable) {
      query.isAvailable = isAvailable === "true";
    }

    if (minPrice) {
      query.price = { $gte: Number(minPrice) };
    }

    if (maxPrice) {
      if (!query.price) query.price = {};
      query.price.$lte = Number(maxPrice);
    }

    const foodItems = await Food.find(query);

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: foodItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching food items" });
  }
});

/**
 * @swagger
 * /food/{id}:
 *   put:
 *     summary: Update a food item by ID
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the food item to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Spicy Paneer Tikka"
 *               description:
 *                 type: string
 *                 example: "A spicy grilled paneer dish"
 *               price:
 *                 type: number
 *                 example: 160
 *               image:
 *                 type: string
 *                 example: "https://example.com/spicy_paneer.jpg"
 *               category:
 *                 type: string
 *                 example: "vegetarian"
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Paneer", "Chili", "Spices"]
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               rating:
 *                 type: number
 *                 example: 4.8
 *               servings:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Food item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Food item updated successfully"
 *                 updatedFoodItem:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: No fields to update or invalid input
 *       404:
 *         description: Food item not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/food/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      image,
      category,
      ingredients,
      isAvailable,
      rating,
      servings,
    } = req.body;
    if (
      !name &&
      !description &&
      !price &&
      !image &&
      !category &&
      !ingredients &&
      !isAvailable &&
      !rating &&
      !servings
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const updatedFoodItem = await Food.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        image,
        category,
        ingredients,
        isAvailable,
        rating,
        servings,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res
      .status(200)
      .json({ message: "Food item updated successfully", updatedFoodItem });
  } catch (error) {
    res.status(500).json({ message: "Error updating food item" });
  }
});

module.exports = router;
