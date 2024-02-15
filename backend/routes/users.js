const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For token-based authentication
const { User, Role, Permission } = require('../models'); // Your data models

const router = express.Router();

// Middleware for token verification (replace with your auth strategy)
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Get all users (authorized users only)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        include: {
          model: Permission,
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific user by ID (authorized users with appropriate permissions)
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Role,
        include: {
          model: Permission,
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check authorization based on user roles and permissions (if needed)
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new user (admin or authorized users only)
router.post('/users', verifyToken, async (req, res) => {
  try {
    const { name, email, password, roles, permissions } = req.body;

    // Validate user data (e.g., email format, password strength)
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roles,
      permissions,
    });

    // Associate roles and permissions
    // ... (implement logic to associate roles and permissions based on data)

    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Update an existing user (admin or authorized users only)
// ... other routes

// Update an existing user (admin or authorized users only)
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { name, email, password, roles, permissions } = req.body;

    // Validate user data (if applicable)

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data as needed
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (name) user.name = name;
    if (email) user.email = email;

    // Update roles and permissions
    // ... (implement logic to update roles and permissions)

    await user.save(); // Save the updated user
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}); // <-- Added the missing closing curly brace here

    // Update roles and permissions
    // ... (implement}
