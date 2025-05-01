const mongoose = require('mongoose');

const journalImagesSchema = new mongoose.Schema({
  journalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Journal'
  },
  
  userId: {
    type: Number,
    required: true,
    ref: 'User'
  },
  
  userName: {
    type: String,
    required: true
  },
  
  journalTitle: {
    type: String,
    required: true
  },
  
  imageUrl: {
    type: String,
    required: true,
    maxlength: 10000000 // Allow for large base64 encoded images
  },
  
  caption: {
    type: String,
    default: ''
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JournalImages', journalImagesSchema); 