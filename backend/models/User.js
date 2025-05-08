const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: String,
  password: String,
  googleId: String,
  role: String
});

module.exports = mongoose.model('User', userSchema);