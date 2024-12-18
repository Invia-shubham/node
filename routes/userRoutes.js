const express = require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("./Authorization/verifyToken");

const router = express.Router();

// CREATE - Add a new user
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with username, email, and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               firstName:
 *                 type: string
 *                 description: The first name of the user
 *               lastName:
 *                 type: string
 *                 description: The last name of the user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request or validation error
 */

router.post("/users", async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  try {
    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Save the user
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all users
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 */

router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// READ - Get a user by ID
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve details of a specific user by their unique ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 */

router.get("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// UPDATE - Update user details
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's details
 *     description: Update the username, email, password, or profile details of a user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profilePic:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 */

router.put("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, password, firstName, lastName, profilePic } =
    req.body;

  try {
    // Find the user and update
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If password is provided, hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profilePic = profilePic || user.profilePic;

    // Save the updated user
    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE - Delete a user
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Permanently delete a specific user from the system.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 */

router.delete("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//login api
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Login using email and password to receive a JWT token for further authentication.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login Successfully"
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 */

const JWT_SECRET = "key";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      message: "Login Successfully",
      token,
      user: {
        userName: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error during login", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
