require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function rehashPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB, fetching users...');

    const users = await User.find();
    for (const user of users) {
      // Skip already-hashed passwords (bcrypt hashes start with "$2")
      if (!user.password.startsWith('$2')) {
        const hashed = await bcrypt.hash(user.password, 10);
        user.password = hashed;
        await user.save();
        console.log(`Re-hashed password for user: ${user.email}`);
      } else {
        console.log(`Skipped already-hashed for user: ${user.email}`);
      }
    }

    console.log('Rehashing complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error rehashing passwords:', err);
    process.exit(1);
  }
}

rehashPasswords(); 