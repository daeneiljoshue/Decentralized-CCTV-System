const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { User, Session } = require('../models'); // Assuming data models

const router = express.Router();

// Rate limiting middleware (adjust limits as needed)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow 10 attempts per window
  message: 'Too many login attempts. Please try again later.',
});

// Input validation (consider using a validation library)
const validateLogin = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
};

// POST /login
router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password hashes
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create an authentication token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create or update session (add 2FA logic here)
    const session = await Session.createOrUpdate({ userId: user.id }, req.ip);

    // Respond with token and session ID
    res.json({ token, sessionId: session.id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
