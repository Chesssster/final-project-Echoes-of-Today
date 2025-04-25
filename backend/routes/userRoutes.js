const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Sequence = require('../models/Sequence');

// Create user
router.post('/', async (req, res) => {
  try {
    const sequenceDocument = await Sequence.findOneAndUpdate(
      { _id: 'userid' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    const user = new User({
      _id: sequenceDocument.sequence_value,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
