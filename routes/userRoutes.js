const express = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');

const router = express.Router();

// CREATE - Add a new user
router.post('/users', async (req, res) => {
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
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// READ - Get a user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// UPDATE - Update user details
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, firstName, lastName, profilePic } = req.body;

  try {
    // Find the user and update
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE - Delete a user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
