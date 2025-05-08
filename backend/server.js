// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
<<<<<<< HEAD
const session = require('express-session');
const passport = require('./config/passport');
=======
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
<<<<<<< HEAD
  origin: 'http://localhost:5000', // Adjust if using a different port or domain
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'echoes_of_today_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
=======
  origin: 'http://localhost:5500', // Adjust if using a different port or domain
  credentials: true
}));
<<<<<<< HEAD
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841

// Increase JSON limit for handling images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const writeRoutes = require('./routes/writeRoutes');
const journalImageRoutes = require('./routes/journalImageRoutes');
<<<<<<< HEAD
const profilePictureRoutes = require('./routes/profilePictureRoutes');
=======
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841

app.use('/api/users', userRoutes);
app.use('/api/journals', writeRoutes);
app.use('/api/journal-images', journalImageRoutes);
<<<<<<< HEAD
app.use('/api/profile-pictures', profilePictureRoutes);
=======
=======
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
>>>>>>> 2ba22d2ef45603f46e7b700ccae696117d2ae68f
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback for any unknown routes (for SPA or direct links)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
