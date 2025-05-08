const mongoose = require('mongoose');

const profilePictureSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    ref: 'User',
    unique: true // One profile picture per user
  },
  
  imageUrl: {
    type: String,
    required: true,
    maxlength: 10000000 // Allow for large base64 encoded images
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProfilePicture', profilePictureSchema); 