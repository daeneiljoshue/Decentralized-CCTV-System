const express = require('express');
const {
  Setting, User, Role, Permission, sequelize, Sequelize, // Assuming data models
} = require('../models'); // Replace with your database models
const verifyToken = require('./users').verifyToken; // Assuming authorization middleware

const router = express.Router();

// ... (existing authorization middleware)

// Get all system-wide settings (admin only)
router.get('/settings', verifyToken, async (req, res) => {
  try {
    if (!canAccessSettings(req.user, 'read-all')) { // Role-based access control
      return res.status(403).json({ message: 'Unauthorized to access all settings' });
    }

    const settings = await Setting.findAll();
    const filteredSettings = filterSettings(settings, req.user); // Filter based on permissions
    res.json(filteredSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific setting by key (admin or authorized users with appropriate permissions)
router.get('/settings/:key', verifyToken, async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: req.params.key } });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    if (!canAccessSetting(req.user, setting, 'read')) { // Permission-based access control
      return res.status(403).json({ message: 'Unauthorized to access this setting' });
    }

    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new setting (admin only)
router.post('/settings', verifyToken, async (req, res) => {
  try {
    if (!canAccessSettings(req.user, 'create')) {
      return res.status(403).json({ message: 'Unauthorized to create settings' });
    }

    // Validate setting data and enforce constraints
    if (!validateSettingData(req.body)) {
      return res.status(400).json({ message: 'Invalid setting data' });
    }

    // Check for existing setting with the same key and handle overwrites/conflicts
    const existingSetting = await Setting.findOne({ where: { key: req.body.key } });
    if (existingSetting) {
      // Decide on overwrite behavior or error handling
    }

    const setting = await Setting.create(req.body);
    res.json(setting);
  } catch (error) {
    console.error('Error creating setting:', error);
    // Handle Sequelize errors like unique constraint violations
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update an existing setting (admin or authorized users with appropriate permissions)
router.put('/settings/:key', verifyToken, async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: req.params.key } });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    if (!canAccessSetting(req.user, setting, 'update')) {
      return res.status(403).json({ message: 'Unauthorized to update this setting' });
    }

    // Validate updated setting data (if applicable)

    await setting.update(req.body);
    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/settings/:key', verifyToken, async (req, res) => {
    try {
      if (!canAccessSettings(req.user, 'delete')) {
        return res.status(403).json({ message: 'Unauthorized to delete settings' });
      }
  
      const setting = await Setting.findOne({ where: { key: req.params.key } });
      if (!setting) {
        return res.status(404).json({ message: 'Setting not found' });
      }
  
      // Implement additional checks to prevent unintended deletion:
      // - Check if the setting is currently in use by other entities (e.g., cameras, users).
      //   If so, provide options to handle these relationships or prevent deletion.
      // - Consider requiring confirmation or justification for certain settings deletion.
  
      await setting.destroy();
      res.json({ message: 'Setting deleted successfully' });
    } catch (error) {
      console.error('Error deleting setting:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  