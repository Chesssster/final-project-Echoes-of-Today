const express = require('express');
const router = express.Router();
const ProfilePicture = require('../models/ProfilePicture');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  const userId = req.method === 'GET' ? req.query.userId : req.body.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  // Store userId in req for later use
  req.userId = parseInt(userId);
  next();
};

// Upload or update profile picture
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { imageData, userId } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ message: 'Image data is required' });
    }
    
    // Validate image data format
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }
    
    // Validate image size (max 5MB)
    const base64Data = imageData.split(',')[1];
    const imageSize = Math.ceil((base64Data.length * 3) / 4);
    if (imageSize > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size too large. Maximum size is 5MB' });
    }
    
    // Ensure the requested userId matches the authenticated user
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Check if user already has a profile picture
    let profilePicture = await ProfilePicture.findOne({ userId });
    
    if (profilePicture) {
      // Update existing profile picture
      profilePicture.imageUrl = imageData;
      profilePicture.updatedAt = new Date();
      await profilePicture.save();
      res.status(200).json(profilePicture);
    } else {
      // Create new profile picture
      profilePicture = new ProfilePicture({
        userId,
        imageUrl: imageData
      });
      await profilePicture.save();
      res.status(201).json(profilePicture);
    }
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Get profile picture for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const profilePicture = await ProfilePicture.findOne({ userId });
    
    if (!profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }
    
    res.status(200).json(profilePicture);
  } catch (err) {
    console.error('Error fetching profile picture:', err);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

module.exports = router; 