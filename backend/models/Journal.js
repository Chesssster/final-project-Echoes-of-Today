const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
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
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journal', journalSchema); 