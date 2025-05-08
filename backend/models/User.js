const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: String,
  password: String,
<<<<<<< HEAD
  googleId: String,
=======
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841
  role: String
});

module.exports = mongoose.model('User', userSchema);