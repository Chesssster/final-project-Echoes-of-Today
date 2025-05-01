const express = require('express');
const router = express.Router();
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

// Create a new journal entry
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, content, userId, userName } = req.body;
    
    const journal = new Journal({
      title,
      content,
      userId,
      userName,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await journal.save();
    res.status(201).json(journal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all journal entries for a specific user
router.get('/user/:userId', isAuthenticated, async (req, res) => {
  try {
    // Ensure the requested userId matches the authenticated user
    if (parseInt(req.params.userId) !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const journals = await Journal.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json(journals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific journal entry
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }
    
    // Ensure the journal belongs to the authenticated user
    if (journal.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a journal entry
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Find the journal first to check ownership
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }
    
    // Ensure the journal belongs to the authenticated user
    if (journal.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update the journal
    journal.title = title;
    journal.content = content;
    journal.updatedAt = new Date();
    
    await journal.save();
    res.status(200).json(journal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a journal entry
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    // Find the journal first to ensure it exists and belongs to the user
    const journal = await Journal.findById(req.params.id);
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }
    
    // Check if the journal belongs to the authenticated user
    if (journal.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Delete the journal
    await Journal.findByIdAndDelete(req.params.id);
    
    // Delete all associated images
    const JournalImages = require('../models/JournalImages');
    const deletedImages = await JournalImages.deleteMany({ journalId: req.params.id });
    console.log(`Deleted ${deletedImages.deletedCount} images associated with journal ${req.params.id}`);
    
    res.status(200).json({ 
      message: 'Journal deleted successfully',
      deletedImagesCount: deletedImages.deletedCount
    });
  } catch (err) {
    console.error('Error deleting journal:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
