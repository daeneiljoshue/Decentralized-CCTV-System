const express = require('express');
const multer = require('multer'); // File upload middleware
const fs = require('fs'); // Local storage (consider alternatives like cloud storage)
const crypto = require('crypto'); // For file integrity checks
const { Camera, Permission, User } = require('../models'); // Assuming data models
const verifyToken = require('./users').verifyToken; // Assuming authorization middleware

const router = express.Router();

// File upload configuration (use a storage engine for cloud integration)
const upload = multer({
  dest: 'uploads/', // Temporary storage directory (adjust path as needed)
  limits: { fileSize: 10485760 }, // 10MB limit (customize)
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'), false);
    } else {
      cb(null, true);
    }
  },
});

// ... (existing authorization middleware)

// POST /uploads
router.post('/uploads', verifyToken, upload.single('file'), async (req, res) => {
  try {
    // Validate metadata (if provided) and extract relevant information
    const cameraId = req.body.cameraId;
    const timestamp = req.body.timestamp;
    const eventType = req.body.eventType;
    const location = req.body.location;

    // Validate metadata consistency and permissions
    if (!canUploadEvent(req.user, cameraId, eventType)) {
      return res.status(403).json({ message: 'Unauthorized to upload file for this event' });
    }

    // Generate a unique filename and store the file securely
    const filename = crypto.randomBytes(16).toString('hex') + '.mp4'; // Adapt file extension
    const filePath = `uploads/${filename}`;
    fs.renameSync(req.file.path, filePath); // Move uploaded file

    // Calculate MD5 hash for integrity check
    const hash = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');

    // Store information about the uploaded file in the database
    const uploadRecord = await Upload.create({
      filename,
      cameraId,
      timestamp,
      eventType,
      location,
      hash,
    });

    res.json(uploadRecord);
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.code === 'ENOENT') { // Handle missing file system directory
      return res.status(500).json({ message: 'Storage directory not found' });
    } else {
      // Other error handling (e.g., database errors, authentication)
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// GET /uploads/:filename (optional)
router.get('/uploads/:filename', verifyToken, async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = `uploads/${filename}`;
  
      // Access control: check user permissions based on camera or event type
      if (!canAccessUpload(req.user, filename)) {
        return res.status(403).json({ message: 'Unauthorized to access this file' });
      }
  
      // Verify file integrity (if applicable)
      if (req.query.hash) {
        const calculatedHash = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
        if (calculatedHash !== req.query.hash) {
          return res.status(400).json({ message: 'Invalid file integrity' });
        }
      }
  
      // Security considerations:
      // - Consider using temporary download links with expiration times.
      // - Set appropriate content-disposition headers for downloads.
      // - Filter or sanitize filenames to prevent potential vulnerabilities.
  
      // Choose streaming or download based on requirements:
  
      // Option 1: Stream the file for playback:
      const range = req.headers.range;
      if (range) {
        // Handle byte range requests for partial streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10) || 0;
        const end = parts[1] ? parseInt(parts[1], 10) : undefined;
        const headers = {
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end || (fs.statSync(filePath).size - 1)}/${fs.statSync(filePath).size}`,
          "Content-Type": mime.getType(filename), // Use a mime type library for proper content type based on extension
        };
        res.writeHead(206, headers);
        const fileStream = fs.createReadStream(filePath, { start, end });
        fileStream.pipe(res);
      } else {
        // Stream the entire file
        res.sendFile(filePath);
      }
  
      // Option 2: Provide download options:
      // res.download(filePath, 'video.mp4'); // Specify download filename
  
    } catch (error) {
      console.error('Error retrieving file:', error);
      if (error.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });
  