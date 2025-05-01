const express = require('express');
const router = express.Router();
const JournalImages = require('../models/JournalImages');
const Journal = require('../models/Journal');

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

// Upload an image for a journal
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { journalId, userId, userName, journalTitle, imageUrl, caption } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'No image data provided' });
    }
    
    console.log(`Saving image for journal: ${journalId}, user: ${userId}`);
    console.log(`Image URL data length: ${imageUrl ? imageUrl.length : 0}`);
    
    // Verify the journal exists and belongs to the user
    const journal = await Journal.findById(journalId);
    if (!journal) {
      console.log(`Journal not found: ${journalId}`);
      return res.status(404).json({ message: 'Journal not found' });
    }
    
    if (journal.userId !== req.userId) {
      console.log(`Unauthorized: User ${req.userId} trying to add image to journal by user ${journal.userId}`);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const journalImage = new JournalImages({
      journalId,
      userId,
      userName,
      journalTitle,
      imageUrl,
      caption: caption || '',
      createdAt: new Date()
    });
    
    await journalImage.save();
    console.log(`Image saved successfully for journal: ${journalId}`);
    res.status(201).json(journalImage);
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get all images for a specific journal
router.get('/journal/:journalId', isAuthenticated, async (req, res) => {
  try {
    const { journalId } = req.params;
    console.log(`Fetching images for journal: ${journalId}, user: ${req.userId}`);
    
    // Verify the journal exists and belongs to the user
    const journal = await Journal.findById(journalId);
    if (!journal) {
      console.log(`Journal not found: ${journalId}`);
      return res.status(404).json({ message: 'Journal not found' });
    }
    
    if (journal.userId !== req.userId) {
      console.log(`Unauthorized: User ${req.userId} trying to access images from journal by user ${journal.userId}`);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const images = await JournalImages.find({ journalId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${images.length} images for journal: ${journalId}`);
    res.status(200).json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all images for a specific user
router.get('/user/:userId', isAuthenticated, async (req, res) => {
  try {
    // Ensure the requested userId matches the authenticated user
    if (parseInt(req.params.userId) !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const images = await JournalImages.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific image
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const image = await JournalImages.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Ensure the image belongs to the authenticated user
    if (image.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update image caption
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { caption } = req.body;
    
    // Find the image first to check ownership
    const image = await JournalImages.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Ensure the image belongs to the authenticated user
    if (image.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update the image caption
    image.caption = caption;
    
    await image.save();
    res.status(200).json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an image
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    // Find the image first to check ownership
    const image = await JournalImages.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Ensure the image belongs to the authenticated user
    if (image.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete the image
    await JournalImages.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 