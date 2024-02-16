const express = require('express');
const simplePeer = require('simple-peer');
const fs = require('fs'); // For local recording (consider alternatives)
// Integrate cloud storage library if user chooses cloud storage
const { Camera, User, Role, Permission } = require('../models'); // Assuming data models
const verifyToken = require('./users').verifyToken;

const router = express.Router();

// Middleware for token verification (replace with your auth strategy)
const verifyToken = require('./users').verifyToken;

// ... (existing authorization middleware)

// GET all cameras (admin or authorized users with appropriate permissions)
router.get('/cameras', verifyToken, async (req, res) => {
  try {
    // Filter cameras based on user permissions (if needed)
    const filteredCameras = await Camera.findAll({
      where: getUserCameraFilter(req.user),
    });

    res.json(filteredCameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET a specific camera details by ID (authorized users with appropriate permissions)
router.get('/cameras/:id', verifyToken, async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Check authorization based on user roles and permissions
    if (!canAccessCamera(req.user, camera)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(camera);
  } catch (error) {
    console.error('Error fetching camera:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// CREATE a new camera (admin or authorized users only)
router.post('/cameras', verifyToken, async (req, res) => {
  try {
    // Validate camera data and enforce unique constraints
    if (!validateCameraData(req.body)) {
      return res.status(400).json({ message: 'Invalid camera data' });
    }

    // Check authorization to create cameras
    if (!canCreateCamera(req.user)) {
      return res.status(403).json({ message: 'Unauthorized to create cameras' });
    }

    const camera = await Camera.create(req.body);
    res.json(camera);
  } catch (error) {
    console.error('Error creating camera:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ message: 'Camera with this name or IP address already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// UPDATE an existing camera (admin or authorized users with appropriate permissions)
router.put('/cameras/:id', verifyToken, async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Check authorization to update cameras
    if (!canUpdateCamera(req.user, camera)) {
      return res.status(403).json({ message: 'Unauthorized to update this camera' });
    }

    // Validate updated camera data (if applicable)

    await camera.update(req.body);
    res.json(camera);
  } catch (error) {
    console.error('Error updating camera:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE a camera (admin or authorized users only)
// DELETE a camera (admin or authorized users only)
router.delete('/cameras/:id', verifyToken, async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Check authorization to delete cameras
    if (!canDeleteCamera(req.user, camera)) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Assuming you'll have code here to actually delete the camera
    // ... existing code within router.delete
    // Adapt the code to your specific data access method and error handling needs.
    // Thoroughly test the deletion functionality to ensure it works as expected and handles errors gracefully.

  try {
  // ... existing checks
    await Camera.destroy({ where: { id: camera.id } });
    res.status(200).json({ message: 'Camera deleted successfully' });
 } catch (error) {
   // Handle deletion errors (e.g., logging, specific error messages)
    console.error(error);
    res.status(500).json({ message: 'Failed to delete camera' });
 }

  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(error);
    res.status(500).json({ message: 'Failed to delete camera' });
  }
}); // <-- Closing parentheses for the route handler


// ... Existing "GET, POST, PUT, DELETE endpoints for cameras (including authorization and filtering) ...

// Start a live stream from a camera
router.get('/cameras/:id/stream', verifyToken, async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Access control based on user roles and permissions
    if (!canAccessCamera(user, camera)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const peer = new simplePeer({ initiator: true, trickle: false });

    // Connect to camera's stream using simplePeer (replace with your camera logic)
    await connectToCameraStream(camera, peer);

    peer.on('signal', signal => {
      res.json({ signal }); // Send signal to client for connection
    });

    peer.on('stream', stream => {
      // Forward stream to client (optimized for performance)
      stream.pipe(res);
    });

    // Handle errors and disconnections (add appropriate logic)
  } catch (error) {
    console.error('Error starting stream:', error);
    res.status(500).json({ message: 'Failed to start stream' });
  }
}),

// Start/stop recording for a camera
router.post('/cameras/:id/record', verifyToken, async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    // Access control based on user roles and permissions
    if (!canRecordCamera(user, camera)) {
      return res.status(403).json({ message: 'Unauthorized to record' });
    }

    if (req.body.storage === 'local') { // User chooses local storage

      // Local recording using fs (consider alternatives)
      if (!camera.recording) {
        const timestamp = Date.now();
        const recordingPath = `recordings/${camera.id}/${timestamp}.mp4`;
        camera.recording = true;
        camera.recordingStream = camera.stream.pipe(fs.createWriteStream(recordingPath));
        camera.recordingStartTime = timestamp;

        await camera.save();

        res.json({ message: 'Recording started', recordingPath });
      } else {
        camera.recording = false;
        camera.recordingStream.end();
        camera.recordingEndTime = Date.now();

        await camera.save();

        res.json({ message: 'Recording stopped', recordingPath });
      }
    } else if (req.body.storage === 'cloud') { // User chooses cloud storage

      // Integrate cloud storage library and upload logic
      // Replace this with your specific cloud storage implementation
      res.status(501).json({ message: 'Cloud storage not yet implemented' });
    } else {
      res.status(400).json({ message: 'Invalid storage option' });
    }
  } catch (error) {
    console.error('Error recording camera:', error);
    res.status(500).json({ message: 'Failed to record camera' });
  }
})



// Implement event detection (facial recognition, license plate detection, motion detection) using suitable libraries/services:
// - Integrate libraries/services (e.g., TensorFlow, OpenCV)
// - Process camera stream for events
// - Create/update events in the database
// - Trigger actions based on event types (e.g., notifications, recordings)

// Implement access control based on user roles and permissions:
// - Define roles and permissions in the data model (e.g., `Role`, `Permission`)
// - Associate roles with users (e.g., `User.hasOne(Role)`)
// - Assign permissions to roles (e.g., `Role.hasMany(Permission)`)
// - Use authorization middleware to check user permissions before accessing camera-related endpoints

// Adjust the authorization criteria and data access methods to align with your system's user management model and database structure.
// Consider additional factors like camera ownership, location restrictions, or time-based access rules if applicable.
async function canAccessCamera(user, camera) {
  // Retrieve user roles and permissions (adjust data access logic accordingly)
  const userRoles = await getUserRoles(user.id);
  const userPermissions = await getUserPermissions(user.id);

  // Define authorization criteria (adapt to your specific requirements)
  const authorized =
    (userRoles.includes("admin") || userRoles.includes("viewer")) &&
    userPermissions.includes("view_camera") &&
    (
      // Allow access if user is assigned to the camera directly
      camera.userIds.includes(user.id) ||
      // Allow access if user is a member of a group assigned to the camera
      camera.groupIds.some(groupId => user.groupIds.includes(groupId))
    );

  return authorized;
}

// to be adapted based on specific data models and implement logic.
async function canRecordCamera(user, camera) {
  // Assuming roles and permissions are stored in separate tables linked to users
  const userRoles = await getUserRoles(user.id); // Replace with your data access logic
  const userPermissions = await getUserPermissions(user.id);

  // Assuming camera ownership is stored in a "user_camera" table
  const isCameraOwner = await isCameraOwner(user.id, camera.id);

  // Define your authorization criteria (replace with your specific logic)
  const authorized =
    (userRoles.includes("admin") || userRoles.includes("supervisor")) &&
    userPermissions.includes("record_camera") &&
    isCameraOwner;

  if (authorized) {
    return {
      authorized: true,
      // Add additional details if needed (e.g., recording duration limit)
    };
  } else {
    return {
      authorized: false,
      reason: "Insufficient permissions or not the camera owner",
    };
  }
}

// ... (implement other desired features like event detection, access control, etc.)
